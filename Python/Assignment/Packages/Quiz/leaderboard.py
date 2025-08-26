class LeaderBoard:
    def __init__(self):
        self.participants={}
    def add_party(self,name):
        self.participants[name]=0
    def add_score(self,name):
        self.participants[name]+=1

    def display_leaderboard(self):
        diff=list(self.participants.items())
        diff.sort(key=lambda x:-(x[1]))
        print("LeaderBoard","-"*40)
        for name,score in diff:
            print(f"player name:{name} -> score:{score}")
    