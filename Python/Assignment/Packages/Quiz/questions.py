from collections import defaultdict
class Questions:
    def __init__(self):
        self.questions=defaultdict(any)
    
    def add_question(self,question,answer):
        self.questions[question]=answer
    