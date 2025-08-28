# # # # # # 1. During lockdown, ATMs were allowed to dispatch currencies in specific way. If
# # # # # # user enters the amount, which is not multiple of 500 transactions will be rejected.
# # # # # # If amount is 500 exactly, then 5 currencies of 100 will be dispatched by machine.

# # # # N=int(input("Enter the amount:"))

# # # # if N%500==0:
# # # #     if N==500:
# # # #         print("please dispatch 5 notes of 100")
# # # #     else:
# # # #         print("Accepted")
# # # # else:
# # # #     print("please enter a amount multiple of 500")

# # # # # # 2. Reina and Sierra were playing a game. Reina would give out number, and Sierra
# # # # # # must reverse the given number. Help Sierra by writing program to reverse the
# # # # # # number. Note that Reina should give a five-digit number.


# # # # # N=int(input())
# # # # # reverse=0
# # # # # while N>0:
# # # # #     reverse=reverse*10+N%10
# # # # #     N=N//10

# # # # # print(N)

# # # # # 3. Write a program to print all prime numbers between 1 and N(inclusive). N will be
# # # # # the input.



# # # N=int(input("Enter the Number:"))
# # # for i in range(2,N+1):
# # #     j=2
# # #     while j<=int(i**0.5):
# # #         if i%j==0:
# # #             break
# # #         j+=1
# # #     else:
# # #         print(i,"is a prime number")

# # # # 4. Ann wanted to check her students’ knowledge on divisors. If she gives a number,
# # # # then students should say all the factors of that number. Write a program for this.

# # N=int(input("Enter the  Number:"))
# # factors=set()
# # i=1
# # while i<=int(N**0.5):
# #     if N%i==0:
# #         factors.add(i)
# #         factors.add(N//i)
# #     i+=1
# # factors=sorted(factors)

# # print(*factors)


# 5.Write a Python program that reads a decimal number from the user and converts it to binary, octal, and hexadecimal.

# def convert(n,base):
#     DIGITS='0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
#     nBase=''
#     while n:
#         nBase+=DIGITS[n%base]
#         n//=base
#     return nBase[::-1]
# n=int(input())
# print("Binary",bin(2)[2:])
# print("octal",convert(n,8))
# print("hexadecimal",convert(n,16))

# 6.Write a Python program to calculate the number of leap years in a century. 
# Prompt the user to enter the century (e.g., 19 for 1901-2000). Validate the input as a positive integer and calculate and print the number of leap years. 

# century=int(input())

# Count=0

# for i in range((century-1)*100+1,century*100+1):
#     if (i%400==0) or (i%4==0 and i%100!=0):
#         Count+=1
# print(Count)


# # # 7. Count Integers with Even Digit Sum
# # # Problem statement: Given a positive integer num, return the number of positive integers less
# # # than or equal to num whose digit sums are even. The digit sum of a positive integer is the
# # # sum of all its digits.

# N=int(input("Enter the Number:"))
# Count=0
# for i in range(1,N+1):
#     if sum(list(map(int,str(i))))%2==0:
#         Count+=1

# print(Count)

# # 8. Count the Digits That Divide a Number
# # Problem statement: Given an integer num, return the number of digits in num that divide
# # num. An integer val divides nums if nums % val == 0.


# N=int(input("Enter the Number:"))
# C=0
# for i in str(N):
#     i=int(i)
#     C+=(i>0 and N%i==0)

# print(C)

# # 9. A student will not be allowed to sit in exam if his/her attendance is less than
# # 75%. Number of classes held, and the Number of classes attended are the inputs.
# # Display the attendance percentage and the eligibility of the student for the exam.
# # Allow the student to sit if he/she has medical cause. Ask user if he/she has medical
# # cause or not (‘Y' or 'N’) only when the attendance is lacking and print accordingly.

# held_class=int(input())
# attended_class=int(input())
# percentage=100*(attended_class/held_class)

# if percentage<75:
#     medical=input()
#     if medical=="Yes":
#         print("allowed")
#     else:
#         print("not allowed")
# else:
#     print("allowed")

