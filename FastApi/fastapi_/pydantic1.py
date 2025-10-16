from datetime import datetime
from typing import Optional, List, Dict, Any
from enum import Enum

from pydantic import (
    BaseModel, 
    PositiveInt, 
    EmailStr, 
    field_validator, 
    Field, 
    model_validator,
    ValidationError,
    HttpUrl,
    SecretStr,
    ConfigDict
)
from typing import Annotated


class User(BaseModel):
    id: int  
    name: str = 'John Doe'  
    signup_ts: datetime | None  
    tastes: dict[str, PositiveInt]  

external_data = {
    'id': 123,
    'signup_ts': '2019-06-01 12:22',  
    'tastes': {
        'wine': 9,
        b'cheese': 7,  
        'cabbage': '1',  
    },
}

user = User(**external_data)  

print("=== Basic User Example ===")
print(f"User ID: {user.id}")
print(f"User Data: {user.model_dump()}")


# =============================================================================
# ADVANCED PYDANTIC PRACTICES
# =============================================================================

# 1. FIELD VALIDATION WITH Field()
class Product(BaseModel):
    name: Annotated[str, Field(min_length=1, max_length=100, description="Product name")]
    price: Annotated[float, Field(gt=0, description="Product price must be positive")]
    quantity: Annotated[int, Field(ge=0, default=0, description="Available quantity")]
    description: Optional[str] = Field(None, max_length=500)
    tags: List[str] = Field(default_factory=list)
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "name": "Laptop",
                "price": 999.99,
                "quantity": 10,
                "description": "High-performance laptop",
                "tags": ["electronics", "computer"]
            }
        }
    )

# 2. CUSTOM VALIDATORS
class Person(BaseModel):
    first_name: str
    last_name: str
    age: int
    email: EmailStr
    phone: Optional[str] = None
    
    @field_validator('age')
    @classmethod
    def validate_age(cls, v):
        if v < 0:
            raise ValueError('Age must be positive')
        if v > 150:
            raise ValueError('Age must be realistic')
        return v
    
    @field_validator('phone')
    @classmethod
    def validate_phone(cls, v):
        if v is not None:
            # Simple phone validation
            import re
            if not re.match(r'^\+?1?\d{9,15}$', v):
                raise ValueError('Invalid phone number format')
        return v
    
    @model_validator(mode='before')
    @classmethod
    def validate_person(cls, values):
        if isinstance(values, dict):
            first_name = values.get('first_name')
            last_name = values.get('last_name')
            
            if first_name and last_name and first_name.lower() == last_name.lower():
                raise ValueError('First name and last name cannot be the same')
        
        return values
    
    @property
    def full_name(self) -> str:
        return f"{self.first_name} {self.last_name}"

# 3. ENUMS AND CHOICES
class UserRole(str, Enum):
    ADMIN = "admin"
    USER = "user"
    MODERATOR = "moderator"

class Status(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    PENDING = "pending"

class UserAccount(BaseModel):
    username: Annotated[str, Field(min_length=3, max_length=20)]
    password: SecretStr
    role: UserRole = UserRole.USER
    status: Status = Status.PENDING
    created_at: datetime = Field(default_factory=datetime.now)
    profile_url: Optional[HttpUrl] = None
    
    model_config = ConfigDict(use_enum_values=True)

# 4. NESTED MODELS
class Address(BaseModel):
    street: str
    city: str
    state: str
    zip_code: Annotated[str, Field(pattern=r'^\d{5}(-\d{4})?$')]
    country: str = "USA"

class Company(BaseModel):
    name: str
    address: Address
    employees: List[Person] = []
    
    @field_validator('employees')
    @classmethod
    def validate_employees(cls, v):
        if len(v) > 1000:
            raise ValueError('Too many employees')
        return v

# 5. OPTIONAL AND UNION TYPES
class APIResponse(BaseModel):
    success: bool
    data: Optional[Dict[str, Any]] = None
    error: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.now)
    
    @model_validator(mode='before')
    @classmethod
    def validate_response(cls, values):
        if isinstance(values, dict):
            success = values.get('success')
            data = values.get('data')
            error = values.get('error')
            
            if success and error:
                raise ValueError('Success response cannot have error')
            if not success and not error:
                raise ValueError('Failed response must have error message')
                
        return values

