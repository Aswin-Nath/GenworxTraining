from questions import Questions
class Game(Questions):
    def __init__(self,questions:Questions):
        self.questions=questions.questions
        self.seen=set()
    def choose(self):
        for question,answer in self.questions.items():
            if question not in self.seen:
                self.seen.add(question)
                return question,answer
        return None,None
    