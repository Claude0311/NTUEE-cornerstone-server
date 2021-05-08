import socketio
import requests
import sys
import time

from score import Socket

ip = "http://192.168.50.254:3000"

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

if __name__ == '__main__':
    #stop_game()
    if sys.argv[1] == 'stop':
        stop_game()
    elif sys.argv[1] == 'reset':
        reset_game()
    elif sys.argv[1] == 'deduct':
        deduct_point()
