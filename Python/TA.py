'''TA program for controlling the game and scoreboard server.

Execution:
python TA.py [command]

[command] includes:

stop
    > stop the current game.

reset
    > reset the scoreboard to empty.

deduct
    > deduct points for penalty. (default 50 pts)

set_score
    > set the score for the current game or modify the history. Enter 
    target in the prompt.
'''

import socketio
import requests
import sys
import time

from score import Socket

ip = "http://localhost:3000"

def stop_game():
    g = requests.get(ip + "/game_status")
    cur_team = g.json()['current_team']
    if(cur_team != None):
        socket = Socket(ip)
        socket.stop_game()

def reset_game():
    g = requests.get(ip + "/reset?pass=taonly")
    print(g.json())

def deduct_point(deduction=50):
    g = requests.get(ip + "/game_info")
    score = g.json()['status']['point']
    print(f"Score before deduction: {score}")
    g = requests.get(f"{ip}/modify_score?new_score={score - 50}")
    if g.json()['msg'] == "success":
        print("Success")
    else:
        print("Failed")
    g = requests.get(ip + "/game_info")
    score = g.json()['status']['point']
    print(f"Score after deduction: {score}")

def set_score(team, score):
    try:
        # get current score
        g = requests.get(ip + "/game_info")
        before_score = g.json()["status"]["point"] if team == "" else g.json()["history"]["0"][team]["point"]
        print(f"Score before set_score: {before_score}")
        # modify score
        if team == "":
            g = requests.get(f"{ip}/modify_score?new_score={score}")
        else:
            g = requests.get(f"{ip}/modify_score?team={team}&new_score={score}")
        if g.json()['msg'] == "success":
            print("Success")
        else:
            print("Failed")
        # get modified score
        g = requests.get(ip + "/game_info")
        after_score = g.json()["status"]["point"] if team == "" else g.json()["history"]["0"][team]["point"]
        print(f"Score after set_score: {after_score}")
    except KeyError as e:
        print("Failed with KeyError (No such team?):", e)

if __name__ == '__main__':
    if sys.argv[1] == 'stop':
        stop_game()
    elif sys.argv[1] == 'reset':
        reset_game()
    elif sys.argv[1] == 'deduct':
        deduct_point()
    elif sys.argv[1] == 'set_score':
        team = input("Enter team name, empty string for current playing team: ")
        score = input("Enter new score for the team: ")
        set_score(team, score)
