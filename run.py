from server import app, db

import server.demo # load it!##
import server.customers
import server.login
import server.pizzas
import server.orders


from flask_socketio import SocketIO, emit

db.create_all()


socketio = SocketIO(app)
@socketio.on('new_order', namespace='/order')
def newOrder():
    emit('new_order')


if __name__ == "__main__":
  app.debug = True
  socketio.run(app, host='0.0.0.0')
