import socketio
import requests
import sys
import time

from score import Socket

ip = "http://192.168.50.44:3000"
# ip = "https://creative.ntuee.org"

def stop_game():
    g = requests.get(ip + "/game_status")
    cur_team = g.json()['current_team']
    if(cur_team != None):
        socket = Socket(ip)
        socket.stop_game()

def reset_game():
    g = requests.get(ip + "/reset?pass=taonly")
    print(g.json())

if __name__ == '__main__':
    #stop_game()
    if(sys.argv[1] == 'stop'):
        stop_game()
    elif(sys.argv[1] == 'reset'):
        reset_game()
