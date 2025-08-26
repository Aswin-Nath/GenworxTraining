from account import Account
class Error(Exception):
    pass
class NonPositiveAmountError(Error):
    pass

class LessBalanceError(Error):
    pass    
    

class Transaction(Account):
    def __init__(self,account:Account):
        self.account=account
    def deposit(self,amount):
        if amount>0:
            self.account.balance+=amount
        else:
            raise NonPositiveAmountError("Give a postive amount to add")
    def withdraw(self,amount):
        if self.account.balance<amount:
            return LessBalanceError("Your account has less balance for the transaction")
        else:
            self.account.balance-=amount
    
