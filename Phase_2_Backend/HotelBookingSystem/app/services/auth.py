import hashlib
import secrets
from datetime import datetime, timedelta
from jose import jwt
import uuid
from app.models.orm.users import Users
from app.models.orm.authentication import Sessions
from app.models.orm.authentication import Verifications, VerificationType
from app.models.orm.authentication import BlacklistedTokens, TokenType, RevokedType
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession
import smtplib
from email.message import EmailMessage
import os

# Load JWT configs from .env
SECRET_KEY = os.getenv("SECRET_KEY", "supersecretkey")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
# Default to 15 minutes for access tokens (refreshed frequently)
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 15))
# Default to 30 days for refresh tokens
REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", 30))


def _hash_password(plain: str) -> str:
    """Hash a password using PBKDF2-HMAC and return salt$hexhash"""
    salt = secrets.token_hex(16)
    dk = hashlib.pbkdf2_hmac("sha256", plain.encode(), salt.encode(), 100_000)
    return f"{salt}${dk.hex()}"


def _verify_password(stored: str, plain: str) -> bool:
    try:
        salt, hexhash = stored.split("$", 1)
    except ValueError:
        return False
    dk = hashlib.pbkdf2_hmac("sha256", plain.encode(), salt.encode(), 100_000)
    return dk.hex() == hexhash


# =====================================================
# 🔐 JWT TOKEN GENERATION
# =====================================================
def create_access_token(data: dict, expires_delta: timedelta | None = None, jti: str | None = None):
    """Create an access JWT. Optionally include a `jti` claim."""
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    if jti:
        to_encode.update({"jti": str(jti)})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt, expire


def create_refresh_token(data: dict, expires_delta: timedelta | None = None, jti: str | None = None):
    """Create a refresh JWT. Optionally include a `jti` claim."""
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS))
    to_encode.update({"exp": expire, "scope": "refresh_token"})
    if jti:
        to_encode.update({"jti": str(jti)})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt, expire


# =====================================================
# 👤 USER CREATION
# =====================================================
async def create_user(db, *, full_name: str, email: str, password: str, phone_number: str | None, role_id: int, status_id: int,created_by:int):
    hashed = _hash_password(password)
    user_obj = Users(
        full_name=full_name,
        email=email,
        hashed_password=hashed,
        phone_number=phone_number,
        role_id=role_id,
        status_id=status_id,
        created_by=created_by
    )
    db.add(user_obj)
    await db.commit()
    await db.refresh(user_obj)
    return user_obj


# =====================================================
# 🧾 AUTHENTICATION (LOGIN)
# =====================================================
async def authenticate_user(db, *, email: str, password: str):
    from sqlalchemy import select
    result = await db.execute(select(Users).where(Users.email == email))
    user = result.scalars().first()
    if not user:
        return None
    if not _verify_password(user.hashed_password, password):
        return None
    return user


# =====================================================
# 🪪 SESSION CREATION (JWT-ONLY)
# =====================================================
async def create_session(db, user, device_info: str | None = None, ip: str | None = None):
    # create a unique jti for this session and include it in both tokens
    session_jti = uuid.uuid4()
    access_token, access_exp = create_access_token({"sub": str(user.user_id)}, jti=str(session_jti))
    refresh_token, refresh_exp = create_refresh_token({"sub": str(user.user_id)}, jti=str(session_jti))

    session = Sessions(
        session_id=None,
        jti=session_jti,
        user_id=user.user_id,
        access_token=access_token,
        refresh_token=refresh_token,
        access_token_expires_at=access_exp,
        refresh_token_expires_at=refresh_exp,
        device_info=device_info,
        ip_address=ip,
    )
    db.add(session)
    await db.commit()
    await db.refresh(session)
    return session


# =====================================================
# 🔑 VERIFICATION / OTP HELPERS
# =====================================================
def _generate_otp(digits: int = 6) -> str:
    return f"{secrets.randbelow(10 ** digits):0{digits}d}"

async def create_verification(db: AsyncSession, user_id: int, verification_type: VerificationType, ip: str | None = None, expires_minutes: int = 10):
    """Create a verification/OTP record and (optionally) return the otp so caller can send it.

    NOTE: returning the OTP is useful for dev environments where SMTP isn't configured.
    """
    otp = _generate_otp(6)
    expires = datetime.utcnow() + timedelta(minutes=expires_minutes)
    v = Verifications(
        user_id=user_id,
        verification_type=verification_type,
        otp_code=otp,
        expires_at=expires,
        ip_address=ip,
    )
    db.add(v)
    await db.commit()
    await db.refresh(v)
    return v


async def verify_otp(db: AsyncSession, user_id: int, otp: str, verification_type: VerificationType, max_attempts: int = 5):
    """Verify an OTP for a user. Returns (True, verification_obj) on success, (False, reason) on failure.
    Marks record as verified when successful.
    """
    result = await db.execute(
        select(Verifications).where(
            Verifications.user_id == user_id,
            Verifications.verification_type == verification_type,
        ).order_by(Verifications.created_at.desc())
    )
    v = result.scalars().first()
    if not v:
        return False, "No verification found"
    # check expiration
    if v.expires_at and datetime.utcnow() > v.expires_at:
        return False, "OTP expired"
    # check attempts
    if v.attempt_count >= max_attempts:
        return False, "Max attempts exceeded"
    # verify
    if v.otp_code != otp:
        # increment attempt_count
        await db.execute(
            update(Verifications)
            .where(Verifications.verification_id == v.verification_id)
            .values(attempt_count=Verifications.attempt_count + 1)
        )
        await db.commit()
        return False, "Invalid OTP"

    # success: mark verified
    await db.execute(
        update(Verifications)
        .where(Verifications.verification_id == v.verification_id)
        .values(is_verified=True, verified_at=datetime.utcnow())
    )
    await db.commit()
    return True, v