# # 10. Write a Python program to calculate the electricity bill for a customer based on
# # the number of units consumed. The billing rates are as follows:


# N=int(input())
# bill_total=0

# if N>300:
#     bill_total+=6*max(0,N-300)
#     N-=max(0,N-300)
# if N>200:
#     bill_total+=4*max(0,N-200)
#     N-=max(0,N-200)
# if N>100:
#     bill_total+=2.5*max(0,N-100)
#     N-=max(0,N-100)

# bill_total+=max(0,N)*1.5


# print(bill_total)


# 11.Jessica teaches her students about how many days in a month, what is a leap year and how to find it. Write a program to help her by saying the answer (number of days in a month) to expect from the student for the given month number and the year. 

 
# 12.During lockdown, ATMs were allowed to dispatch currencies in specific way. 
# If user enters the amount, which is not multiple of 500 transactions will be rejected. 
# If amount is 500 exactly, then 5 currencies of 100 will be dispatched by machine. 
# If amount is between 500 to 2000 you will get 500 in the form of 100s currencies, rest 500s currencies. 
# If amount is greater than 2000, then 2000 currencies will be dispatched and rest will be 
# dispatched in the denomination of 500, last 500 will be in the denomination of 100. 

# amount=int(input())

# if amount%500!=0:
#     print("please enter the amount multiple of 500 ")
# else:
#     if amount==500:
#         print("5 notes of 100")
#     elif amount>2000:
#         no_of_2000=amount//2000
#         remaining=amount%2000
#         print(f"{no_of_2000} notes of 2000")
#         if remaining>0:
#             no_of_500=(remaining//500)-1
#             if no_of_500>0:
#                 print(f'{no_of_500} notes of 500')
#             print("5 notes of 100")
#     else:
#         print("5 notes of 100")
#         remaining = amount - 500
#         if remaining > 0:
#             print(f"{remaining // 500} notes of 500")

# # 13. Given a start number and end number, you need to display the numbers inclusive
# # but “ding” for every 5th number and “dong” for every 10th number. 

# j=0
# S,E=list(map(int,input().split()))
# for i in range(S,E+1):
#     j+=1
#     if j%10==0:
#        print("dong",end=" ")
#     elif j%5==0:
#         print("ding",end=" ")
#     else:
#         print(i,end=" ")

# 14.Ana planned to choose a four-digit lucky number for his car. Her lucky numbers are 3, 5 and 7. Help her to find the car number, whose sum is divisible by 3 or 5 or 

# 7. Provide a valid car number, fails to provide a valid input then display that number is not a valid car number. 

# number=input()

# if not number.isdigit() or len(number)!=4:
#     print("Its not a valid car number")
# else:
#     Digit_sum=sum([int(i) for i in number])
#     if any(Digit_sum%i==0 for i in [3,5,7]):
#         print("can be my car number")
#     else:
#         print("cannot be my car number")


# 15. Danny teaches his student to find the factorial of a number. 
# He wanted to test the understanding of the student. For that, he 
# provides a number. He wants the students to tell him that number 
# is a factorial of which number. Help the student by writing a program to 
# do this. Note that the input should be a number greater than zero. 
# If the input is less than or equal to zero, the output should be “Invalid Input”. 
# Also, if the input provided is not exactly the factorial of a number, say, the input provided is 122, which is not a perfect factorial 
# of a number, it should return “Sorry. The given number is not a perfect factorial”. 

# factorial_number=int(input())
# i=0
# if factorial_number<=0:
#     print("Invalid Input")
# else:
#     cur=1
#     while cur<factorial_number:
#         i+=1
#         cur*=i
#     if cur==factorial_number:
#         print(i)
#     else:
#         print("Sorry. The given number is not a perfect factorial")
# 16.Divisor Game 

# Problem statement: Alice and Bob take turns playing a game, with Alice starting first. Initially, there is a number n on the chalkboard. On each player's turn, that player makes a move consisting of: 

# Choosing any x with 0 x n and n % x == 0. 

# Replacing the number n on the chalkboard with n - x. 

 

