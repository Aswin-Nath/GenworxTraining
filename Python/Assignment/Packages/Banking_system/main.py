from account import *
from transactions import *
from loan import *
Name=input()
initial_balance=int(input())
user_account=Account(Name,initial_balance)

Transact=Transaction(user_account)

Deposit=int(input())
Transact.deposit(Deposit)
withdraw=int(input())
Transact.withdraw(withdraw)
amount=int(input())
Rate=int(input())
Duration=int(input())


print("Final Balance:"+str(user_account.balance))
print("EMI:"+str(Emi(amount,Rate,Duration)))