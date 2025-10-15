from models.book_models import BookInventory,BookBase
from models.author_models import AuthorModel


author_instance=AuthorModel(author_id=1,name="rowling",email="rowling@gmail.com")
book_instance=BookBase(title="Harry Potter",price=1000,published_year=2001,author=author_instance)
books=[BookInventory(book_id=1,Book=book_instance,isAvailable=True)]