# Also, if a player cannot make a move, they lose the game. 

 
# N=int(input())
# print("True" if N%2==0 else "No")
# 17.Nim Game 
# Problem Statement: You are playing the following Nim Game with your friend: Initially, there is a heap of stones on the table. You and your friend will alternate taking turns, and you go first. On each turn, the person whose turn it is will remove 1 to 3 stones from the heap. The one who removes the last stone is the winner. Given n, the number of stones in the heap, return true if you can win the game assuming both you and your friend play optimally, otherwise return false. 

# N=int(input())
# if N%4==0:
#     print("False")
# else:
#     print("True")

# # 18. Factorial Divisibility
# # Problem statement: Given an integer n, find the largest power of a prime number p that
# # divides n!.
# def factorial(x):
#     if x<=1:
#         return 1
#     return x*factorial(x-1)
# n,p=[int(i) for i in input().split()]

# value=factorial(n)
# ans=-1
# j=0
# while True:
#     v=p**j
#     if v>int(value**0.5):
#         break
#     if value%v==0:
#         ans=j
#     j+=1

# print(ans)


# # 19. Climbing Stairs
# # Problem Statement: You are climbing a staircase. It takes n steps to reach the top. Each time
# # you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?

# n=int(input())
# dp=[0 for i in range(n+1)]
# dp[0]=1

# for i in range(n):
#     if i+1<=n:
#         dp[i+1]+=dp[i]
#     if i+2<=n:
#         dp[i+2]+=dp[i]
# print(dp[n])


# # 20. Count possible ways to construct buildings
# # Problem Statement: There is a road passing through a city with N plots on both sides of the
# # road. Plots are arranged in a straight line on either side of the road. Determine the total
# # number of ways to construct buildings in these plots, ensuring that no two buildings are
# # adjacent to each other. Specifically, buildings on opposite sides of the road cannot be
# # adjacent.
# # Using * to represent a plot and || for the road, the arrangement for N = 3 can be visualized
# # as follows: * * * || * * *.
# # Note: As the answer can be very large, print it mod 109+7.Constraints

# n=int(input())
# M=pow(10,9)+7

# dp=[0 for i in range(n+2)]
# dp[-1]=1
# dp[-2]=1
# for i in range(n-1,-1,-1):
#     dp[i]+=dp[i+1]+dp[i+2]
#     dp[i]%=M

# print(dp[0]**2)

# # 21. Given an integer, find the longest consecutive sequence of 1s in its binary
# # representation

# N=int(input())
# M=bin(N)[2:]
# prev=M[0]
# cur=0 if M[0]=="0" else 1
# ans=0 if M[0]=="0" else 1
# for i in M[1:]:
#     if i=="1":
#         cur+=1
#     else:
#         cur=0
#     ans=max(ans,cur)
# print(ans)



# # 22. Collatz Sequence Steps
# # Given a positive integer n, repeatedly apply the following rules:
# # • If n is even, divide it by 2.
# # • If n is odd, multiply it by 3 and add 1.
# # Count how many steps it takes to reach 1.


# ans=0
# N=int(input())
# while N>1:
#     ans+=1
#     if N%2==0:
#         N=N//2
#     else:
#         N=N*3+1
# print(ans)


# # 23. Jumping Number Check
# # A number is "jumping" if the absolute difference between every pair of adjacent digits is exactly 1. Check if the
# # given number is jumping.


# ans=True

# N=int(input())

# N=str(N)

# for i in range(len(N)-1):
#     ans&=(abs(int(N[i])-int(N[i+1]))==1)

# print("Yes" if ans else "No")

# 24.Josephus Problem 
# Given n people standing in a circle and eliminating every kth person until one remains, find the position of the survivor (1-indexed). 

# n,k=[int(i) for i in input().split()]
# people=list(range(1,n+1))
# idx=0
# while len(people)>1:
#     idx=(idx+k-1)%len(people)
#     people.pop(idx) 
# print(people[0])
# 25.Number Pyramid with Center Alignment 
# Given an integer n, print a pyramid of numbers where the middle number of each row increases consecutively and numbers decrease symmetrically on both sides. The pyramid should be center- aligned

