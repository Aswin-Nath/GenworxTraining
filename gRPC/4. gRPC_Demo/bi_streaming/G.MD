**DATABASE DESIGN SPECIFICATION**

**CREATED BY – ASWINNATH TE**

**VERSION – 1.0**

**DATE – 08/10/2025**

# **1. INTRODUCTION**

### **1.1 Purpose**

This **Database Design Specification (DDS)** document outlines the detailed structure and design considerations for the **Hotel Booking System (HBS)**, an online platform for managing hotel operations, reservations, and customer engagement. The platform supports user registration, authentication, room and booking management, payments, refunds, issue tracking, feedback collection, and real-time notifications.

The system’s **primary datastore is PostgreSQL (≈80% of data/workload)**, handling all core transactional, relational, and analytical use cases, while **MongoDB (≈20%)** is used for logs, content management, and backup metadata.

---

### **1.2 Scope**

The HBS database supports:

- Secure management of user accounts (customers and administrators)
- Room type and amenity management
- Booking creation, modification, and cancellation workflows
- Payment and refund processing with full audit trails
- Issue reporting, tracking, and chat-based resolution
- Verified review management and admin response handling
- Centralized notification system for customers and admins
- Role-based access control and session management
- Reporting and analytics for hotel performance and user activity
- Metadata storage for enumerations, reference values, and audit logs

---

### **1.3 Definitions and Acronyms**

**DDS:** Database Design Specification

**PK:** Primary Key

**FK:** Foreign Key (PostgreSQL)

**_id:** MongoDB Object ID (ObjectID)

**TTL:** Time To Live

**RDBMS:** Relational Database Management System

**CMS:** Content Management System

**API:** Application Programming Interface

**ACID:** Atomicity, Consistency, Isolation, Durability

---

# **2. DATABASE ARCHITECTURE**

### **2.1 Database Management Systems Used**

- **Architecture:** Polyglot Persistence
- **Primary DBMS:** PostgreSQL 15+ *(≈80% of data/workload)*
- **Secondary DBMS:** MongoDB 7+ *(≈20% of data/workload)*
- **Character Set (PostgreSQL):** UTF-8
- **Collation (PostgreSQL):** `en_US.UTF-8` or suitable locale-collation depending on deployment

---

### **2.2 Why Hybrid?**

- **PostgreSQL** is the backbone of the system, responsible for maintaining **ACID compliance**, **relational integrity**, and **transactional operations** involving users, rooms, bookings, payments, refunds, issues, reviews, and notifications.
- **MongoDB** complements the relational core by handling **high-volume, unstructured, or dynamic data** such as logs, CMS content (offers, banners, FAQs, policies), and backup metadata.
- This **hybrid model** enables the platform to:
    - Scale efficiently for read-heavy, document-centric workloads.
    - Maintain referential consistency for mission-critical transactional data.
    - Support analytics and reporting through PostgreSQL’s advanced SQL capabilities.
    - Enable low-latency data ingestion and flexible schema evolution via MongoDB.

---

### **2.3 Naming Conventions**

- **Tables/Collections:** lowercase with underscores (e.g., `bookings`, `room_types`, `refund_logs`)
- **Columns/Fields:** lowercase with underscores (e.g., `booking_id`, `user_id`, `created_at`)
- **Primary Keys:**
    - PostgreSQL → `id` or `<table_name>_id` (usually SERIAL or UUID)
    - MongoDB → `_id` (ObjectID)
- **Foreign Keys:** `<referenced_table>_id` (e.g., `customer_id`, `room_id`, `booking_id`)
- **Indexes:** `idx_<table>_<column>` (e.g., `idx_bookings_customer_id`)
- **Constraints:** `fk_<table>_<column>`, `chk_<table>_<condition>`

---

### **2.4 Operational Considerations**

- **Encryption & Security:**
    - Enable **column-level encryption** in PostgreSQL for sensitive data (e.g., payment details, credentials).
    - Enable **field-level encryption** in MongoDB for PII and security logs.
    - All connections between services and databases are secured via **TLS/SSL** with **VPC network isolation** and **role-based least-privilege access**.
- **Performance Optimization:**
    - Use **TTL indexes** in MongoDB for temporary collections (e.g., backup sessions, transient logs).
    - Apply **composite indexes** in PostgreSQL on high-frequency queries (e.g., `(customer_id, status)` in `bookings`).
    - Implement **descending indexes** on timestamp fields for fast retrieval of recent data.
    - Partition large PostgreSQL tables (like `bookings`, `payments`, `audit_log`) by year for scalability.
- **Audit & Recovery:**
    - Every transactional mutation in PostgreSQL triggers an **audit log entry**.
    - MongoDB stores immutable operational logs to support **forensic traceability** and **backup verification**.

---

### **2.5 Additional Information**

- PostgreSQL manages **core entities**: users, admins, rooms, bookings, payments, refunds, issues, reviews, notifications, and audit trails.
- MongoDB manages **supporting entities**: content documents (offers, banners, FAQs, hotel info), logs (API, backup, and admin activity), and backup metadata.
- All **cross-database references** use shared canonical keys (e.g., `booking_id`, `room_type_id`) for seamless correlation between SQL and NoSQL layers.
- Every major foreign key in PostgreSQL has a corresponding **B-tree index** for optimized joins and reporting.
- Application-level validation ensures synchronization between PostgreSQL and MongoDB entities, maintaining **data consistency across the hybrid layer**.

---

## **3. Entity Relationship Diagram**

Link: https://dbdiagram.io/d/68e58561d2b621e422bd9b3f

![full.png](attachment:d1dd7839-6355-4718-9ed2-64f8d7ec6d05:full.png)

---

## **3.1 Overview**

The **Hotel Booking System (HBS)** implements a **polyglot persistence architecture**, integrating both **relational (PostgreSQL)** and **document-oriented (MongoDB)** data models.

This unified ERD consolidates **transactional data (PostgreSQL)**, **contextual extensions (MongoDB)**, and **event-driven operational logs**, enabling both **ACID reliability** and **scalable flexibility** across hotel management workflows.

PostgreSQL anchors all mission-critical operations — users, rooms, bookings, payments, issues, and refunds — while MongoDB augments it with high-velocity, schema-flexible datasets such as logs, content documents, and backup metadata.

---

## **3.2 Core PostgreSQL Entities and Relationships**

| Entity | Description |
| --- | --- |
| **users** | Central identity registry for both customers and administrators. |
| **users_utility** | Reference table defining user roles and types (e.g., `CUSTOMER`, `ADMIN`). |
| **customers** | Stores customer profiles, personal info, contact details, and loyalty points. |
| **customers_credentials** | Contains encrypted password hashes for customers. |
| **admins** | Administrative accounts with hierarchical privileges. |
| **admin_credentials** | Stores encrypted admin passwords. |
| **admin_permissions / admin_permission_map** | Defines granular access rights and maps them to admins. |
| **sessions** | Tracks authentication sessions with JWT tokens and device metadata. |
| **room_types** | Defines room categories, pricing, and occupancy constraints. |
| **rooms** | Represents individual room inventory tied to a room type. |
| **room_amenities / room_amenity_map** | Defines amenities and many-to-many mappings between rooms and amenities. |
| **bookings** | Captures all reservation records, including duration, price, and customer linkage. |
| **booking_room_map** | Resolves many-to-many relationships between bookings and rooms. |
| **booking_edit_history** | Maintains revision history for booking modifications and reschedules. |
| **payments** | Tracks payment transactions, methods, and statuses. |
| **refunds** | Manages refund requests and workflow states. |
| **refund_room_map** | Maps partial refunds to individual rooms for multi-room bookings. |
| **issues** | Customer-reported issues linked to specific bookings or rooms. |
| **issue_chat** | Message threads between customers and admins for resolving issues. |
| **reviews / review_response** | Captures customer reviews and corresponding single admin replies. |
| **offers / offer_room_map** | Manages promotional campaigns and their room-type associations. |
| **notifications** | Handles real-time and scheduled notifications for users and admins. |
| **wishlist** | Stores user-saved or favorited room types. |
| **images** | Centralized table storing URLs and metadata for images related to rooms, issues, users, and offers. |
| **audit_log** | Immutable record of all data-change events across SQL entities, mirrored in Mongo logs for compliance. |

---

## **3.3 MongoDB Collections (Extensions)**

| Collection | Purpose | SQL References |
| --- | --- | --- |
| **api_logs** | Captures all API request and response logs with metadata like latency, device, and user. | `users`, `admins` |
| **backup_restore_logs** | Tracks backup, restore, and verification job executions for database resilience. | None |
| **content_docs** | CMS-driven dynamic content such as banners, promotions, announcements, and testimonials. | `admins` |
| **facilities_docs** | Details on hotel facilities, categorized by type (wellness, dining, fitness, etc.). | None |
| **hotel_info_docs** | Contains informational sections like check-in/out policies and general hotel info. | None |
| **policies_docs** | Stores compliance policies — privacy, cancellation, and terms of service. | None |
| **faqs_docs** | Manages frequently asked questions and responses for frontend display. | None |

---

## **3.4 Interaction Flow Summary**

1. **Transactional Layer (PostgreSQL):**
    
    Manages all critical operations — user authentication, bookings, payments, refunds, issues, reviews, and notifications — under strict ACID constraints.
    
2. **Document Layer (MongoDB):**
    
    Extends the system with append-only logs, CMS content, and metadata for operational insights, backup audits, and non-transactional content delivery.
    
3. **API Bridge (Cross-Sync):**
    - PostgreSQL triggers push structured events to MongoDB (e.g., new booking → insert booking log).
    - MongoDB enriches API responses with contextual overlays (e.g., content, facilities, logs).
4. **Administrative Orchestration:**
    
    Admins operate as control nodes — governing content updates, issue resolution, and audit validation — bridging both databases for a unified operational experience.
    

---

# **4. TABLE SPECIFICATIONS**

## **4.1 UTILITY TABLES / TYPES**

### **`users_utility`**

**Purpose:** User types (`ADMIN`, `SUPERADMIN`, `CUSTOMER`)

| Column | Type | Constraints | Description |
| --- | --- | --- | --- |
| type_id | SERIAL | PK | Identity |
| type_name | VARCHAR(50) | UNIQUE NOT NULL | Role name |
| description | TEXT | NULL | Optional notes |
| created_at | TIMESTAMP | DEFAULT now() | Creation timestamp |

```sql
CREATE TABLE users_utility (
    type_id SERIAL PRIMARY KEY,
    type_name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT now()
);
```

---

### **ENUM TYPE DEFINITIONS**

