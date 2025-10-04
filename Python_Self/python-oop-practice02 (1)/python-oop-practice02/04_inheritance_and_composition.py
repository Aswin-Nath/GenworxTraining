from utils.utils_04 import users, addresses  

class Address:
    def __init__(self, street, city, pincode):
        self.street = street
        self.city = city
        self.pincode = pincode

    def display(self):
        return f"{self.street}, {self.city} - {self.pincode}"

class User:
    def __init__(self, name, email, password):
        self.name = name
        self.email = email
        self.password = password

    def display_user_info(self):
        print(f"Name: {self.name}, Email: {self.email}")

# Admin inherits User(inheritance) and uses Address (composition)
class Admin(User):
    def __init__(self, name, email, password, address_obj):
        super().__init__(name, email, password)
        self.address = address_obj 

    def display_admin_info(self):
        print(f" Admin: {self.name}, Email: {self.email}, Password: {self.password}")
        print(f" Address: {self.address.display()}")

admin_accounts = []

for i, data in enumerate(users):
    addr_data = addresses[i]
    address = Address(addr_data["street"], addr_data["city"], addr_data["pincode"])
    admin = Admin(data["name"], data["email"], data["password"], address)
    admin_accounts.append(admin)

print("Admin Accounts Info:")
for acc in admin_accounts:
    acc.display_user_info()
    acc.display_admin_info()
