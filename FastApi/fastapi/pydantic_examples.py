"""
COMPREHENSIVE PYDANTIC PRACTICES GUIDE
=====================================

This file demonstrates various Pydantic features and best practices including:

1. BASIC VALIDATION:
   - Type hints for automatic validation
   - Optional fields with defaults
   - Automatic type coercion

2. FIELD VALIDATION:
   - Field constraints (min_length, max_length, gt, ge, etc.)
   - Field descriptions and examples
   - Default values and factories

3. CUSTOM VALIDATORS:
   - @field_validator for individual field validation
   - @model_validator for cross-field validation
   - Custom validation logic with error messages

4. ENUMS AND CHOICES:
   - String enums for predefined choices
   - Integration with Pydantic models
   - Automatic value validation

5. NESTED MODELS:
   - Models containing other models
   - Lists of models
   - Complex data structures

6. SERIALIZATION:
   - model_dump() for dictionary output
   - model_dump_json() for JSON output
   - Include/exclude fields during serialization
   - Custom serializers with @field_serializer

7. ADVANCED FEATURES:
   - Computed fields and properties
   - Generic models with TypeVar
   - Model inheritance
   - Self-referencing models (forward references)
   - Dataclass integration

8. PARSING:
   - Parse from JSON strings
   - Parse from dictionaries  
   - Parse with field aliases
   - Validation error handling

9. JSON SCHEMA:
   - Automatic schema generation
   - OpenAPI compatibility
   - Documentation integration

10. BEST PRACTICES:
    - Use type hints consistently
    - Add field descriptions
    - Handle validation errors gracefully
    - Use appropriate field constraints
    - Leverage computed fields for derived data
"""

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

# =============================================================================
# ADDITIONAL ADVANCED PYDANTIC FEATURES
# =============================================================================

# 7. COMPUTED FIELDS AND PROPERTIES
from pydantic import computed_field

class StudentGrades(BaseModel):
    name: str
    math_score: Annotated[float, Field(ge=0, le=100)]
    science_score: Annotated[float, Field(ge=0, le=100)]
    english_score: Annotated[float, Field(ge=0, le=100)]
    
    @computed_field
    @property
    def average_score(self) -> float:
        return (self.math_score + self.science_score + self.english_score) / 3
    
    @computed_field
    @property
    def grade_letter(self) -> str:
        avg = self.average_score
        if avg >= 90: return "A"
        elif avg >= 80: return "B"
        elif avg >= 70: return "C"
        elif avg >= 60: return "D"
        else: return "F"

# 8. DATACLASSES INTEGRATION
from pydantic.dataclasses import dataclass

@dataclass
class Point:
    x: float
    y: float
    
    def distance_from_origin(self) -> float:
        return (self.x ** 2 + self.y ** 2) ** 0.5

# 9. GENERIC MODELS
from typing import TypeVar, Generic

T = TypeVar('T')

class APIResult(BaseModel, Generic[T]):
    success: bool
    data: Optional[T] = None
    message: Optional[str] = None
    error_code: Optional[int] = None

# Usage examples for generic models
class UserData(BaseModel):
    id: int
    username: str

class ProductData(BaseModel):
    id: int
    name: str
    price: float

# 10. MODEL INHERITANCE
class BaseEntity(BaseModel):
    id: int
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: Optional[datetime] = None
    is_active: bool = True

class BlogPost(BaseEntity):
    title: Annotated[str, Field(min_length=1, max_length=200)]
    content: str
    author_id: int
    tags: List[str] = Field(default_factory=list)
    
    @field_validator('content')
    @classmethod
    def validate_content(cls, v):
        if len(v.strip()) < 10:
            raise ValueError('Content must be at least 10 characters long')
        return v.strip()

# 11. FORWARD REFERENCES AND SELF-REFERENCES
class Category(BaseModel):
    name: str
    parent: Optional['Category'] = None
    children: List['Category'] = Field(default_factory=list)

# Update forward references
Category.model_rebuild()

# 12. CUSTOM SERIALIZATION
from pydantic import field_serializer

class Event(BaseModel):
    name: str
    date: datetime
    attendees: List[str] = Field(default_factory=list)
    
    @field_serializer('date')
    def serialize_date(self, value: datetime) -> str:
        return value.strftime("%Y-%m-%d %H:%M:%S")
    
    @field_serializer('attendees')
    def serialize_attendees(self, value: List[str]) -> str:
        return ", ".join(value) if value else "No attendees"

