from utils.utils_03 import movies  

class Movie:
    def __init__(self, title, genre, year):  
        self.title = title
        self.genre = genre
        self.year = year

    def display_info(self):
        print(f"Title: {self.title}, Genre: {self.genre}, Year: {self.year}")

def get_movies_by_year(movie_list, year):
    found = False
    for movie in movie_list:
        if movie.year == year:
            movie.display_info()
            found = True
    if not found:
        print(f"❌ No movies found for year {year}")

movieStore = [Movie(**movie) for movie in movies]

print("Choose an option:")
print("1. Show all movies")
print("2. Search movies by year")
option =  input("Enter 1 or 2: ")

if option == "1":
    for movie in movieStore:
        movie.display_info()
elif option == "2":
    try:
        user_year = int(input("📅 Enter year to search for movies: "))
        get_movies_by_year(movieStore, user_year)
    except ValueError:
        print(" Please enter a valid year.")
else:
    print(" Invalid option. Please enter 1 or 2.")


# ##You have learnt
# 1. Class & Object Basics
# Defined a custom Movie class using __init__
# Created multiple instances (objects) from a list of data
# Stored them in a list and accessed attributes via methods
# class Movie:
#     def __init__(self, name, genre, year):
#         ...
# 2. Encapsulation
# Used methods like display_info() to control how internal data is exposed
# Kept object data (self.name, self.genre, etc.) safe within the object
# 3. Dynamic Object Creation
# Converted raw movie data (dicts) into Movie objects using unpacking:
# movieStore = [Movie(**movie) for movie in movies]
# 4. Utility Functions (Outside Class)
# Created reusable logic like get_movies_by_year() outside the class
# Practiced separation of concerns: data vs. logic
# def get_movies_by_year(movie_list, year):
#     ...
# 5. User Input & Control Flow
# Took input from the terminal (input())
# Added basic CLI menu logic (if-elif-else)
# Used try-except for error handling (e.g., invalid year input)
# 6. Data Unpacking with **kwargs
# Learned the difference between *args (for tuples) and **kwargs (for dicts)
# Practiced adapting class constructors to match external data structure