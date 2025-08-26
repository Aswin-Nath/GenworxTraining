from collections import defaultdict
class Carts:
    def __init__(self):
        self.products=defaultdict(str)
    
    def add_product(self,product):
        print(product)
        self.products[product]+=1
    def remove_prodcut(self,product):
        self.products[product]-=1
    
    