```sql
-- ==========================================================
-- ENUM TYPE DEFINITIONS
-- ==========================================================

CREATE TYPE account_status  AS ENUM ('ACTIVE','BLOCKED','DISABLED','DELETED');
CREATE TYPE gender_types    AS ENUM ('Male','Female','Other');
CREATE TYPE room_status     AS ENUM ('AVAILABLE','BOOKED','MAINTENANCE','FREEZED');
CREATE TYPE freeze_reason   AS ENUM ('MAINTENANCE','ADMIN_LOCK');
CREATE TYPE booking_status  AS ENUM ('PENDING','CONFIRMED','CHECKED_IN','CHECKED_OUT','CANCELLED');
CREATE TYPE payment_method  AS ENUM ('CARD','UPI','NETBANKING','WALLET');
CREATE TYPE payment_status  AS ENUM ('SUCCESS','PENDING','FAILED');
CREATE TYPE refund_type     AS ENUM ('FULL_BOOKING','PARTIAL_ROOM');
CREATE TYPE refund_status   AS ENUM ('INITIATED','PROCESSING','COMPLETED','REJECTED');
CREATE TYPE issue_status    AS ENUM ('PENDING','IN_PROGRESS','RESOLVED','CLOSED','CANCELLED');
CREATE TYPE booking_edit_type AS ENUM ('PRE', 'POST');
CREATE TYPE booking_edit_action AS ENUM ('MODIFIED', 'REMOVED');

```

---

## **4.2 USER / AUTH TABLES**

### **`users`**

| Column | Type | Constraints | Description |
| --- | --- | --- | --- |
| user_id | SERIAL | PK | Identity |
| type_id | INT | NOT NULL REFERENCES users_utility(type_id) | Role type |
| status | account_status | DEFAULT 'ACTIVE' | Lifecycle state |
| is_deleted | BOOLEAN | DEFAULT FALSE | Soft-delete flag |
| created_at | TIMESTAMP | DEFAULT now() | Creation time |
| updated_at | TIMESTAMP | DEFAULT now() | Update time |

```sql
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    type_id INT NOT NULL REFERENCES users_utility(type_id),
    status account_status DEFAULT 'ACTIVE',
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

```

---

### **`customers`**

| Column | Type | Constraints | Description |
| --- | --- | --- | --- |
| customer_id | SERIAL | PK | Identity |
| user_id | INT | UNIQUE NOT NULL REFERENCES users(user_id) ON DELETE RESTRICT | FK to users |
| full_name | VARCHAR(200) | NOT NULL | Name |
| dob | DATE | NOT NULL | Date of birth |
| gender | gender_types | DEFAULT 'Other' | Gender |
| email | VARCHAR(150) | UNIQUE NOT NULL | Email |
| phone_number | VARCHAR(15) | UNIQUE NOT NULL | Phone |
| loyalty_points | INT | DEFAULT 0 | Rewards |
| is_deleted | BOOLEAN | DEFAULT FALSE | Soft delete |
| created_at | TIMESTAMP | DEFAULT now() | Creation |
| updated_at | TIMESTAMP | DEFAULT now() | Updated |

```sql
CREATE TABLE customers (
    customer_id SERIAL PRIMARY KEY,
    user_id INT UNIQUE NOT NULL REFERENCES users(user_id) ON DELETE RESTRICT,
    full_name VARCHAR(200) NOT NULL,
    dob DATE NOT NULL,
    gender gender_types DEFAULT 'Other',
    email VARCHAR(150) UNIQUE NOT NULL,
    phone_number VARCHAR(15) UNIQUE NOT NULL,
    loyalty_points INT DEFAULT 0,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

```

---

### **`customers_credentials`**

| Column | Type | Constraints | Description |
| --- | --- | --- | --- |
| customer_id | INT | PK REFERENCES customers(customer_id) ON DELETE CASCADE | FK |
| hashed_password | TEXT | NOT NULL | bcrypt hash |
| last_updated | TIMESTAMP | DEFAULT now() | Change time |

```sql
CREATE TABLE customers_credentials (
    customer_id INT PRIMARY KEY REFERENCES customers(customer_id) ON DELETE CASCADE,
    hashed_password TEXT NOT NULL,
    last_updated TIMESTAMP DEFAULT now()
);
```

---

### **Admin Subsystem**

### **`admins`**

| Column | Type | Constraints | Description |
| --- | --- | --- | --- |
| admin_id | SERIAL | PK | Identity |
| user_id | INT | UNIQUE NOT NULL REFERENCES users(user_id) ON DELETE RESTRICT | FK |
| admin_name | VARCHAR(200) | NOT NULL | Name |
| admin_dob | DATE | NULL | DOB |
| email | VARCHAR(150) | UNIQUE NOT NULL | Email |
| gender | gender_types | DEFAULT 'Other' | Gender |
| created_by | INT | REFERENCES admins(admin_id) | Creator admin |
| created_at | TIMESTAMP | DEFAULT now() | Created |
| is_deleted | BOOLEAN | DEFAULT FALSE | Soft delete |

```sql
CREATE TABLE admins (
    admin_id SERIAL PRIMARY KEY,
    user_id INT UNIQUE NOT NULL REFERENCES users(user_id) ON DELETE RESTRICT,
    admin_name VARCHAR(200) NOT NULL,
    admin_dob DATE,
    email VARCHAR(150) UNIQUE NOT NULL,
    gender gender_types DEFAULT 'Other',
    created_by INT REFERENCES admins(admin_id),
    created_at TIMESTAMP DEFAULT now(),
    is_deleted BOOLEAN DEFAULT FALSE
);

	
```

### **`admin_credentials`**

```sql
CREATE TABLE admin_credentials (
    admin_id INT PRIMARY KEY REFERENCES admins(admin_id) ON DELETE CASCADE,
    hashed_password TEXT NOT NULL,
    last_updated TIMESTAMP DEFAULT now()
);

```

### **`admin_permissions`**

```sql
CREATE TABLE admin_permissions (
    permission_id SERIAL PRIMARY KEY,
    permission_key VARCHAR(50) UNIQUE NOT NULL,
    description TEXT
);

```

### **`admin_permission_map`**

```sql
CREATE TABLE admin_permission_map (
    admin_id INT NOT NULL REFERENCES admins(admin_id) ON DELETE CASCADE,
    permission_id INT NOT NULL REFERENCES admin_permissions(permission_id) ON DELETE CASCADE,
    PRIMARY KEY (admin_id, permission_id)

```

---

### **`sessions`**

**Purpose:** Centralized session tracker for both admins & customers.

| Column | Type | Constraints | Description |
| --- | --- | --- | --- |
| session_id | UUID | PK, DEFAULT gen_random_uuid() | Unique session ID |
| user_id | INT | NOT NULL REFERENCES users(user_id) ON DELETE CASCADE | Linked user |
| access_token | TEXT | NOT NULL | JWT token |
| refresh_token | TEXT | UNIQUE NOT NULL | Renewal token |
| access_token_expires_at | TIMESTAMP | NOT NULL | Access expiry |
| refresh_token_expires_at | TIMESTAMP | NOT NULL | Refresh expiry |
| device_info | TEXT | NULL | Device meta |
| ip_address | VARCHAR(45) | NULL | IP (v4/v6) |
| login_time | TIMESTAMP | DEFAULT now() | Login timestamp |
| last_active | TIMESTAMP | DEFAULT now() | Last API activity |
| is_active | BOOLEAN | DEFAULT TRUE | Session validity |
| revoked_at | TIMESTAMP | NULL | Revocation time |

```sql
CREATE TABLE sessions (
    session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    access_token TEXT NOT NULL,
    refresh_token TEXT UNIQUE NOT NULL,
    access_token_expires_at TIMESTAMP NOT NULL,
    refresh_token_expires_at TIMESTAMP NOT NULL,
    device_info TEXT,
    ip_address VARCHAR(45),
    login_time TIMESTAMP DEFAULT now(),
    last_active TIMESTAMP DEFAULT now(),
    is_active BOOLEAN DEFAULT TRUE,
    revoked_at TIMESTAMP
);

```

---

# **4.3 ROOMS MANAGEMENT**


### **`room_types`**

**Purpose:**

Defines types or categories of rooms (e.g., Deluxe, Suite, Economy) with standard capacity and pricing.

| Column | Type | Constraints | Description |
| --- | --- | --- | --- |
| room_type_id | SERIAL | PK | Unique identifier |
| type_name | VARCHAR(50) | UNIQUE NOT NULL | Room type name |
| max_adult_count | SMALLINT | NOT NULL CHECK (max_adult_count >= 1) | Max adults |
| max_child_count | SMALLINT | DEFAULT 0 CHECK (max_child_count >= 0) | Max children |
| price_per_night | NUMERIC(12,2) | NOT NULL CHECK (price_per_night >= 0) | Price per night |
| description | TEXT | NULL | Room description |
| is_deleted | BOOLEAN | DEFAULT FALSE | Soft delete |
| created_at | TIMESTAMP | DEFAULT now() | Creation |
| updated_at | TIMESTAMP | DEFAULT now() | Update |

```sql
CREATE TABLE room_types (
    room_type_id SERIAL PRIMARY KEY,
    type_name VARCHAR(50) UNIQUE NOT NULL,
    max_adult_count SMALLINT NOT NULL CHECK (max_adult_count >= 1),
    max_child_count SMALLINT DEFAULT 0 CHECK (max_child_count >= 0),
    price_per_night NUMERIC(12,2) NOT NULL CHECK (price_per_night >= 0),
    description TEXT,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

```

---

### **`rooms`**

**Purpose:**

Maintains actual room inventory mapped to `room_types`. Includes freeze states and concurrent booking protection.

| Column | Type | Constraints | Description |
| --- | --- | --- | --- |
| room_id | SERIAL | PK | Unique identifier |
| room_no | VARCHAR(20) | UNIQUE NOT NULL | Room number |
| room_type_id | INT | NOT NULL REFERENCES room_types(room_type_id) | Type link |
| room_status | room_status | DEFAULT 'AVAILABLE' | Lifecycle state |
| freeze_reason | freeze_reason | DEFAULT NULL | Reason if locked |
| is_currently_under_process | BOOLEAN | DEFAULT FALSE | Temporary booking lock |
| is_deleted | BOOLEAN | DEFAULT FALSE | Soft delete |
| created_at | TIMESTAMP | DEFAULT now() | Creation |
| updated_at | TIMESTAMP | DEFAULT now() | Update |

```sql
CREATE TABLE rooms (
    room_id SERIAL PRIMARY KEY,
    room_no VARCHAR(20) UNIQUE NOT NULL,
    room_type_id INT NOT NULL REFERENCES room_types(room_type_id),
    room_status room_status DEFAULT 'AVAILABLE',
    freeze_reason freeze_reason DEFAULT NULL,
    is_currently_under_process BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

```

---

### **`room_amenities`**

**Purpose:**

Stores list of possible room amenities.

| Column | Type | Constraints | Description |
| --- | --- | --- | --- |
| amenity_id | SERIAL | PK | Identifier |
| amenity_name | VARCHAR(100) | UNIQUE NOT NULL | Amenity name |
| description | TEXT | NULL | Description |
| created_at | TIMESTAMP | DEFAULT now() | Created |
| is_deleted | BOOLEAN | DEFAULT FALSE | Soft delete |

