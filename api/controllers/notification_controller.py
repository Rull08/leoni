from flask_socketio import emit

def send_notification(socketio, message):
    socketio,emit('new_notification', {'message': message})