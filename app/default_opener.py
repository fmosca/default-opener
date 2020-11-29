#! /usr/local/bin/python3
import nativemessaging
import webbrowser
    
nativemessaging.send_message(nativemessaging.encode_message('Listening'))

while True:
    message = nativemessaging.get_message()
    if 'text' in message:
        nativemessaging.send_message(nativemessaging.encode_message(message['text']))
        webbrowser.open_new_tab(message['text'])