def demonstrate_advanced_features():
    print("\n=== Advanced Pydantic Features ===")
    
    # Computed fields
    try:
        student = StudentGrades(
            name="Alice",
            math_score=85.5,
            science_score=92.0,
            english_score=78.5
        )
        print(f"✅ Student: {student.name}")
        print(f"   Average Score: {student.average_score:.2f}")
        print(f"   Grade: {student.grade_letter}")
    except ValidationError as e:
        print(f"❌ Student validation failed: {e}")
    
    # Dataclass
    try:
        point = Point(x=3.0, y=4.0)
        print(f"✅ Point: ({point.x}, {point.y})")
        print(f"   Distance from origin: {point.distance_from_origin():.2f}")
    except ValidationError as e:
        print(f"❌ Point validation failed: {e}")
    
    # Generic models
    try:
        user_result = APIResult[UserData](
            success=True,
            data=UserData(id=1, username="johndoe"),
            message="User retrieved successfully"
        )
        print(f"✅ User API Result: {user_result.data.username}")
        
        product_result = APIResult[ProductData](
            success=True,
            data=ProductData(id=1, name="Laptop", price=999.99),
            message="Product retrieved successfully"
        )
        print(f"✅ Product API Result: {product_result.data.name}")
    except ValidationError as e:
        print(f"❌ Generic model validation failed: {e}")
    
    # Model inheritance
    try:
        blog_post = BlogPost(
            id=1,
            title="Introduction to Pydantic",
            content="Pydantic is a powerful data validation library for Python that uses type hints...",
            author_id=123,
            tags=["python", "pydantic", "validation"]
        )
        print(f"✅ Blog Post: {blog_post.title}")
        print(f"   Created: {blog_post.created_at.strftime('%Y-%m-%d %H:%M')}")
        print(f"   Tags: {', '.join(blog_post.tags)}")
    except ValidationError as e:
        print(f"❌ Blog post validation failed: {e}")
    
    # Self-referencing models
    try:
        root_category = Category(name="Electronics")
        sub_category = Category(name="Laptops", parent=root_category)
        root_category.children.append(sub_category)
        
        print(f"✅ Category: {root_category.name}")
        print(f"   Children: {[child.name for child in root_category.children]}")
    except ValidationError as e:
        print(f"❌ Category validation failed: {e}")
    
    # Custom serialization
    try:
        event = Event(
            name="Python Conference",
            date=datetime.now(),
            attendees=["Alice", "Bob", "Charlie"]
        )
        print(f"✅ Event: {event.name}")
        event_dict = event.model_dump()
        print(f"   Date: {event_dict['date']}")
        print(f"   Attendees: {event_dict['attendees']}")
    except ValidationError as e:
        print(f"❌ Event validation failed: {e}")

def demonstrate_json_schema():
    print("\n=== JSON Schema Generation ===")
    
    # Generate JSON schema for models
    product_schema = Product.model_json_schema()
    print("Product JSON Schema keys:", list(product_schema.keys()))
    
    person_schema = Person.model_json_schema()
    print("Person JSON Schema properties:", list(person_schema.get('properties', {}).keys()))

def demonstrate_parsing_from_different_sources():
    print("\n=== Parsing from Different Sources ===")
    
    # Parse from JSON string
    json_data = '{"first_name": "John", "last_name": "Doe", "age": 30, "email": "john@example.com"}'
    person_from_json = Person.model_validate_json(json_data)
    print(f"✅ From JSON: {person_from_json.full_name}")
    
    # Parse from dictionary
    dict_data = {
        "first_name": "Jane",
        "last_name": "Smith", 
        "age": 25,
        "email": "jane@example.com"
    }
    person_from_dict = Person.model_validate(dict_data)
    print(f"✅ From Dict: {person_from_dict.full_name}")
    
    # Parse with alias
    serialization_data = {
        "public_field": "test",
        "private_field": "hidden"  # Using alias
    }
    serialization_example = SerializationExample.model_validate(serialization_data)
    print(f"✅ With Alias: {serialization_example.public_field}")

# Run demonstrations
if __name__ == "__main__":
    demonstrate_pydantic_features()
    demonstrate_validation_errors()
    demonstrate_serialization()
    demonstrate_advanced_features()
    demonstrate_json_schema()
    demonstrate_parsing_from_different_sources()