# from math import log10
# tuple_example=(1,2,3)
# print(type(tuple_example))

# list_example=[1,2,3]
# print(type(list_example))

# dict_example={1:2,2:3,3:4}
# print(type(dict_example))
# print(list_example)
# print(id(list_example[0]))
# list_example[0]=list_example
# print(id(list_example[0]))
# print(list_example)



# # factorial of a number 
# def factorial(N:float):
#     if N==0:
#         return 1
#     return N*factorial(N-1)*factorial(N-1)

# # Sum of first x natural numbers
# def natural_sum(x):
#     return x*(x+1)//2

# class M:
#     def __init__(self):
#         self.arr=[1]
#     def arr(self):
#         return self.arr 

# print(int(log10(factorial(10))))
# print(natural_sum(10))

# o=[1]
# print(id(o))
# print(id(o[0]))
# o.append(0)
# print(id(o))
# print(id(o[0]))



# class My:
#     def __init__(m):
#         m.arr=[1]
#     def go(m):
#         return m.arr

# g=My()

# print(g.go())



# Questions
# 1
# x = 5
# y = 2.0
# z = x // y + x / y
# print(type(z), z)

# # 2
# a = 2
# b = 3
# c = 4
# result = a ** b * c // a + b % c
# print(result)
# # 3
# x = True
# y = False
# z = True
# print(x and y or not z and x)
# # 4
# a = "100"
# b = 25
# print(a * 2 + str(b))
# print(int(a) // b + len(a))
# # 5
# x = 0.1 + 0.2
# y = 0.3

# print("%5",x,y,x == y, round(x, 1) == y)
# # 6
# num = 7
# val = num + 2.0
# print(type(val), val)
# val = str(num) + "2"
# print(val)
# # 7
# for_ = 10
# while_ = 5
# print(for_ + while_)
# # 8
# x = 5
# y = 10
# z = x > y or y > x and not x == y
# print(z)

# # 9
# a = "12.5"
# b = int(float(a)) + bool("")
# c = str(bool(a)) + str(bool(0))
# print(b, c)

# # 10
# print(7 / 3, 7 // 3, -7 // 3)


# 11.
a = 10
b = 10
print(a is b, id(a), id(b))
# 12.
x = 1000
y = 1000
print(x is y, id(x), id(y))
# 13.
s1 = "hello"
s2 = "hello"
print(s1 is s2, id(s1), id(s2))
# 14.
s1 = "Python!"
s2 = "".join(["Python!"])
print(s1 == s2, s1 is s2)
# 15.
a = 25
b = float(a)
print(type(a), type(b))
print(id(a), id(b))
# 16.
list1 = [1, 2, 3]
list2 = list1
list2.append(4)
print(id(list1), id(list2))
print(list1)
# 17.
t1 = (1, 2, 3)
t2 = t1
print(id(t1), id(t2))
t2 = t2 + (4,)
print(id(t1), id(t2))

# 18.
print(id(True), id(1))
print(True == 1, True is 1)
# 19.
x = "123"
y = int(x)
z = int("123")
print(y == z, y is z)
# 20.
a = 5
b = 5.0
print(type(a), type(b))
print(a == b, a is b)

print("POWER",2**3,1<<3,1<<3*4555)


