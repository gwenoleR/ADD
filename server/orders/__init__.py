from .. import app, db, manager, admin, ModelView
import uuid
import json
import datetime
from sseclient import SSEClient
from flask import request, make_response
from server.login import requires_connected


class Orders(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    oid = db.Column(db.String(40), server_default=str(uuid.uuid4()),unique=True, nullable=False)
    customer_username = db.Column(db.String(40), nullable=False)
    order_pizzas = db.Column(db.String, nullable=False)
    order_state = db.Column(db.String(30), nullable=False, server_default='new')
    order_date = db.Column(db.String, nullable=False)

    def create(self, customer_username, order_pizzas, order_state):
        self.customer_username = customer_username
        self.order_pizzas = order_pizzas
        self.oid = str(uuid.uuid4())
        self.order_date = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")

        return self


    def as_dict(self):
        return {'oid' : self.oid, 'customer_username' : self.customer_username, 'order_pizzas' : self.order_pizzas, 'order_state' : self.order_state, 'order_date' : self.order_date}

manager.create_api(Orders, methods=['GET', 'POST'])

admin.add_view(ModelView(Orders, db.session))

@app.route('/orders', methods=['GET'])
def getOrders():
    orders = []
    for o in Orders.query.all():
        orders.append(o.as_dict())
    resp = make_response(json.dumps(orders), 200)
    return resp

@app.route('/orders', methods=['POST'])
def addOrder():
    req = request.get_json()

    if not 'customer_username' in req or not req['customer_username']:
        return make_response('customer_username is required',401)
    if not 'order_pizzas' in req or not req['order_pizzas']:
        return make_response('order_pizzas is required',401)
    if not 'order_state' in req  or not req['order_state']:
        req['order_state'] = "new"
    
    order = Orders()
    order = order.create(req['customer_username'],req['order_pizzas'],req['order_state'])
    try:
        db.session.add(order)
        db.session.commit()
    except:
        return make_response('Insert error', 500)

    return make_response('Created', 201)

@app.route('/orders/<string:oid>', methods=['GET'])
def getOrdersById(oid):
    order = Orders.query.filter_by(oid = oid).first()

    if order is None:
        return make_response('Not found', 404)

    resp = make_response(json.dumps(order.as_dict()), 200)
    return resp


@app.route('/orders/<string:oid>', methods=['PATCH'])
def editOrderById(oid):
    req = request.get_json()

    order = Orders.query.filter_by(oid=oid).first()
    if order is None:
        return make_response('Not found',404)

    updated = False
    if 'order_pizzas' in req:
        order.order_pizzas = req['order_pizzas']
        updated = True
    if 'order_state' in req:
        order.order_state = req['order_state']
        updated = True

    if updated:
        db.session.commit()
        return make_response('Updated', 201)
    else:
        return make_response('Nothing to upgrade', 200)