```sql
CREATE TABLE room_amenities (
    amenity_id SERIAL PRIMARY KEY,
    amenity_name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT now(),
    is_deleted BOOLEAN DEFAULT FALSE

```

---

### **`room_amenity_map`**

**Purpose:**

Mapping table between `rooms` and `room_amenities` (many-to-many).

| Column | Type | Constraints | Description |
| --- | --- | --- | --- |
| room_id | INT | NOT NULL REFERENCES rooms(room_id) ON DELETE CASCADE | Room link |
| amenity_id | INT | NOT NULL REFERENCES room_amenities(amenity_id) ON DELETE CASCADE | Amenity link |

```sql
CREATE TABLE room_amenity_map (
    room_id INT NOT NULL REFERENCES rooms(room_id) ON DELETE CASCADE,
    amenity_id INT NOT NULL REFERENCES room_amenities(amenity_id) ON DELETE CASCADE,
    PRIMARY KEY (room_id, amenity_id)
);

```

---

# **4.4 BOOKING MANAGEMENT**


### **`bookings`**

**Purpose:**

Stores the main booking information and links to single instances of pre and post check-in edits.

If an offer is applied, the associated booking becomes **room-edit locked** (dates only can be changed).

| **Column** | **Type** | **Constraints** | **Description** |
| --- | --- | --- | --- |
| **booking_id** | SERIAL | **PRIMARY KEY** | Unique identifier for each booking. |
| **customer_id** | INT | **NOT NULL REFERENCES `customers(customer_id)` ON DELETE RESTRICT** | Customer who initiated the booking. |
| **room_count** | SMALLINT | **DEFAULT 1 CHECK (room_count >= 1)** | Total number of rooms booked. |
| **check_in** | DATE | **NOT NULL** | Scheduled check-in date. |
| **check_out** | DATE | **NOT NULL** | Scheduled check-out date. |
| **total_price** | NUMERIC(12,2) | **NOT NULL CHECK (total_price >= 0)** | Aggregated total before applying discounts. |
| **offer_id** | INT | **NULL REFERENCES `offers(offer_id)` ON DELETE SET NULL** | Linked promotional offer (if applicable). |
| **offer_discount_percent** | NUMERIC(5,2) | **DEFAULT 0 CHECK (offer_discount_percent >= 0)** | Discount percentage applied through offer. |
| **status** | booking_status | **DEFAULT 'PENDING'** | Current lifecycle state of the booking. |
| **is_deleted** | BOOLEAN | **DEFAULT FALSE** | Logical deletion flag for soft-delete behavior. |
| **created_at** | TIMESTAMP | **DEFAULT now()** | Record creation timestamp. |
| **updated_at** | TIMESTAMP | **DEFAULT now()** | Last updated timestamp. |

---

```sql
-------------------------------------------------------
-- TABLE: bookings
-- PURPOSE: Stores core booking records and offer linkage.
-------------------------------------------------------

CREATE TABLE bookings (
    booking_id SERIAL PRIMARY KEY,
    customer_id INT NOT NULL
        REFERENCES customers(customer_id)
        ON DELETE RESTRICT,
    room_count SMALLINT DEFAULT 1
        CHECK (room_count >= 1),
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    total_price NUMERIC(12,2) NOT NULL
        CHECK (total_price >= 0),
    offer_id INT
        REFERENCES offers(offer_id)
        ON DELETE SET NULL,
    offer_discount_percent NUMERIC(5,2) DEFAULT 0
        CHECK (offer_discount_percent >= 0),
    status booking_status DEFAULT 'PENDING',
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now(),
    CONSTRAINT chk_booking_dates CHECK (check_out >= check_in)
);

```

---

## **`booking_room_map`**

**Purpose:**

Defines room allocations for each booking.

If a booking has an active offer (`offer_id IS NOT NULL`), room updates or removals are blocked.

| **Column** | **Type** | **Constraints** | **Description** |
| --- | --- | --- | --- |
| **booking_id** | INT | NOT NULL REFERENCES `bookings(booking_id)` ON DELETE CASCADE | Booking reference |
| **room_id** | INT | NOT NULL REFERENCES `rooms(room_id)` ON DELETE CASCADE | Assigned room |
| **room_type_id** | INT | NOT NULL REFERENCES `room_types(room_type_id)` ON DELETE RESTRICT | Room type reference |
| **adults** | SMALLINT | NOT NULL CHECK (adults >= 1) | Adults in this room |
| **children** | SMALLINT | DEFAULT 0 CHECK (children >= 0) | Children in this room |
| **offer_discount_percent** | NUMERIC(5,2) | DEFAULT 0 CHECK (offer_discount_percent >= 0) | Discount per room |
| **is_removed** | BOOLEAN | DEFAULT FALSE | Indicates room removal (if applicable) |
| **removed_at** | TIMESTAMP | NULL | Timestamp of removal |
| **modified_in_edit_id** | INT | NULL | Edit reference (pre or post) |

```sql
CREATE TABLE booking_room_map (
    booking_id INT NOT NULL REFERENCES bookings(booking_id) ON DELETE CASCADE,
    room_id INT NOT NULL REFERENCES rooms(room_id) ON DELETE CASCADE,
    room_type_id INT NOT NULL REFERENCES room_types(room_type_id) ON DELETE RESTRICT,
    adults SMALLINT NOT NULL CHECK (adults >= 1),
    children SMALLINT DEFAULT 0 CHECK (children >= 0),
    offer_discount_percent NUMERIC(5,2) DEFAULT 0 CHECK (offer_discount_percent >= 0),
    is_removed BOOLEAN DEFAULT FALSE,
    removed_at TIMESTAMP,
    modified_in_edit_id INT,
    PRIMARY KEY (booking_id, room_id)
);

```

---

## **`booking_edit`**

**Purpose:**

Captures **both pre and post check-in edits** in one table.

The `edit_type` column differentiates between **‘PRE’** and **‘POST’** edits.

| **Column** | **Type** | **Constraints** | **Description** |
| --- | --- | --- | --- |
| **edit_id** | SERIAL | PRIMARY KEY | Unique edit identifier |
| **booking_id** | INT | NOT NULL REFERENCES `bookings(booking_id)` ON DELETE CASCADE | Associated booking |
| **edit_type** | booking_edit_type | DEFAULT 'PRE' | Type of edit — `'PRE'` or `'POST'` |
| **old_check_in** | DATE | NULL | Previous check-in date |
| **new_check_in** | DATE | NULL | Updated check-in date |
| **old_check_out** | DATE | NULL | Previous check-out date |
| **new_check_out** | DATE | NULL | Updated check-out date |
| **old_total_price** | NUMERIC(12,2) | NULL | Previous total |
| **new_total_price** | NUMERIC(12,2) | NULL | Updated total |
| **offer_id** | INT | NULL REFERENCES `offers(offer_id)` ON DELETE SET NULL | Offer applied (if any) |
| **old_room_count** | SMALLINT | CHECK (old_room_count >= 0) | Rooms before edit |
| **new_room_count** | SMALLINT | CHECK (new_room_count >= 0) | Rooms after edit |
| **edited_by_customer** | INT | NULL REFERENCES `customers(customer_id)` | Customer who edited (if applicable) |
| **edited_by_admin** | INT | NULL REFERENCES `admins(admin_id)` | Admin who edited (if applicable) |
| **edit_reason** | TEXT | NULL | Reason for modification |
| **edited_at** | TIMESTAMP | DEFAULT now() | Timestamp of edit |
| **remarks** | TEXT | NULL | Notes for audit and tracking |

---

### **Enum Type Definition**

```sql
CREATE TYPE booking_edit_type AS ENUM ('PRE', 'POST');

```

---

### **Table Creation Query**

```sql
CREATE TABLE booking_edit (
    edit_id SERIAL PRIMARY KEY,
    booking_id INT NOT NULL REFERENCES bookings(booking_id) ON DELETE CASCADE,
    edit_type booking_edit_type DEFAULT 'PRE',
    old_check_in DATE,
    new_check_in DATE,
    old_check_out DATE,
    new_check_out DATE,
    old_total_price NUMERIC(12,2),
    new_total_price NUMERIC(12,2),
    offer_id INT REFERENCES offers(offer_id) ON DELETE SET NULL,
    old_room_count SMALLINT CHECK (old_room_count >= 0),
    new_room_count SMALLINT CHECK (new_room_count >= 0),
    edited_by_customer INT REFERENCES customers(customer_id),
    edited_by_admin INT REFERENCES admins(admin_id),
    edit_reason TEXT,
    edited_at TIMESTAMP DEFAULT now(),
    remarks TEXT,
    CONSTRAINT uq_booking_edit_per_type UNIQUE (booking_id, edit_type)
);

```

---

## **`booking_edit_rooms_map`**

**Purpose:**

Tracks rooms modified or removed in a specific edit.

This replaces both pre and post edit room maps, unified under `edit_type` context.

| **Column** | **Type** | **Constraints** | **Description** |
| --- | --- | --- | --- |
| **edit_id** | INT | NOT NULL REFERENCES `booking_edit(edit_id)` ON DELETE CASCADE | Parent edit record |
| **booking_id** | INT | NOT NULL REFERENCES `bookings(booking_id)` ON DELETE CASCADE | Associated booking |
| **room_id** | INT | NOT NULL REFERENCES `rooms(room_id)` ON DELETE CASCADE | Room affected |
| **room_type_id** | INT | NOT NULL REFERENCES `room_types(room_type_id)` ON DELETE RESTRICT | Room type |
| **action_type** | TEXT | CHECK (action_type IN ('MODIFIED', 'REMOVED')) | Action performed |
| **adults** | SMALLINT | CHECK (adults >= 0) | Updated adult count |
| **children** | SMALLINT | CHECK (children >= 0) | Updated child count |
| **discount_percent** | NUMERIC(5,2) | DEFAULT 0 CHECK (discount_percent >= 0) | Discount applied |
| **edited_at** | TIMESTAMP | DEFAULT now() | Timestamp of room modification |

---

### **Table Creation Query**

```sql
CREATE TABLE booking_edit_rooms_map (
    edit_id INT NOT NULL REFERENCES booking_edit(edit_id) ON DELETE CASCADE,
    booking_id INT NOT NULL REFERENCES bookings(booking_id) ON DELETE CASCADE,
    room_id INT NOT NULL REFERENCES rooms(room_id) ON DELETE CASCADE,
	room_type_id INT NOT NULL REFERENCES room_types(room_type_id) ON DELETE RESTRICT
    action_type TEXT CHECK (action_type IN ('MODIFIED', 'REMOVED')),
    adults SMALLINT CHECK (adults >= 0),
    children SMALLINT CHECK (children >= 0),
    discount_percent NUMERIC(5,2) DEFAULT 0 CHECK (discount_percent >= 0),
    edited_at TIMESTAMP DEFAULT now(),
    PRIMARY KEY (edit_id, room_id)
)
```

---

# **4.5 FINANCIALS**


