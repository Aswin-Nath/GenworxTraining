class Products:
    def __init__(self,name,price,id):
        self.name=name
        self.__price=price
        self.__id=id
    def get_price(self):
        return self.__price