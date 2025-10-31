from typing import List, Optional
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status

from app.models.sqlalchemy_schemas.images import Images
from app.models.sqlalchemy_schemas.rooms import Rooms


async def create_image(
    db: AsyncSession,
    *,
    entity_type: str,
    entity_id: int,
    image_url: str,
    caption: Optional[str] = None,
    is_primary: bool = False,
    uploaded_by: Optional[int] = None,
) -> Images:
    # If the image is for a room, ensure room exists
    if entity_type == "room":
        res = await db.execute(select(Rooms).where(Rooms.room_id == entity_id))
        room = res.scalars().first()
        if not room:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Room not found")

    # If this image is primary, unset other primary images for the same entity
    if is_primary:
        await db.execute(
            update(Images)
            .where(Images.entity_type == entity_type)
            .where(Images.entity_id == entity_id)
            .values(is_primary=False)
        )

    data = {
        "entity_type": entity_type,
        "entity_id": entity_id,
        "image_url": image_url,
        "caption": caption,
        "is_primary": is_primary,
        "uploaded_by": uploaded_by,
    }

    obj = Images(**data)
    db.add(obj)
    await db.commit()
    await db.refresh(obj)
    return obj


async def get_images_for_room(db: AsyncSession, room_id: int) -> List[Images]:
    stmt = select(Images).where(Images.entity_type == "room").where(Images.entity_id == room_id).where(Images.is_deleted == False)
    res = await db.execute(stmt)
    items = res.scalars().all()
    return items


async def hard_delete_image(db: AsyncSession, image_id: int, requester_id: int | None = None, requester_permissions: dict | None = None) -> None:
    """Permanently delete an image row. Only the uploader or users with ROOM_MANAGEMENT.WRITE may delete.

    This removes the DB row; it does NOT attempt to delete remote file contents (external upload providers may
    require separate deletion APIs).
    """
    q = await db.execute(select(Images).where(Images.image_id == image_id))
    obj = q.scalars().first()
    if not obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Image not found")

    # If it's a room image, requester must either be uploader or have ROOM_MANAGEMENT.WRITE
    allowed = False
    if requester_id and obj.uploaded_by and requester_id == obj.uploaded_by:
        allowed = True
    if requester_permissions:
        if (
            "ROOM_MANAGEMENT" in requester_permissions
            and "WRITE" in requester_permissions.get("ROOM_MANAGEMENT", set())
        ):
            allowed = True

    if not allowed:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permissions to delete image")

    # Permanently delete the DB row
    await db.delete(obj)
    await db.commit()
    return None