### **`payments`**

**Purpose:**

Logs payment transactions linked to bookings. Tracks method, amount, and transaction lifecycle.

| Column | Type | Constraints | Description |
| --- | --- | --- | --- |
| payment_id | SERIAL | PK | Unique payment identifier |
| booking_id | INT | NOT NULL REFERENCES bookings(booking_id) ON DELETE RESTRICT | Booking link |
| amount | NUMERIC(12,2) | NOT NULL CHECK (amount >= 0) | Transaction amount |
| payment_date | TIMESTAMP | DEFAULT now() | Payment timestamp |
| method | payment_method | NOT NULL | Payment method used |
| status | payment_status | DEFAULT 'PENDING' | Payment state |
| transaction_reference | VARCHAR(100) | UNIQUE | External transaction ID |
| remarks | TEXT | NULL | Optional description |
| is_deleted | BOOLEAN | DEFAULT FALSE | Soft delete flag |

---

### **`refunds`**

**Purpose:**

Tracks refund requests and completion for bookings, whether partial or full.

| Column | Type | Constraints | Description |
| --- | --- | --- | --- |
| refund_id | SERIAL | PK | Refund record ID |
| booking_id | INT | NOT NULL REFERENCES bookings(booking_id) ON DELETE RESTRICT | Linked booking |
| customer_id | INT | NOT NULL REFERENCES customers(customer_id) ON DELETE RESTRICT | Linked customer |
| type | refund_type | NOT NULL | Refund category |
| status | refund_status | DEFAULT 'INITIATED' | Current refund status |
| refund_amount | NUMERIC(12,2) | NOT NULL CHECK (refund_amount >= 0) | Amount refunded |
| initiated_at | TIMESTAMP | DEFAULT now() | When refund initiated |
| processed_at | TIMESTAMP | NULL | Processing timestamp |
| completed_at | TIMESTAMP | NULL | Completion timestamp |
| remarks | TEXT | NULL | Notes |
| is_deleted | BOOLEAN | DEFAULT FALSE | Soft delete flag |

```sql
CREATE TABLE refunds (
    refund_id SERIAL PRIMARY KEY,
    booking_id INT NOT NULL REFERENCES bookings(booking_id) ON DELETE RESTRICT,
    customer_id INT NOT NULL REFERENCES customers(customer_id) ON DELETE RESTRICT,
    type refund_type NOT NULL,
    status refund_status DEFAULT 'INITIATED',
    refund_amount NUMERIC(12,2) NOT NULL CHECK (refund_amount >= 0),
    initiated_at TIMESTAMP DEFAULT now(),
    processed_at TIMESTAMP,
    completed_at TIMESTAMP,
    remarks TEXT,
    is_deleted BOOLEAN DEFAULT FALSE
);
```

---

### **`refund_room_map`**

**Purpose:**

Handles mapping of partial refunds per room for multi-room bookings.

| Column | Type | Constraints | Description |
| --- | --- | --- | --- |
| refund_id | INT | NOT NULL REFERENCES refunds(refund_id) ON DELETE CASCADE | Linked refund |
| room_id | INT | NOT NULL REFERENCES rooms(room_id) ON DELETE CASCADE | Refunded room |
| amount | NUMERIC(12,2) | NOT NULL CHECK (amount >= 0) | Refund amount |

```sql
CREATE TABLE refund_room_map (
    refund_id INT NOT NULL REFERENCES refunds(refund_id) ON DELETE CASCADE,
    room_id INT NOT NULL REFERENCES rooms(room_id) ON DELETE CASCADE,
    amount NUMERIC(12,2) NOT NULL CHECK (amount >= 0),
    PRIMARY KEY (refund_id, room_id)
);

```

---

# **4.6 ISSUES MANAGEMENT**


### **`issues`**

**Purpose:**

Tracks issues or complaints raised by customers related to bookings or rooms.

| **Column** | **Type** | **Constraints** | **Description** |
| --- | --- | --- | --- |
| **issue_id** | SERIAL | PRIMARY KEY | Unique issue identifier |
| **booking_id** | INT | NOT NULL REFERENCES `bookings(booking_id)` ON DELETE RESTRICT | Associated booking ID |
| **room_id** | INT | NULL REFERENCES `rooms(room_id)` | Optional linked room for room-specific issues |
| **customer_id** | INT | NOT NULL REFERENCES `customers(customer_id)` | Customer who raised the issue |
| **title** | VARCHAR(200) | NOT NULL | Issue title or summary |
| **description** | TEXT | NOT NULL | Detailed description of the issue |
| **images** | JSONB | DEFAULT '[]' | Array of attached image URLs related to the issue |
| **status** | issue_status | DEFAULT 'PENDING' | Current issue status |
| **reported_at** | TIMESTAMP | DEFAULT now() | Timestamp when the issue was reported |
| **resolved_at** | TIMESTAMP | NULL | Timestamp when the issue was resolved |
| **last_updated** | TIMESTAMP | DEFAULT now() | Timestamp of the last update |
| **is_deleted** | BOOLEAN | DEFAULT FALSE | Soft delete flag for logical removal |
| resolved_by | INT | NULL REFERENCES admins(admin_id) ON DELETE SET NULL |  |

---

```sql
CREATE TABLE issues (
    issue_id SERIAL PRIMARY KEY,
    booking_id INT NOT NULL REFERENCES bookings(booking_id) ON DELETE RESTRICT,
    room_id INT REFERENCES rooms(room_id),
    customer_id INT NOT NULL REFERENCES customers(customer_id),
    resolved_by INT NULL REFERENCES admins(admin_id),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    images JSONB DEFAULT '[]',
    status issue_status DEFAULT 'PENDING',
    reported_at TIMESTAMP DEFAULT now(),
    resolved_at TIMESTAMP,
    last_updated TIMESTAMP DEFAULT now(),
    is_deleted BOOLEAN DEFAULT FALSE
);

```

---

### **`issue_chat`**

**Purpose:**

Maintains chat threads for each issue between admins and customers.

| Column | Type | Constraints | Description |
| --- | --- | --- | --- |
| chat_id | SERIAL | PK | Chat ID |
| issue_id | INT | NOT NULL REFERENCES issues(issue_id) ON DELETE CASCADE | Linked issue |
| sender_id | INT | NOT NULL REFERENCES users(user_id) | Sender (admin/customer) |
| message | TEXT | NOT NULL | Message text |
| sent_at | TIMESTAMP | DEFAULT now() | Timestamp |
| is_deleted | BOOLEAN | DEFAULT FALSE | Soft delete |

```sql
CREATE TABLE issue_chat (
    chat_id SERIAL PRIMARY KEY,
    issue_id INT NOT NULL REFERENCES issues(issue_id) ON DELETE CASCADE,
    sender_id INT NOT NULL REFERENCES users(user_id),
    message TEXT NOT NULL,
    sent_at TIMESTAMP DEFAULT now(),
    is_deleted BOOLEAN DEFAULT FALSE
);

```

---

# **4.7 IMAGES MANAGEMENT**

**Purpose:**

Centralized reference table for all images linked to different entities in the system.

| Column | Type | Constraints | Description |
| --- | --- | --- | --- |
| image_id | SERIAL | PK | Unique identifier |
| entity_type | VARCHAR(50) | NOT NULL | Entity type (ROOM_TYPE, CUSTOMER, ADMIN, ISSUE, etc.) |
| entity_id | INT | NOT NULL | Entity ID |
| image_url | TEXT | NOT NULL | URL or path to image |
| caption | VARCHAR(255) | NULL | Image caption |
| is_primary | BOOLEAN | DEFAULT FALSE | Mark as featured |
| uploaded_by | INT | REFERENCES admins(admin_id) ON DELETE SET NULL | Uploader |
| created_at | TIMESTAMP | DEFAULT now() | Uploaded timestamp |
| is_deleted | BOOLEAN | DEFAULT FALSE | Soft delete flag |

```sql
CREATE TABLE images (
    image_id SERIAL PRIMARY KEY,
    entity_type VARCHAR(50) NOT NULL,
    entity_id INT NOT NULL,
    image_url TEXT NOT NULL,
    caption VARCHAR(255),
    is_primary BOOLEAN DEFAULT FALSE,
    uploaded_by INT REFERENCES admins(admin_id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT now(),
    is_deleted BOOLEAN DEFAULT FALSE
```

---

# **4.8 REVIEWS SYSTEM**


### **`reviews`**

**Purpose:**

Stores user reviews on room types or bookings. Both textual feedback and rating are tracked.

| Column | Type | Constraints | Description |
| --- | --- | --- | --- |
| review_id | SERIAL | PK | Unique review identifier |
| booking_id | INT | NOT NULL REFERENCES bookings(booking_id) ON DELETE RESTRICT | Linked booking |
| customer_id | INT | NOT NULL REFERENCES customers(customer_id) | Reviewer |
| room_type_id | INT | NOT NULL REFERENCES room_types(room_type_id) | Reviewed room type |
| rating | SMALLINT | NOT NULL CHECK (rating BETWEEN 1 AND 5) | 1–5 stars |
| comment | TEXT | NULL | Review text |
| created_at | TIMESTAMP | DEFAULT now() | Created |
| updated_at | TIMESTAMP | DEFAULT now() | Updated |
| is_deleted | BOOLEAN | DEFAULT FALSE | Soft delete |

```sql
CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,
    booking_id INT NOT NULL REFERENCES bookings(booking_id) ON DELETE RESTRICT,
    customer_id INT NOT NULL REFERENCES customers(customer_id),
    room_type_id INT NOT NULL REFERENCES room_types(room_type_id),
    rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now(),
    is_deleted BOOLEAN DEFAULT FALSE
);

```

---

### **`review_response`**

**Purpose:**

Stores a **single admin reply per review**. This ensures no multiple back-and-forth threads.

| Column | Type | Constraints | Description |
| --- | --- | --- | --- |
| response_id | SERIAL | PK | Identifier |
| review_id | INT | UNIQUE NOT NULL REFERENCES reviews(review_id) ON DELETE CASCADE | Linked review |
| admin_id | INT | NOT NULL REFERENCES admins(admin_id) | Responder admin |
| response_text | TEXT | NOT NULL | Admin reply |
| responded_at | TIMESTAMP | DEFAULT now() | Timestamp |

```sql
CREATE TABLE review_response (
    response_id SERIAL PRIMARY KEY,
    review_id INT UNIQUE NOT NULL REFERENCES reviews(review_id) ON DELETE CASCADE,
    admin_id INT NOT NULL REFERENCES admins(admin_id),
    response_text TEXT NOT NULL,
    responded_at TIMESTAMP DEFAULT now()
);

```

---

# **4.9 OFFERS MANAGEMENT**

### **`offers`**

**Purpose:**

Defines promotional campaigns or discounts applied to room types or bundled rooms.

