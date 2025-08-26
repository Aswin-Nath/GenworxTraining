# class Integer:
#     def __init__(self,x):
#         self.val=x
#     def __add__(self,x):
#         return Integer(self.val+x.val)

# class A(Integer):
#     salary=1
#     def __init__(self):
#         super().__init__(1)

# class B(Integer):
#     salary=2
#     def __init__(self):
#         super().__init__(2)
    
# class C(Integer):
#     salary=4
#     def __init__(self):
#         super().__init__(3)
# aa=A()
# bb=B()
# cc=C()
# print((aa+bb+cc).val,aa.val,bb.val)
def add(self,b):
    return b+self
list.__add__=add

a=list("Aswin")
b=list("Nath")

print(a+b)


    