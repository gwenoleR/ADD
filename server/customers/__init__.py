from .. import app, db, manager, admin, ModelView, Customers
import json
from flask import request, make_response
from server.login import requires_connected, requires_connected_admin



manager.create_api(Customers, methods=['GET', 'POST'])

admin.add_view(ModelView(Customers, db.session))

@app.route('/customers', methods=['GET'])
@requires_connected_admin
def getCustomers():
    customers = []
    for c in Customers.query.all():
        customers.append(c.as_dict())
    resp = make_response(json.dumps(customers), 200)
    return resp


@app.route('/customers', methods=['POST'])
def addcustomer():
    req = request.get_json()

    if not 'customer_name' in req or not req['customer_name']:
        return make_response('Firstname is required',401)
    if not 'customer_lastName' in req or not req['customer_lastName']:
        return make_response('Lastname is required',401)
    if not 'customer_email' in req  or not req['customer_email']:
        return make_response('Email is required',401)
    if not 'customer_password' in req  or not req['customer_password']:
        return make_response('Password is required',401)
    if not 'customer_address' in req  or not req['customer_address']:
        return make_response('customer_address is required',401)
    if not 'customer_city' in req  or not req['customer_city']:
        return make_response('customer_city is required',401)
    if not 'customer_zip' in req  or not req['customer_zip']:
        return make_response('customer_zip is required',401)

    
    
    customer = Customers()
    customer = customer.create(req['customer_name'],req['customer_lastName'],req['customer_email'],req['customer_password'],req['customer_address'], req['customer_city'], req['customer_zip'])
    adminExist = Customers.query.filter_by(customer_admin = True).first()
    if adminExist is None:
        customer.customer_admin = True
    try:
        
        db.session.add(customer)
        db.session.commit()
    except:
        return make_response('Insert error', 500)

    return make_response('Created', 201)

@app.route('/customers/<string:username>', methods=['GET'])
@requires_connected
def getCustomerById(username):
    customer = Customers.query.filter_by(customer_email = username).first()

    if customer is None:
        return make_response('Not found', 404)

    resp = make_response(json.dumps(customer.as_dict()), 200)
    return resp



@app.route('/customers/<string:cid>', methods=['PATCH'])
@requires_connected
def editCustomerById(cid):
    req = request.get_json()

    customer = Customers.query.filter_by(customer_email=cid).first()
    if customer is None:
        return make_response('Not found',404)

    updated = False
    if 'customer_name' in req:
        customer.customer_name = req['customer_name']
        updated = True
    if 'customer_lastName' in req:
        customer.customer_lastName = req['customer_lastName']
        updated = True
    if 'customer_email' in req:
        customer.customer_email = req['customer_email']
        updated = True
    if 'customer_password' in req:
        customer.customer_password = req['customer_password']
        updated = True
    if 'customer_address' in req:
        customer.customer_address = req['customer_address']
        updated = True
    if 'customer_city' in req:
        customer.customer_city = req['customer_city']
        updated = True
    if 'customer_zip' in req:
        customer.customer_zip = req['customer_zip']
        updated = True
    if 'customer_admin' in req:
        customer.customer_admin = req['customer_admin']
        updated = True

    if updated:
        db.session.commit()
        return make_response('Updated', 201)
    else:
        return make_response('Nothing to upgrade', 200)