| Column | Type | Constraints | Description |
| --- | --- | --- | --- |
| offer_id | SERIAL | PK | Offer ID |
| offer_name | VARCHAR(100) | UNIQUE NOT NULL | Offer title |
| description | TEXT | NULL | Offer details |
| offer_items | JSONB | NULL | Array of perks/features |
| discount_percent | NUMERIC(5,2) | CHECK (discount_percent >= 0) | % discount |
| start_date | DATE | NOT NULL | Offer start |
| expiry_date | DATE | NOT NULL | Offer expiry |
| created_by | INT | REFERENCES admins(admin_id) | Creator admin |
| created_at | TIMESTAMP | DEFAULT now() | Created timestamp |
| is_deleted | BOOLEAN | DEFAULT FALSE | Soft delete flag |

```sql
CREATE TABLE offers (
    offer_id SERIAL PRIMARY KEY,
    offer_name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    offer_items JSONB,
    discount_percent NUMERIC(5,2) CHECK (discount_percent >= 0),
    start_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    created_by INT REFERENCES admins(admin_id),
    created_at TIMESTAMP DEFAULT now(),
    is_deleted BOOLEAN DEFAULT FALSE
);

```

---

### **`offer_room_map`**

**Purpose:**

Links offers to specific room types (many-to-many relationship).

| Column | Type | Constraints | Description |
| --- | --- | --- | --- |
| offer_id | INT | NOT NULL REFERENCES offers(offer_id) ON DELETE CASCADE | Linked offer |
| room_type_id | INT | NOT NULL REFERENCES room_types(room_type_id) | Linked room type |
| actual_price | NUMERIC(12,2) | NOT NULL CHECK (actual_price >= 0) | Price before discount |
| discounted_price | NUMERIC(12,2) | NOT NULL CHECK (discounted_price >= 0) | New offer price |
| PRIMARY KEY (offer_id, room_type_id) |  |  |  |

```sql
CREATE TABLE offer_room_map (
    offer_id INT NOT NULL REFERENCES offers(offer_id) ON DELETE CASCADE,
    room_type_id INT NOT NULL REFERENCES room_types(room_type_id),
    actual_price NUMERIC(12,2) NOT NULL CHECK (actual_price >= 0),
    discounted_price NUMERIC(12,2) NOT NULL CHECK (discounted_price >= 0),
    PRIMARY KEY (offer_id, room_type_id)
)

```

---

# **4.10 NOTIFICATIONS SYSTEM**


### **`notifications`**

**Purpose:**

Handles real-time and scheduled notifications for both customers and admins (moved from MongoDB).

| **Column** | **Type** | **Constraints** | **Description** |
| --- | --- | --- | --- |
| **notification_id** | SERIAL | PRIMARY KEY | Unique notification record identifier |
| **recipient_user_id** | INT | NOT NULL REFERENCES `users(user_id)` ON DELETE CASCADE | Receiver of the notification |
| **entity_type** | VARCHAR(50) | NULL | Linked entity type (`BOOKING`, `PAYMENT`, `REFUND`, etc.) |
| **entity_id** | INT | NULL | Entity reference ID |
| **title** | VARCHAR(150) | NOT NULL | Notification title |
| **message** | TEXT | NOT NULL | Notification message content |
| **is_read** | BOOLEAN | DEFAULT FALSE | Indicates if the notification has been read |
| **created_at** | TIMESTAMP | DEFAULT now() | Creation timestamp |
| **read_at** | TIMESTAMP | NULL | Timestamp when the notification was read |
| **is_deleted** | BOOLEAN | DEFAULT FALSE | Soft delete flag for logical removal |

```sql
CREATE TABLE notifications (
    notification_id SERIAL PRIMARY KEY,
    recipient_user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    entity_type VARCHAR(50),
    entity_id INT,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT now(),
    read_at TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);

```

---

# **4.11 WISHLIST SYSTEM**


### **`wishlist`**

**Purpose:**

The `wishlist` table stores records of room types that customers have favorited or saved for future booking consideration. It optionally links to an offer active at the time of addition, enabling personalized re-engagement and marketing automation.

---

| Column | Type | Constraints | Description |
| --- | --- | --- | --- |
| **wishlist_id** | SERIAL | PRIMARY KEY | Unique wishlist record identifier |
| **customer_id** | INT | NOT NULL REFERENCES `customers(customer_id)` ON DELETE CASCADE | Associated customer who saved the room |
| **room_type_id** | INT | NOT NULL REFERENCES `room_types(room_type_id)` | Room type added to wishlist |
| **offer_id** | INT | NULL REFERENCES `offers(offer_id)` ON DELETE SET NULL | Linked offer available when the room was saved |
| **added_at** | TIMESTAMP | DEFAULT now() | Timestamp when the room was added to wishlist |
| **is_deleted** | BOOLEAN | DEFAULT FALSE | Soft delete flag for logical record removal |

---

```sql
CREATE TABLE wishlist (
    wishlist_id SERIAL PRIMARY KEY,
    customer_id INT NOT NULL REFERENCES customers(customer_id) ON DELETE CASCADE,
    room_type_id INT NOT NULL REFERENCES room_types(room_type_id),
    offer_id INT REFERENCES offers(offer_id) ON DELETE SET NULL,
    added_at TIMESTAMP DEFAULT now(),
    is_deleted BOOLEAN DEFAULT FALSE,
    UNIQUE (customer_id, room_type_id)
);

```

---

# **4.12 Indexes of tables**


```sql
-------------------------------------------------------
-- USER & ADMIN SUBSYSTEM
-------------------------------------------------------

-- Users
CREATE INDEX idx_users_type_status
ON users (type_id, status);

-- Customers
CREATE INDEX idx_customers_email
ON customers (email);

CREATE INDEX idx_customers_phone_number
ON customers (phone_number);

CREATE INDEX idx_customers_loyalty_points
ON customers (loyalty_points);

-- Admins
CREATE INDEX idx_admins_email
ON admins (email);

CREATE INDEX idx_admins_created_by
ON admins (created_by);

-- Sessions
CREATE INDEX idx_sessions_user_active
ON sessions (user_id, is_active);

CREATE INDEX idx_sessions_login_time
ON sessions (login_time DESC);

-------------------------------------------------------
-- ROOMS & AMENITIES
-------------------------------------------------------

-- Room Types
CREATE INDEX idx_room_types_name
ON room_types (type_name);

CREATE INDEX idx_room_types_price
ON room_types (price_per_night);

-- Rooms
CREATE INDEX idx_rooms_type_status
ON rooms (room_type_id, room_status);

CREATE INDEX idx_rooms_is_deleted
ON rooms (is_deleted)
WHERE is_deleted = FALSE;

-- Room Amenities
CREATE INDEX idx_room_amenities_name
ON room_amenities (amenity_name);

-- Room Amenity Map
CREATE INDEX idx_room_amenity_map_room_amenity
ON room_amenity_map (room_id, amenity_id);

-------------------------------------------------------
-- BOOKINGS & BOOKING EDIT HISTORY
-------------------------------------------------------

-- Bookings
CREATE INDEX idx_bookings_customer_status
ON bookings (customer_id, status);

CREATE INDEX idx_bookings_offer
ON bookings (offer_id);

CREATE INDEX idx_bookings_created_at
ON bookings (created_at DESC);

CREATE INDEX idx_bookings_is_deleted
ON bookings (is_deleted)
WHERE is_deleted = FALSE;

-- Booking Room Map
CREATE INDEX idx_booking_room_map_booking
ON booking_room_map (booking_id);

CREATE INDEX idx_booking_room_map_room
ON booking_room_map (room_id);

CREATE INDEX idx_booking_room_map_type
ON booking_room_map (room_type_id);

-- Booking Edit
CREATE INDEX idx_booking_edit_booking_type
ON booking_edit (booking_id, edit_type);

CREATE INDEX idx_booking_edit_offer
ON booking_edit (offer_id);

CREATE INDEX idx_booking_edit_edited_at
ON booking_edit (edited_at DESC);

-- Booking Edit Rooms Map
CREATE INDEX idx_booking_edit_rooms_map_edit
ON booking_edit_rooms_map (edit_id);

CREATE INDEX idx_booking_edit_rooms_map_booking
ON booking_edit_rooms_map (booking_id);

-------------------------------------------------------
-- PAYMENTS & REFUNDS
-------------------------------------------------------

-- Payments
CREATE INDEX idx_payments_booking_status
ON payments (booking_id, status);

CREATE INDEX idx_payments_method
ON payments (method);

CREATE INDEX idx_payments_date
ON payments (payment_date DESC);

CREATE INDEX idx_payments_is_deleted
ON payments (is_deleted)
WHERE is_deleted = FALSE;

-- Refunds
CREATE INDEX idx_refunds_booking_status
ON refunds (booking_id, status);

CREATE INDEX idx_refunds_customer
ON refunds (customer_id);

CREATE INDEX idx_refunds_initiated_at
ON refunds (initiated_at DESC);

CREATE INDEX idx_refunds_is_deleted
ON refunds (is_deleted)
WHERE is_deleted = FALSE;

-- Refund Room Map
CREATE INDEX idx_refund_room_map_refund_room
ON refund_room_map (refund_id, room_id);

-------------------------------------------------------
-- ISSUES & CHAT
-------------------------------------------------------

-- Issues
CREATE INDEX idx_issues_booking_status
ON issues (booking_id, status);

CREATE INDEX idx_issues_customer
ON issues (customer_id);

CREATE INDEX idx_issues_reported_at
ON issues (reported_at DESC);

CREATE INDEX idx_issues_is_deleted
ON issues (is_deleted)
WHERE is_deleted = FALSE;

-- Issue Chat
CREATE INDEX idx_issue_chat_issue
ON issue_chat (issue_id);

CREATE INDEX idx_issue_chat_sender
ON issue_chat (sender_id);

CREATE INDEX idx_issue_chat_sent_at
ON issue_chat (sent_at DESC);

-------------------------------------------------------
-- REVIEWS & RESPONSES
-------------------------------------------------------

-- Reviews
CREATE INDEX idx_reviews_booking
ON reviews (booking_id);

CREATE INDEX idx_reviews_customer
ON reviews (customer_id);

CREATE INDEX idx_reviews_room_type
ON reviews (room_type_id);

CREATE INDEX idx_reviews_created_at
ON reviews (created_at DESC);

CREATE INDEX idx_reviews_is_deleted
ON reviews (is_deleted)
WHERE is_deleted = FALSE;

-- Review Response
CREATE INDEX idx_review_response_admin
ON review_response (admin_id);

-------------------------------------------------------
-- OFFERS
-------------------------------------------------------

-- Offers
CREATE INDEX idx_offers_name
ON offers (offer_name);

CREATE INDEX idx_offers_date_range
ON offers (start_date, expiry_date);

CREATE INDEX idx_offers_created_by
ON offers (created_by);

CREATE INDEX idx_offers_is_deleted
ON offers (is_deleted)
WHERE is_deleted = FALSE;

-- Offer Room Map
CREATE INDEX idx_offer_room_map_offer_type
ON offer_room_map (offer_id, room_type_id);

-------------------------------------------------------
-- NOTIFICATIONS
-------------------------------------------------------

CREATE INDEX idx_notifications_user_read
ON notifications (recipient_user_id, is_read);

CREATE INDEX idx_notifications_created_at
ON notifications (created_at DESC);

CREATE INDEX idx_notifications_is_deleted
ON notifications (is_deleted)
WHERE is_deleted = FALSE;

-------------------------------------------------------
-- WISHLIST
-------------------------------------------------------

CREATE INDEX idx_wishlist_customer_room
ON wishlist (customer_id, room_type_id);

CREATE INDEX idx_wishlist_added_at
ON wishlist (added_at DESC);

-------------------------------------------------------
-- IMAGES
-------------------------------------------------------

CREATE INDEX idx_images_entity
ON images (entity_type, entity_id);

CREATE INDEX idx_images_uploaded_by
ON images (uploaded_by);

CREATE INDEX idx_images_is_deleted
ON images (is_deleted)
WHERE is_deleted = FALSE;

-------------------------------------------------------
-- AUDIT LOG (Compliance Layer)
-------------------------------------------------------

CREATE INDEX idx_audit_log_entity
ON audit_log (entity, entity_id);

CREATE INDEX idx_audit_log_user
ON audit_log (changed_by_user_id);

CREATE INDEX idx_audit_log_created_at
ON audit_log (created_at DESC);

```

