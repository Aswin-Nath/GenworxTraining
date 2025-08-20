# # 1. During lockdown, ATMs were allowed to dispatch currencies in specific way. If
# # user enters the amount, which is not multiple of 500 transactions will be rejected.
# # If amount is 500 exactly, then 5 currencies of 100 will be dispatched by machine.

N=int(input())
if N%500==0:
    if N==500:
        print("please dispatch 5 notes of 100")
    else:
        print("Accepted")
else:
    print("please enter the amount multiple of 500")

# # 2. Reina and Sierra were playing a game. Reina would give out number, and Sierra
# # must reverse the given number. Help Sierra by writing program to reverse the
# # number. Note that Reina should give a five-digit number.


# N=int(input())
# reverse=0
# while N>0:
#     reverse=reverse*10+N%10
#     N=N//10

# print(N)

# # 3. Write a program to print all prime numbers between 1 and N(inclusive). N will be
# # the input.



# N=int(input())
# for i in range(1,N+1):
#     j=2
#     while j*j<=N:
#         if i%j==0:
#             break
#     else:
#         print(i,"is a prime number")

# # 4. Ann wanted to check her students’ knowledge on divisors. If she gives a number,
# # then students should say all the factors of that number. Write a program for this.

# N=int(input())
# factors=set()
# i=1
# while i<=int(N**0.5):
#     if N%i==0:
#         factors.add(i)
#         factors.add(N//i)
#     i+=1
# factors=sorted(factors)

# print(*factors)

5.
6.

# # 7. Count Integers with Even Digit Sum
# # Problem statement: Given a positive integer num, return the number of positive integers less
# # than or equal to num whose digit sums are even. The digit sum of a positive integer is the
# # sum of all its digits.

# N=int(input())
# Count=0
# for i in range(1,N+1):
#     if sum(list(map(int,str(i))))%2==0:
#         Count+=1

# print(Count)

# # 8. Count the Digits That Divide a Number
# # Problem statement: Given an integer num, return the number of digits in num that divide
# # num. An integer val divides nums if nums % val == 0.


# N=int(input())
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


11.
12.

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

14.
15.
16.
17.

# # 18. Factorial Divisibility
# # Problem statement: Given an integer n, find the largest power of a prime number p that
# # divides n!.
# from math import factorial
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
# def dp(i):
#     if i>=n:
#         return 1
#     return (dp(i+1)+dp(i+2))%M

# print(2*dp(0))  

# # 21. Given an integer, find the longest consecutive sequence of 1s in its binary
# # representation

# N=int(input())
# M=bin(N)[2:]
# prev=M[0]
# cur=0 if M[0]=="0" else 1
# ams=0 if M[0]=="0" else 1
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
#     ans&=(abs(N[i]-N[i+1])==1)

# print("Yes" if ans else "No")

24.
25.
26.

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
#     return True
# new=0
# for i in str(n):
#     new=new*10+digits1[i]
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
# ans=-1
# while True:
#     ans+=1
#     digits=list(map(int,str(n)))
#     one="".join(sorted(digits,reverse=True))
#     two="".join(sorted(digits))
#     arr=[two,one]
#     arr.sort()
#     D=arr[-1]-arr[0]    
#     if D==6174:
#         break



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

