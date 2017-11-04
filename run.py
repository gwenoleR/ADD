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
    emit('order_received', {}, broadcast=True)
    print('socket new_order received')

@socketio.on('order_received', namespace='/order')
def order():
  print('order_received')

if __name__ == "__main__":
  app.debug = True
  socketio.run(app, host='0.0.0.0')