---

## **5. MONGO COLLECTIONS**

## **5.1 LOG COLLECTIONS**

### **`audit_log`**

**Purpose:**

Even though MongoDB holds the majority of logs, this minimal **Postgres table** ensures **compliance and audit integrity** by maintaining pointers to Mongo log entries.

| Column | Type | Constraints | Description |
| --- | --- | --- | --- |
| audit_id | SERIAL | PK | Unique audit identifier |
| entity | VARCHAR(50) | NOT NULL | e.g., `booking`, `room` |
| entity_id | VARCHAR(100) | NOT NULL | Canonical record reference |
| action | VARCHAR(20) | NOT NULL | `INSERT`, `UPDATE`, `DELETE` |
| old_value | JSONB | NULL | Previous state |
| new_value | JSONB | NULL | Updated state |
| changed_by_user_id  | INT | REFERENCES users(user_id) ON DELETE SET NULL | User/admin ID who done the change |
| ip_address | VARCHAR(45) | NULL | Origin IP |
| created_at | TIMESTAMP | DEFAULT now() | Timestamp of change |
| user_id | INT | NOT NULL REFERENCES `users(user_id)` ON DELETE set NULL | Receiver of the notification |

**Indexes:**

`CREATE INDEX idx_audit_entity ON audit_log(entity, entity_id);`

---

### **`backup_logs`**

| **Field** | **Type** | **Description** |
| --- | --- | --- |
| **_id** | ObjectId / string | Unique log identifier |
| **snapshotId** | string | Reference to the snapshot being backed up |
| **step** | string | Stage of the process — `start`, `verify`, or `complete` |
| **message** | string | Descriptive log message about the backup event |
| **status** | string | `success`, `failed`, or `in_progress` |
| **timestamp** | datetime | Timestamp of the backup log entry |
| **details** | object | `{ checksumMatch: true, durationSec: 45 }` — optional diagnostic info |

**Indexes:**

```
{ snapshotId: 1 }
{ timestamp: -1 }
{ status: 1 }

```

---

### **`restore_logs`**

| **Field** | **Type** | **Description** |
| --- | --- | --- |
| **_id** | ObjectId / string | Unique log identifier |
| **snapshotId** | string | Reference to the snapshot being restored |
| **step** | string | Stage of the process — `start`, `verify`, or `complete` |
| **message** | string | Descriptive log message about the restore event |
| **status** | string | `success`, `failed`, or `in_progress` |
| **timestamp** | datetime | Timestamp of the restore log entry |
| **details** | object | `{ checksumVerified: true, restoreDurationSec: 38 }` — optional diagnostic info |

**Indexes:**

```
{ snapshotId: 1 }
{ timestamp: -1 }
{ status: 1 }

```

---

### **`api_logs`**

| Field | Type | Description |
| --- | --- | --- |
| _id | ObjectId / string | Log ID |
| requestId | string | Unique request ID |
| endpoint | string | API endpoint |
| method | string | HTTP method |
| userId | string | Requester |
| role | string | `customer` / `admin` |
| requestBody | object | Payload |
| responseCode | int | HTTP status |
| responseTimeMs | int | Latency |
| ip | string | Source IP |
| device | string | Device |
| userAgent | string | User agent |
| status | string | `success` / `error` |
| errorMessage | string | Failure message |
| timestamp | datetime | Request time |

**Indexes:**

`{ endpoint: 1, timestamp: -1 }`

`{ userId: 1 }`

---

## **5.2 CMS COLLECTIONS**

### **`content_docs`**

| Field | Type | Description |
| --- | --- | --- |
| _id | ObjectId / string | PK |
| type | string | `announcement`, `banner`, `offer`, `testimonial`, `promotion` |
| title | string | Title or headline |
| description | string | Body content |
| media | object | `{ url: string, type: "image" }` |
| status | string | `used`, `unused`, `draft`, `published` |
| metadata | object | Additional info (CTA, discount %) |
| order | int | Sorting priority |
| createdAt | datetime | Creation time |
| updatedAt | datetime | Last modified time |
| `images` | `[object]` | Optional list of images `{ url: string, caption: string }` |

**Indexes:**

`{ type: 1, status: 1 }`

`{ order: 1 }`

---

### **`facilities_docs`**

| Field | Type | Description |
| --- | --- | --- |
| _id | ObjectId / string | PK |
| name | string | Facility name |
| category | string | `wellness`, `fitness`, `dining`, `business` |
| description | string | Facility description |
| media | object | `{ url: string }` |
| features | [string] | List of features |
| timings | string | `8:00 AM – 9:00 PM` |
| availability | string | `morning`, `evening`, `24hours` |
| accessLevel | string | `all-guests`, `members`, `premium`, `booking-required` |
| tags | [string] | UI tags |
| status | string | `active`, `inactive` |
| order | int | Display order |
| `images` | `[object]` | Optional list of images `{ url: string, caption: string }` |

**Indexes:**

`{ category: 1, status: 1 }`

`{ order: 1 }`

---

### **`hotel_info_docs`**

| Field | Type | Description |
| --- | --- | --- |
| _id | ObjectId / string | PK |
| section | string | Section title (`Check-In / Check-Out`) |
| content | string | Text body |
| category | string | `general` |

**Indexes:**

`{ category: 1 }`

---

### **`policies_docs`**

| Field | Type | Description |
| --- | --- | --- |
| _id | ObjectId / string | PK |
| type | string | `cancellation`, `privacy`, `terms` |
| title | string | Policy title |
| content | string | Policy body |
| createdAt | datetime | Creation timestamp |

**Indexes:**

`{ type: 1 }`

---

### **`faqs_docs`**

| Field | Type | Description |
| --- | --- | --- |
| _id | ObjectId / string | PK |
| type | string | Always `"faq"` |
| extra | object | `{ question: "...", answer: "..." }` |

**Indexes:**

`{ order: 1 }`

`{ order: 1 }`

---

### **`backup_data_collections`**

**Purpose:**

Stores metadata for every backup job executed across PostgreSQL and MongoDB.

Captures which collections/tables were included, when the backup occurred, where it’s stored, and checksum validation for integrity verification.

| **Field** | **Type** | **Description** |
| --- | --- | --- |
| **_id** | ObjectId / string | Unique document identifier |
| **snapshotId** | string | Unique backup snapshot name (e.g., `snapshot_2025_10_08_001`) |
| **initiatedBy** | string | User/admin/system ID who triggered the backup |
| **databaseType** | string | `postgres` or `mongodb` |
| **collectionsIncluded** | [string] | List of MongoDB collections or PostgreSQL tables backed up |
| **storagePath** | string | Physical or cloud storage path (`/mnt/backups/` or `s3://hbs-backups/...`) |
| **sizeMB** | number | Backup file size in MB |
| **checksum** | string | SHA256 or MD5 checksum for validation |
| **status** | string | `in_progress`, `completed`, or `failed` |
| **timestamp** | datetime | Backup start time |
| **completedAt** | datetime | Backup completion time |
| **details** | object | `{ durationSec: 85, compression: "gzip", retentionDays: 30 }` |

**Indexes:**

```
{ snapshotId: 1 }
{ timestamp: -1 }
{ status: 1 }

```

---

### **`restored_data_collections`**

**Purpose:**

Tracks every restore operation, detailing which snapshot was used, where the data was restored, who initiated it, and validation results after restoration.

| **Field** | **Type** | **Description** |
| --- | --- | --- |
| **_id** | ObjectId / string | Unique document identifier |
| **snapshotId** | string | Source snapshot name used for restoration |
| **restoredBy** | string | User/admin/system ID who initiated the restore |
| **databaseType** | string | `postgres` or `mongodb` |
| **targetDatabase** | string | Target DB/environment where data was restored |
| **storagePath** | string | Physical location or cloud path of the restored backup (`s3://...` or `/mnt/backups/...`) |
| **collectionsRestored** | [string] | List of collections or tables restored |
| **status** | string | `initiated`, `completed`, or `failed` |
| **timestamp** | datetime | Restore start time |
| **completedAt** | datetime | Restore completion time |
| **details** | object | `{ checksumVerified: true, durationSec: 95, restoreMode: "full" }` |

**Indexes:**

```
{ snapshotId: 1 }
{ timestamp: -1 }
{ status: 1 }

```

---

## 6. RELATIONSHIPS