async def update_user_password(db: AsyncSession, user: Users, new_password: str):
    """Hash and update the user's password."""
    hashed = _hash_password(new_password)
    await db.execute(
        update(Users)
        .where(Users.user_id == user.user_id)
        .values(hashed_password=hashed, last_password_updated=datetime.utcnow())
    )
    await db.commit()
    # refresh user object
    await db.refresh(user)
    return user


def _send_email(to_email: str, subject: str, body: str) -> bool:
    """Send a simple plain-text email using SMTP env configuration.

    Returns True on success, False if SMTP isn't configured or send failed.
    """
    SMTP_HOST = os.getenv("SMTP_HOST")
    SMTP_PORT = int(os.getenv("SMTP_PORT", "0")) if os.getenv("SMTP_PORT") else None
    SMTP_USER = os.getenv("SMTP_USER")
    SMTP_PASS = os.getenv("SMTP_PASS")
    SMTP_FROM = os.getenv("SMTP_FROM", "noreply@example.com")

    if not SMTP_HOST or not SMTP_PORT:
        # Not configured — caller should handle OTP display/logging in dev
        print(f"SMTP not configured, email to {to_email}: subject={subject} body={body}")
        return False

    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = SMTP_FROM
    msg["To"] = to_email
    msg.set_content(body)

    try:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as s:
            s.starttls()
            if SMTP_USER and SMTP_PASS:
                s.login(SMTP_USER, SMTP_PASS)
            s.send_message(msg)
        return True
    except Exception as e:
        print("Failed to send email:", e)
        return False


# =====================================================
# 🛡 TOKEN BLACKLIST / SESSION REVOCATION HELPERS
# =====================================================
def _hash_token(value: str) -> str:
    """Return a SHA-256 hex digest of the token value for storage in blacklist."""
    return hashlib.sha256(value.encode()).hexdigest()


async def blacklist_token(db: AsyncSession, *, user_id: int, session_id, token_value: str, token_type: TokenType, reason: str | None = None, revoked_type: RevokedType = RevokedType.MANUAL_REVOKED):
    """Store a hashed token in BlacklistedTokens table."""
    h = _hash_token(token_value)
    bt = BlacklistedTokens(
        user_id=user_id,
        session_id=session_id,
        token_type=token_type,
        token_value_hash=h,
        revoked_type=revoked_type,
        reason=reason,
    )
    db.add(bt)
    await db.commit()
    await db.refresh(bt)
    return bt


async def revoke_session(db: AsyncSession, *, session: Sessions, reason: str | None = None):
    """Revoke a session: blacklist its access and refresh tokens and mark session inactive.

    This will create BlacklistedTokens entries for both tokens and update the session row.
    """
    # Blacklist access token
    try:
        await blacklist_token(
            db,
            user_id=session.user_id,
            session_id=session.session_id,
            token_value=session.access_token,
            token_type=TokenType.ACCESS,
            reason=reason,
            revoked_type=RevokedType.MANUAL_REVOKED,
        )
    except Exception:
        # best-effort; continue
        pass

    # Blacklist refresh token
    try:
        await blacklist_token(
            db,
            user_id=session.user_id,
            session_id=session.session_id,
            token_value=session.refresh_token,
            token_type=TokenType.REFRESH,
            reason=reason,
            revoked_type=RevokedType.MANUAL_REVOKED,
        )
    except Exception:
        pass

    # mark session as inactive
    session.is_active = False
    session.revoked_at = datetime.utcnow()
    session.revoked_reason = reason
    db.add(session)
    await db.commit()
    await db.refresh(session)
    return session


async def refresh_access_token(db: AsyncSession, refresh_token_value: str):
    """Rotate tokens given a valid refresh token.

    - Validates refresh token signature/scope
    - Finds session by refresh_token
    - Ensures session is active and refresh not expired
    - Blacklists old refresh token and generates new access + refresh tokens
    - Updates session with new tokens and expiries
    Returns updated session
    """
    from jose import JWTError
    from sqlalchemy import select

    # decode & validate
    try:
        payload = jwt.decode(refresh_token_value, SECRET_KEY, algorithms=[ALGORITHM])
        # ensure scope
        if payload.get("scope") != "refresh_token":
            raise JWTError("Invalid token scope")
        user_id = int(payload.get("sub"))
    except JWTError as e:
        raise e

    # find session by refresh_token
    result = await db.execute(select(Sessions).where(Sessions.refresh_token == refresh_token_value))
    session = result.scalars().first()
    if not session:
        # session must exist for the given refresh token
        raise Exception("Session not found for refresh token")

    # Strict checks: session must be active and not revoked
    if not session.is_active or session.revoked_at is not None:
        raise Exception("Session is revoked or inactive")

    # Ensure refresh token on session matches provided token (defense-in-depth)
    if session.refresh_token != refresh_token_value:
        raise Exception("Refresh token mismatch")

    # Check stored refresh expiry
    if session.refresh_token_expires_at and datetime.utcnow() > session.refresh_token_expires_at:
        # mark session revoked for hygiene
        await revoke_session(db, session=session, reason="refresh_expired")
        raise Exception("Refresh token expired")

    # Passed checks — issue a NEW access token only (no refresh rotation)
    new_access, new_access_exp = create_access_token({"sub": str(session.user_id)}, jti=str(session.jti))

    # update session with new access token and last active timestamp
    session.access_token = new_access
    session.access_token_expires_at = new_access_exp
    session.last_active = datetime.utcnow()
    db.add(session)
    await db.commit()
    await db.refresh(session)
    return session