# n=int(input())
# for i in range(1,n+1):
#     for s in range(n-i): 
#         print(" ",end=" ")
#     for j in range(i,2*i):
#         print(j,end=" ")
#     for j in range(2*i-2,i-1,-1):
#         print(j,end=" ")
#     print()


# 26.Pyramid Pattern with rectangular frame 
# Write a program that prints a pyramid pattern within a rectangular frame of asterisks (*). The height of the pyramid will be specified by the user, and the rectangle will encompass the pyramid, ensuring it's centered. 

# Dimensions: 

# The program calculates the width of the rectangle based on the height of the pyramid. 

# The pyramid is centered within the rectangle. 
# n=int(input())
# w=2*n
# for i in range(n-1,-1,-1):
#     for j in range(w):
#         if j<=i or j>=w-i-1:
#             print("*",end="")
#         else:
#             print(" ",end="")
#     print()
# for i in range(w):
#     print("*",end="")


# # 27. Trap Rainwater Problem
# # Given heights of blocks, calculate how much water can be trapped between them after rainfall.

# dimentions=[int(i) for i in input().split()]
# n=len(dimentions)
# ans=0
# pref_max=[i for i in dimentions]
# for i in range(1,n):
#     pref_max[i]=max(pref_max[i-1],dimentions[i])
# suff_max=[dimentions[-1] for i in dimentions]
# for i in range(n-2,-1,-1):
#     suff_max[i]=max(suff_max[i+1],dimentions[i])
# for i in range(1,n-1):
#     ans+=max(0,min(pref_max[i-1],suff_max[i+1])-dimentions[i])
# print(ans)

# # 28. Circular Prime Check
# # A number is circular prime if all rotations of its digits are prime. Check if a given number
# # is a circular prime.

# N=int(input())

# digits1={9:6,6:9,2:5,5:2}
# for i in range(1,11):
#     if i not in digits1:
#         digits1[i]=i
# def prime(x):
#     i=2
#     while i<=int(x**0.5):
#         if x%i==0:
#             return False
#         i+=1
#     return True
# new=0
# for i in str(N):
#     new=new*10+digits1[int(i)]
# if prime(new):
#     print("Yes")
# else:
#     print("No")

# # 29. Kaprekar’s Process
# # Given a 4-digit number with at least two different digits, repeatedly:
# # • Arrange digits in descending and ascending order to form two numbers.
# # • Subtract the smaller from the larger.
# # • Repeat until you reach 6174.
# # Count the steps required.

# n=int(input())
# ans=0
# while n!=6174:
#     digits =list(map(int,str(n)))
#     while len(digits)<4:
#         digits.append(0)
#     one=0
#     for i in sorted(digits,reverse=True):
#         one=one*10+i
#     two=0
#     for i in sorted(digits):
#         two=two*10+i
#     ans+=1
#     n=one-two

# print(ans)

# # 30. Digital Root Multiplication
# # Given a number, multiply its digits repeatedly until a single digit remains. Output that
# # digit.

# n=int(input())
# while len(str(n))>1:
#     cur=1
#     for j in str(n):
#         cur*=int(j)
#     n=cur


# print(n)


# days_in_month = {
#     1: ["January", 31],
#     2: ["February", 28],
#     3: ["March", 31],
#     4: ["April", 30],
#     5: ["May", 31],
#     6: ["June", 30],
#     7: ["July", 31],
#     8: ["August", 31],
#     9: ["September", 30],
#     10: ["October", 31],
#     11: ["November", 30],
#     12: ["December", 31]
# }


# year,month=[int(i) for i in input().split()]
# prefix=f"{days_in_month[month][0]} {year} has "
# if month==2:
#     if (year%400==0) or (year%4==0 and year%100!=0):
#         print(prefix,days_in_month[month][1]+1,"days")
#     else:
#         print(prefix,days_in_month[month][1],"days")
# else:
#     print(prefix,days_in_month[month][1],"days")