```sql
-------------------------------------------------------
-- USER & ADMIN SUBSYSTEM
-------------------------------------------------------

-- Customers → Users
ALTER TABLE customers
ADD CONSTRAINT fk_customers_users
FOREIGN KEY (user_id) REFERENCES users(user_id)
ON DELETE RESTRICT;

-- Customers Credentials → Customers
ALTER TABLE customers_credentials
ADD CONSTRAINT fk_customers_credentials_customers
FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
ON DELETE CASCADE;

-- Admins → Users
ALTER TABLE admins
ADD CONSTRAINT fk_admins_users
FOREIGN KEY (user_id) REFERENCES users(user_id)
ON DELETE RESTRICT;

-- Admins → Admins (created_by)
ALTER TABLE admins
ADD CONSTRAINT fk_admins_created_by
FOREIGN KEY (created_by) REFERENCES admins(admin_id)
ON DELETE SET NULL;

-- Admin Credentials → Admins
ALTER TABLE admin_credentials
ADD CONSTRAINT fk_admin_credentials_admins
FOREIGN KEY (admin_id) REFERENCES admins(admin_id)
ON DELETE CASCADE;

-- Admin Permission Map → Admins
ALTER TABLE admin_permission_map
ADD CONSTRAINT fk_admin_perm_map_admins
FOREIGN KEY (admin_id) REFERENCES admins(admin_id)
ON DELETE CASCADE;

-- Admin Permission Map → Permissions
ALTER TABLE admin_permission_map
ADD CONSTRAINT fk_admin_perm_map_permissions
FOREIGN KEY (permission_id) REFERENCES admin_permissions(permission_id)
ON DELETE CASCADE;

-- Sessions → Users
ALTER TABLE sessions
ADD CONSTRAINT fk_sessions_users
FOREIGN KEY (user_id) REFERENCES users(user_id)
ON DELETE CASCADE;

-------------------------------------------------------
-- ROOMS & AMENITIES
-------------------------------------------------------

-- Rooms → Room Types
ALTER TABLE rooms
ADD CONSTRAINT fk_rooms_room_types
FOREIGN KEY (room_type_id) REFERENCES room_types(room_type_id)
ON DELETE RESTRICT;

-- Room Amenity Map → Rooms
ALTER TABLE room_amenity_map
ADD CONSTRAINT fk_room_amenity_map_rooms
FOREIGN KEY (room_id) REFERENCES rooms(room_id)
ON DELETE CASCADE;

-- Room Amenity Map → Amenities
ALTER TABLE room_amenity_map
ADD CONSTRAINT fk_room_amenity_map_amenities
FOREIGN KEY (amenity_id) REFERENCES room_amenities(amenity_id)
ON DELETE CASCADE;

-------------------------------------------------------
-- BOOKINGS & BOOKING EDIT HISTORY
-------------------------------------------------------

-- Bookings → Customers
ALTER TABLE bookings
ADD CONSTRAINT fk_bookings_customers
FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
ON DELETE RESTRICT;

-- Booking Room Map → Bookings
ALTER TABLE booking_room_map
ADD CONSTRAINT fk_booking_room_map_bookings
FOREIGN KEY (booking_id) REFERENCES bookings(booking_id)
ON DELETE CASCADE;

-- Booking Room Map → Rooms
ALTER TABLE booking_room_map
ADD CONSTRAINT fk_booking_room_map_rooms
FOREIGN KEY (room_id) REFERENCES rooms(room_id)
ON DELETE CASCADE;

-- Booking Room Map → Room Types
ALTER TABLE booking_room_map
ADD CONSTRAINT fk_booking_room_map_room_types
FOREIGN KEY (room_type_id) REFERENCES room_types(room_type_id)
ON DELETE RESTRICT;

-- Booking Edit → Bookings
ALTER TABLE booking_edit
ADD CONSTRAINT fk_booking_edit_bookings
FOREIGN KEY (booking_id) REFERENCES bookings(booking_id)
ON DELETE CASCADE;

-- Booking Edit → Offers
ALTER TABLE booking_edit
ADD CONSTRAINT fk_booking_edit_offers
FOREIGN KEY (offer_id) REFERENCES offers(offer_id)
ON DELETE SET NULL;

-- Booking Edit → Customers (Edited By)
ALTER TABLE booking_edit
ADD CONSTRAINT fk_booking_edit_customers
FOREIGN KEY (edited_by_customer) REFERENCES customers(customer_id)
ON DELETE SET NULL;

-- Booking Edit → Admins (Edited By)
ALTER TABLE booking_edit
ADD CONSTRAINT fk_booking_edit_admins
FOREIGN KEY (edited_by_admin) REFERENCES admins(admin_id)
ON DELETE SET NULL;

-- Booking Edit Rooms Map → Booking Edit
ALTER TABLE booking_edit_rooms_map
ADD CONSTRAINT fk_booking_edit_rooms_map_edit
FOREIGN KEY (edit_id) REFERENCES booking_edit(edit_id)
ON DELETE CASCADE;

-- Booking Edit Rooms Map → Bookings
ALTER TABLE booking_edit_rooms_map
ADD CONSTRAINT fk_booking_edit_rooms_map_bookings
FOREIGN KEY (booking_id) REFERENCES bookings(booking_id)
ON DELETE CASCADE;

-- Booking Edit Rooms Map → Rooms
ALTER TABLE booking_edit_rooms_map
ADD CONSTRAINT fk_booking_edit_rooms_map_rooms
FOREIGN KEY (room_id) REFERENCES rooms(room_id)
ON DELETE CASCADE;

-- Booking Edit Rooms Map → Room Types
ALTER TABLE booking_edit_rooms_map
ADD CONSTRAINT fk_booking_edit_rooms_map_room_types
FOREIGN KEY (room_type_id) REFERENCES room_types(room_type_id)
ON DELETE RESTRICT;

-------------------------------------------------------
-- PAYMENTS & REFUNDS
-------------------------------------------------------

-- Payments → Bookings
ALTER TABLE payments
ADD CONSTRAINT fk_payments_bookings
FOREIGN KEY (booking_id) REFERENCES bookings(booking_id)
ON DELETE RESTRICT;

-- Refunds → Bookings
ALTER TABLE refunds
ADD CONSTRAINT fk_refunds_bookings
FOREIGN KEY (booking_id) REFERENCES bookings(booking_id)
ON DELETE RESTRICT;

-- Refunds → Customers
ALTER TABLE refunds
ADD CONSTRAINT fk_refunds_customers
FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
ON DELETE RESTRICT;

-- Refund Room Map → Refunds
ALTER TABLE refund_room_map
ADD CONSTRAINT fk_refund_room_map_refunds
FOREIGN KEY (refund_id) REFERENCES refunds(refund_id)
ON DELETE CASCADE;

-- Refund Room Map → Rooms
ALTER TABLE refund_room_map
ADD CONSTRAINT fk_refund_room_map_rooms
FOREIGN KEY (room_id) REFERENCES rooms(room_id)
ON DELETE CASCADE;

-------------------------------------------------------
-- ISSUES & CHAT
-------------------------------------------------------

-- Issues → Bookings
ALTER TABLE issues
ADD CONSTRAINT fk_issues_bookings
FOREIGN KEY (booking_id) REFERENCES bookings(booking_id)
ON DELETE RESTRICT;

-- Issues → Rooms
ALTER TABLE issues
ADD CONSTRAINT fk_issues_rooms
FOREIGN KEY (room_id) REFERENCES rooms(room_id)
ON DELETE SET NULL;

-- Issues → Customers
ALTER TABLE issues
ADD CONSTRAINT fk_issues_customers
FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
ON DELETE RESTRICT;

-- Issues → Admins (Resolved By)
ALTER TABLE issues
ADD CONSTRAINT fk_issues_resolved_by
FOREIGN KEY (resolved_by) REFERENCES admins(admin_id)
ON DELETE SET NULL;

-- Issue Chat → Issues
ALTER TABLE issue_chat
ADD CONSTRAINT fk_issue_chat_issues
FOREIGN KEY (issue_id) REFERENCES issues(issue_id)
ON DELETE CASCADE;

-- Issue Chat → Users
ALTER TABLE issue_chat
ADD CONSTRAINT fk_issue_chat_users
FOREIGN KEY (sender_id) REFERENCES users(user_id)
ON DELETE RESTRICT;

-------------------------------------------------------
-- REVIEWS & RESPONSES
-------------------------------------------------------

-- Reviews → Bookings
ALTER TABLE reviews
ADD CONSTRAINT fk_reviews_bookings
FOREIGN KEY (booking_id) REFERENCES bookings(booking_id)
ON DELETE RESTRICT;

-- Reviews → Customers
ALTER TABLE reviews
ADD CONSTRAINT fk_reviews_customers
FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
ON DELETE RESTRICT;

-- Reviews → Room Types
ALTER TABLE reviews
ADD CONSTRAINT fk_reviews_room_types
FOREIGN KEY (room_type_id) REFERENCES room_types(room_type_id)
ON DELETE RESTRICT;

-- Review Response → Reviews
ALTER TABLE review_response
ADD CONSTRAINT fk_review_response_reviews
FOREIGN KEY (review_id) REFERENCES reviews(review_id)
ON DELETE CASCADE;

-- Review Response → Admins
ALTER TABLE review_response
ADD CONSTRAINT fk_review_response_admins
FOREIGN KEY (admin_id) REFERENCES admins(admin_id)
ON DELETE RESTRICT;

-------------------------------------------------------
-- OFFERS
-------------------------------------------------------

-- Offer Room Map → Offers
ALTER TABLE offer_room_map
ADD CONSTRAINT fk_offer_room_map_offers
FOREIGN KEY (offer_id) REFERENCES offers(offer_id)
ON DELETE CASCADE;

-- Offer Room Map → Room Types
ALTER TABLE offer_room_map
ADD CONSTRAINT fk_offer_room_map_room_types
FOREIGN KEY (room_type_id) REFERENCES room_types(room_type_id)
ON DELETE RESTRICT;

-------------------------------------------------------
-- NOTIFICATIONS
-------------------------------------------------------

-- Notifications → Users (Recipient)
ALTER TABLE notifications
ADD CONSTRAINT fk_notifications_recipient_users
FOREIGN KEY (recipient_user_id) REFERENCES users(user_id)
ON DELETE RESTRICT;

-------------------------------------------------------
-- WISHLIST
-------------------------------------------------------

-- Wishlist → Customers
ALTER TABLE wishlist
ADD CONSTRAINT fk_wishlist_customers
FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
ON DELETE CASCADE;

-- Wishlist → Room Types
ALTER TABLE wishlist
ADD CONSTRAINT fk_wishlist_room_types
FOREIGN KEY (room_type_id) REFERENCES room_types(room_type_id)
ON DELETE RESTRICT;

-------------------------------------------------------
-- IMAGES
-------------------------------------------------------

-- Images → Admins (Uploader)
ALTER TABLE images
ADD CONSTRAINT fk_images_admins
FOREIGN KEY (uploaded_by) REFERENCES admins(admin_id)
ON DELETE SET NULL;

```

---

## 7. VIEWS

### Customer Booking Summary View

Aggregates customer bookings with associated room information in JSON format.

```sql
CREATE OR REPLACE VIEW vw_customer_bookings AS
SELECT
    b.booking_id,
    b.customer_id,
    c.email,
    json_agg(json_build_object('room_id', r.room_id)) AS rooms
FROM bookings b
JOIN customer c ON b.customer_id = c.customer_id
LEFT JOIN booking_room_map brm ON b.booking_id = brm.booking_id
LEFT JOIN room r ON brm.room_id = r.room_id
GROUP BY b.booking_id, c.email;

```

**Usage Example:**

```sql
SELECT * FROM vw_customer_bookings WHERE customer_id = 101;

```

---

## 8. STORED PROCEDURES

### sp_create_bookings()

Creates a new booking, maps rooms, and calculates the total amount.

```sql
CREATE OR REPLACE FUNCTION sp_create_bookings(...)
RETURNS INT AS $$
BEGIN
    INSERT INTO bookings (...);
    FOREACH v_room_id IN ARRAY p_room_ids LOOP
        INSERT INTO booking_room_map (...);
    END LOOP;
END;
$$ LANGUAGE plpgsql;

```

