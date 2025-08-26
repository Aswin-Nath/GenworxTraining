# def f(a,b="a",c="c"):
#     return a,b,c
# print(f("K",c="a"))
# i=4
# def f(org=i):
#     print(org)
# f()
# f(i:="6")
# f()
# f(12)
# f(5)
# f()
# print(i)



l=lambda x:(u:=lambda y:x*y)
print(l(5)(6))
print(l(1)(5))

try:
    a=5
except ValueError:
    print("error")
else:
    b=a+1

print(b)