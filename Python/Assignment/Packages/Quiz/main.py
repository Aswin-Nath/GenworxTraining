from questions import Questions
from game import Game
from leaderboard import LeaderBoard
LeaderBoard=LeaderBoard()
users=[i for i in input().split()]
for i in users:
    LeaderBoard.add_party(i)
N=int(input())
questions_class=Questions()
for i in range(N):
    question,answer=[j for j in input().split()]
    questions_class.add_question(question,answer)
Games=Game(questions_class)
while True:
    question,answer=Games.choose()
    print("Question",question)
    if question==None:
        break
    user=input()
    query=input()
    if query==answer:
        LeaderBoard.add_score(user)
    LeaderBoard.display_leaderboard()