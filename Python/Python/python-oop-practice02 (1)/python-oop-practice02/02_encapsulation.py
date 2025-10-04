from utils.utils_02 import bankAccounts

class BankAccount:
    def __init__(self, account_number, account_name, initial_balance):
        self.account_number = account_number
        self.account_name = account_name
        self.__balance = initial_balance

    def deposit(self, amount):
        if amount > 0:
            self.__balance += amount
            return f"✅ Amount: ₹{amount} deposited to {self.account_name}'s account. New balance: ₹{self.__balance}"
        else:
            return f"❌ Deposit failed for {self.account_name}. Invalid amount: ₹{amount}"

    def withdraw(self, amount):
        if amount <= 0:
            return f"❌ Withdrawal failed for {self.account_name}. Invalid amount: ₹{amount}"
        elif amount > self.__balance:
            return f"❌ Withdrawal failed for {self.account_name}. Insufficient balance."
        else:
            self.__balance -= amount
            return f"✅ Amount: ₹{amount} withdrawn from {self.account_name}'s account. New balance: ₹{self.__balance}"

    def check_balance(self):
        return f"💰 Current balance for {self.account_name}: ₹{self.__balance}"

    def get_account_number(self):
        return self.account_number

    def get_account_name(self):
        return self.account_name

    def get_balance(self):
        return self.__balance

    def update_new_balance(self, new_balance):
        if new_balance >= 0:
            self.__balance = new_balance
            return f"✅ Balance updated to ₹{self.__balance} for {self.account_name}"
        else:
            return f"❌ Balance update failed for {self.account_name}. Negative amount not allowed."

accounts = []

for acc_data in bankAccounts:
    acc = BankAccount(*acc_data)
    accounts.append(acc)


for acc in accounts:
    print(f"\n👤 Account Holder: {acc.get_account_name()}")
    print(f"🔢 Account Number: {acc.get_account_number()}")

    print(acc.check_balance())
    print(acc.deposit(500))
    print(acc.withdraw(300))
    print(acc.withdraw(100000))  # Intentional error
    print(acc.deposit(-200))     # Intentional error
    print(acc.update_new_balance(10000))
    print(acc.update_new_balance(-500))  # Intentional error
    print("🧾 Final Balance:", acc.get_balance())
    print("-" * 40)
