N=int(input())
password=""
chars=list("abcdefghijklmnopqrstuvwxyz")
numbers=list(range(11))
special=list("!@#$%^&*'<>?:")
from random import *
for i in range(N):
    charRandom=choice(chars)
    numberRandom=str(choice(numbers))
    specialRandrom=choice(special)
    password+=choice([charRandom,numberRandom,specialRandrom])
print(password)