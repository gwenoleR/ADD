from server import app, db

import server.customers
import server.login
import server.pizzas
import server.orders


from flask_socketio import SocketIO, emit

db.create_all()


socketio = SocketIO(app)
@socketio.on('new_order', namespace='/order')
def newOrder():
    emit('order_received', {}, broadcast=True)


if __name__ == "__main__":
  app.debug = True
  socketio.run(app, host='0.0.0.0')
