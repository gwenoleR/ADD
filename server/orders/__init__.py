from .. import app, db, manager, admin, ModelView, Orders
import json
from flask import request, make_response
from server.login import requires_connected, requires_connected_admin

manager.create_api(Orders, methods=['GET', 'POST'])

admin.add_view(ModelView(Orders, db.session))

@app.route('/orders', methods=['GET'])
@requires_connected_admin
def getOrders():
    orders = []
    for o in Orders.query.all():
        orders.append(o.as_dict())
    resp = make_response(json.dumps(orders), 200)
    return resp

@app.route('/orders', methods=['POST'])
@requires_connected
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
@requires_connected
def getOrdersById(oid):
    order = Orders.query.filter_by(oid = oid).first()

    if order is None:
        return make_response('Not found', 404)

    resp = make_response(json.dumps(order.as_dict()), 200)
    return resp

@app.route('/orders/user/<string:username>', methods=['GET'])
@requires_connected
def getOrdersByUsername(username):
    order_query = Orders.query.filter_by(customer_username = username).all()
    orders = []
    if order_query is None:
        return make_response('Not found', 404)
    for o in order_query:
        orders.append(o.as_dict())

    resp = make_response(json.dumps(orders), 200)
    return resp


@app.route('/orders/<string:oid>', methods=['PATCH'])
@requires_connected
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


