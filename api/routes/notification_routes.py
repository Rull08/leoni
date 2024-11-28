from flask_socketio import SocketIO, emit

def register_notification_routes(socketio: SocketIO):
    @socketio.on('trigger_notification')
    def on_trigger_notification(data):
        message = data.get('message', 'Nueva notifiacion')
        emit('new_notification', {'message': message}, broadcast=True)