**Usage Example:**

```sql
SELECT sp_create_bookings(12, ARRAY[101,102], '2025-10-10', '2025-10-14');

```

---

---

## 9. TRIGGERS

### Booking Validation Trigger

Ensures valid check-in and check-out dates before inserting a booking record.

```sql
CREATE OR REPLACE FUNCTION trg_booking_before_insert_validate()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.check_out <= NEW.check_in THEN
        RAISE EXCEPTION 'Invalid booking dates';
    END IF;
END;
$$ LANGUAGE plpgsql;

```

**Usage Example:**

```sql
INSERT INTO bookings (customer_id, check_in, check_out)
VALUES (101, '2025-10-12', '2025-10-10'); -- Raises exception

```

---

---

# **10. SECURITY CONSIDERATIONS**

---

### **10.1 User Roles and Privileges**

| Role | Access Level | Capabilities |
| --- | --- | --- |
| **Admin** | Full CRUD access across all relational entities | Manage users, rooms, bookings, payments, refunds, issues, reviews, offers, and notifications. Can also manage CMS content in MongoDB. |
| **Customer** | Restricted to self-owned data | Can manage personal bookings, issue tickets, reviews, wishlists, and receive notifications. |
| **System (Internal Service)** | Privileged non-human actor | Executes stored procedures, audit triggers, and synchronizes MongoDB logs and content updates. |

**Role Enforcement:**

- Controlled via `users_utility` and mapped through `admin_permission_map`.
- Privilege boundaries enforced by application middleware and API-level RBAC (Role-Based Access Control).
- Admin actions logged in **Postgres audit_log** and **MongoDB api_logs** for traceability.

---

### **10.2 Data Protection and Compliance**

- **Credential Security:**
    - Passwords (admins and customers) are **hashed using bcrypt (≥12 salt rounds)**.
    - `customers_credentials` and `admin_credentials` are isolated from main entity tables.
- **Network Security:**
    - All PostgreSQL and MongoDB connections must be **secured via SSL/TLS (minimum TLS 1.3)**.
    - Connections occur over a **VPC/private subnet** with IP whitelisting for authorized service nodes only.
- **Encryption & Sensitive Data:**
    - PostgreSQL column-level encryption for confidential fields (`hashed_password`, `transaction_reference`).
    - MongoDB **field-level encryption** for PII inside `api_logs` and `security_logs`.
    - No plaintext PII is logged or cached at any point.
- **Audit & Forensics:**
    - `audit_log` (Postgres) maintains immutable record snapshots for each change event.
    - MongoDB append-only collections (`api_logs`, `security_logs`, `backup_restore_logs`) prevent tampering.
    - Admin access audits retained for 90 days for compliance review.

---

### **10.3 Backup, Retention & Disaster Recovery**

| Database | Backup Strategy | Frequency | Retention | Notes |
| --- | --- | --- | --- | --- |
| **PostgreSQL** | Full backup + WAL archiving | Full: Daily, WAL: Every 15 mins | 30 days | Encrypted via AES-256; off-site replication enabled |
| **MongoDB** | Cluster snapshot with Oplog recovery | Daily | 30 days | Point-in-time restore supported |
| **Audit/Logs** | Exported weekly to cold storage (S3 or equivalent) | Weekly | 90 days | Immutable and compressed (GZIP) |
- Backups verified automatically using checksum validation (`backup_restore_logs` collection).
- On failure, recovery jobs are logged and replayed automatically by the **Disaster Recovery Daemon (DRD)**.

---

# **11. PERFORMANCE OPTIMIZATION**


### **11.1 Query & Indexing**

- **Prepared Statements:** All API-level queries use prepared statements or ORM parameter binding (prevents SQL injection).
- **Indexed Columns:**
    - Bookings → `(customer_id, status)`
    - Rooms → `(room_type_id, room_status)`
    - Payments → `(booking_id, payment_status)`
    - Refunds → `(booking_id, refund_status)`
    - Issues → `(booking_id, issue_status)`
- **Descending Indexes:** Used on `created_at`, `updated_at`, `payment_date`, `reported_at` for fast “most recent” retrieval.
- **Partial Indexes:** `WHERE is_deleted = FALSE` applied to frequently queried entities.

---

### **11.2 Scalability**

- **Partitioning:**
    - `bookings`, `payments`, and `audit_log` partitioned by **year** for performance scaling.
- **Connection Pooling:**
    - Managed at API layer (e.g., via `pgBouncer` or built-in ORM pooler).
    - Reduces overhead during high concurrency events.
- **Caching Layer:**
    - Read-heavy endpoints (like room listings) use Redis for caching computed results.
- **Async Job Queues:**
    - Refunds, issue resolution notifications, and content sync with MongoDB handled asynchronously.

---

### **11.3 Data Aggregation & Analytics**

- **Average Room Rating:**
    - Calculated periodically by joining `reviews` (Postgres) and synced to `room_types` for faster read access.
- **Materialized Views:**
    - Optional caching for views like `vw_refund_report` and `vw_issue_tracker` in analytics mode.
- **Vacuum & Analyze:**
    - Scheduled weekly for major tables to optimize query planner statistics.

---

# **12. DATA MIGRATION**


### **12.1 Initial Data Load Sequence**

To maintain referential integrity, entities must be loaded in this order:

| Step | Table / Collection | Description |
| --- | --- | --- |
| 1 | `users` | Core identity records |
| 2 | `customers`, `admins` | Linked via `user_id` |
| 3 | `users_utility`, `admin_permissions`, `admin_permission_map` | Role and access setup |
| 4 | `room_types` | Defines room categories |
| 5 | `rooms` | Room inventory mapped to types |
| 6 | `room_amenities`, `room_amenity_map` | Amenities and mappings |
| 7 | `offers`, `offer_room_map` | Promotional setup |
| 8 | `bookings`, `booking_room_map` | Booking and allocation data |
| 9 | `payments` | Financial transactions |
| 10 | `refunds`, `refund_room_map` | Refund workflows |
| 11 | `issues`, `issue_chat` | Complaint records and communication threads |
| 12 | `reviews`, `review_response` | Feedback data |
| 13 | `images`, `notifications`, `wishlist` | Media and engagement |
| 14 | `booking_edit_history`, `audit_log` | Audit and modification logs |
| 15 | **MongoDB Collections:** `api_logs`, `security_logs`, `content_docs`, `backup_restore_logs` | Unstructured extensions |

---

### **12.2 Data Consistency Rules**

- Each imported record must reference a valid parent FK before proceeding to child entities.
- Soft-deleted (`is_deleted = TRUE`) records are ignored during migration.
- All ENUM values must pre-exist before import (e.g., booking_status, refund_status).
- MongoDB collections receive references (`bookingId`, `roomTypeId`, `userId`) post-SQL load for cross-layer correlation.

---

# **13. APPENDIX**

### **13.1 Sample Data: Room Types**

```sql
INSERT INTO room_types (type_name, max_adult_count, max_child_count, price_per_night, description)
VALUES
('Standard', 2, 0, 80.00, 'Basic room with essential facilities'),
('Deluxe', 3, 1, 120.00, 'Spacious room with premium amenities'),
('Suite', 4, 2, 250.00, 'Luxury suite with living area and exclusive services');

```

---

### **13.2 Sample Data: Room Amenities**

```sql
INSERT INTO room_amenities (amenity_name, description)
VALUES
('WiFi', 'High-speed wireless internet'),
('AC', 'Automatic air conditioning'),
('TV', 'LED smart television'),
('Breakfast', 'Complimentary breakfast buffet');

```

---

### **13.3 Sample Admin Permissions**

```sql
INSERT INTO admin_permissions (permission_key, description)
VALUES
('MANAGE_BOOKINGS', 'Can create, edit, and cancel bookings'),
('MANAGE_ROOMS', 'Can add or update room details'),
('VIEW_REPORTS', 'Can view system analytics and performance metrics');

```

---

### **13.4 Sample MongoDB Collections**

**`content_docs`**

```json
{
  "type": "banner",
  "title": "Winter Fest Discounts!",
  "description": "Get up to 25% off on Deluxe rooms this season.",
  "status": "published",
  "metadata": { "discount_percent": 25 },
  "createdAt": "2025-10-01T00:00:00Z"
}

```

**`api_logs`**

```json
{
  "endpoint": "/api/bookings/create",
  "method": "POST",
  "userId": 102,
  "role": "customer",
  "responseCode": 200,
  "status": "success",
  "timestamp": "2025-10-08T10:45:00Z"
}

```

| **Column** | **Type** | **Constraints** | **Description** |
| --- | --- | --- | --- |
| **booking_id** | SERIAL | **PRIMARY KEY** | Unique identifier for each booking. |
| **customer_id** | INT | **NOT NULL REFERENCES `customers(customer_id)` ON DELETE RESTRICT** | Customer who initiated the booking. |
| **room_count** | SMALLINT | **DEFAULT 1 CHECK (room_count >= 1)** | Total number of rooms booked. |
| **check_in** | DATE | **NOT NULL** | Scheduled check-in date. |
| **check_out** | DATE | **NOT NULL** | Scheduled check-out date. |
| **total_price** | NUMERIC(12,2) | **NOT NULL CHECK (total_price >= 0)** | Aggregated total before applying discounts. |
| **offer_id** | INT | **NULL REFERENCES `offers(offer_id)` ON DELETE SET NULL** | Linked promotional offer (if applicable). |
| **offer_discount_percent** | NUMERIC(5,2) | **DEFAULT 0 CHECK (offer_discount_percent >= 0)** | Discount percentage applied through offer. |
| **status** | booking_status | **DEFAULT 'PENDING'** | Current lifecycle state of the booking. |
| **is_deleted** | BOOLEAN | **DEFAULT FALSE** | Logical deletion flag for soft-delete behavior. |
| **created_at** | TIMESTAMP | **DEFAULT now()** | Record creation timestamp. |
| **updated_at** | TIMESTAMP | **DEFAULT now()** | Last updated timestamp. |

---

### **Table Creation Script**

```sql
-------------------------------------------------------
-- TABLE: bookings
-- PURPOSE: Stores core booking records and offer linkage.
-------------------------------------------------------

CREATE TABLE bookings (
    booking_id SERIAL PRIMARY KEY,
    customer_id INT NOT NULL
        REFERENCES customers(customer_id)
        ON DELETE RESTRICT,
    room_count SMALLINT DEFAULT 1
        CHECK (room_count >= 1),
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    total_price NUMERIC(12,2) NOT NULL
        CHECK (total_price >= 0),
    offer_id INT
        REFERENCES offers(offer_id)
        ON DELETE SET NULL,
    offer_discount_percent NUMERIC(5,2) DEFAULT 0
        CHECK (offer_discount_percent >= 0),
    status booking_status DEFAULT 'PENDING',
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now(),
    CONSTRAINT chk_booking_dates CHECK (check_out >= check_in)
);

```