# 6. SERIALIZATION EXAMPLES
class SerializationExample(BaseModel):
    public_field: str
    private_field: str = Field(alias="private_field")
    computed_field: Optional[str] = None
    
    model_config = ConfigDict(populate_by_name=True)
        
    def __init__(self, **data):
        super().__init__(**data)
        self.computed_field = f"computed_{self.public_field}"

# =============================================================================
# PRACTICAL EXAMPLES
# =============================================================================

def demonstrate_pydantic_features():
    print("\n=== Pydantic Feature Demonstrations ===")
    
    # Product validation
    try:
        product = Product(
            name="Gaming Laptop",
            price=1299.99,
            quantity=5,
            description="High-end gaming laptop with RGB keyboard",
            tags=["gaming", "electronics", "laptop"]
        )
        print(f"\n✅ Valid Product: {product.name} - ${product.price}")
    except ValidationError as e:
        print(f"❌ Product validation failed: {e}")
    
    # Person validation with custom validators
    try:
        person = Person(
            first_name="John",
            last_name="Doe",
            age=30,
            email="john.doe@example.com",
            phone="+1234567890"
        )
        print(f"✅ Valid Person: {person.full_name}")
    except ValidationError as e:
        print(f"❌ Person validation failed: {e}")
    
    # User account with enums
    try:
        user_account = UserAccount(
            username="johndoe",
            password="secret123",
            role=UserRole.USER,
            profile_url="https://example.com/profile"
        )
        print(f"✅ Valid User Account: {user_account.username} ({user_account.role})")
    except ValidationError as e:
        print(f"❌ User account validation failed: {e}")
    
    # Nested models
    try:
        address = Address(
            street="123 Main St",
            city="New York",
            state="NY",
            zip_code="10001"
        )
        
        employee1 = Person(
            first_name="Alice",
            last_name="Smith",
            age=25,
            email="alice@company.com"
        )
        
        company = Company(
            name="Tech Corp",
            address=address,
            employees=[employee1]
        )
        print(f"✅ Valid Company: {company.name} with {len(company.employees)} employee(s)")
    except ValidationError as e:
        print(f"❌ Company validation failed: {e}")
    
    # API Response
    try:
        success_response = APIResponse(
            success=True,
            data={"message": "Operation completed successfully"}
        )
        print(f"✅ Success Response: {success_response.data}")
        
        error_response = APIResponse(
            success=False,
            error="Something went wrong"
        )
        print(f"✅ Error Response: {error_response.error}")
    except ValidationError as e:
        print(f"❌ API Response validation failed: {e}")

def demonstrate_validation_errors():
    print("\n=== Validation Error Examples ===")
    
    # Invalid product
    try:
        invalid_product = Product(
            name="",  # Empty name
            price=-10,  # Negative price
            quantity=-5  # Negative quantity
        )
    except ValidationError as e:
        print("❌ Product validation errors:")
        for error in e.errors():
            print(f"  - {error['loc']}: {error['msg']}")
    
    # Invalid person
    try:
        invalid_person = Person(
            first_name="John",
            last_name="John",  # Same as first name
            age=-5,  # Invalid age
            email="invalid-email",  # Invalid email
            phone="123"  # Invalid phone
        )
    except ValidationError as e:
        print("\n❌ Person validation errors:")
        for error in e.errors():
            print(f"  - {error['loc']}: {error['msg']}")

def demonstrate_serialization():
    print("\n=== Serialization Examples ===")
    
    person = Person(
        first_name="Jane",
        last_name="Doe",
        age=28,
        email="jane.doe@example.com"
    )
    
    # Different serialization formats
    print("Dict format:", person.model_dump())
    print("JSON format:", person.model_dump_json())
    print("JSON with indent:", person.model_dump_json(indent=2))
    
    # Exclude fields
    print("Without email:", person.model_dump(exclude={'email'}))
    
    # Include only specific fields
    print("Only name:", person.model_dump(include={'first_name', 'last_name'}))

# Run demonstrations
if __name__ == "__main__":
    demonstrate_pydantic_features()
    demonstrate_validation_errors()
    demonstrate_serialization()