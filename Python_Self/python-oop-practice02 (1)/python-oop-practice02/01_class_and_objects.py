from utils.utils_01 import books

class Book:
    def __init__(self, title, author, year, price, available):
        self.title = title
        self.author = author
        self.year = year
        self.price = price
        self.available = available

    def summary(self):
        return f"{self.title} by {self.author}, published in {self.year} for a price of {self.price} and is {self.available}"

for data in books:
    book = Book(*data)  
    print(book.summary())
