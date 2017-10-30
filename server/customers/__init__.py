from .. import app, db, manager, admin, ModelView
import uuid
import json
from flask import request, make_response

class Customers(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    cid = db.Column(db.String(40), server_default=str(uuid.uuid4()),unique=True, nullable=False)
    customer_name = db.Column(db.String(120), nullable=False)
    customer_lastName = db.Column(db.String(120), nullable=False)
    customer_email = db.Column(db.String(120), unique=True, nullable=False)
    customer_password = db.Column(db.String(255), nullable=False)


    def create(self, customer_name, customer_lastName, customer_email, customer_password):
        self.customer_name = customer_name
        self.customer_lastName = customer_lastName
        self.customer_email = customer_email
        self.customer_password = customer_password
        self.cid = str(uuid.uuid4())

        return self

    def as_dict(self):
        return {'cid' : self.cid, 'customer_name' : self.customer_name, 'customer_lastName' : self.customer_lastName, 'customer_email' : self.customer_email, 'customer_password' : self.customer_password}



manager.create_api(Customers, methods=['GET', 'POST'])

admin.add_view(ModelView(Customers, db.session))

@app.route('/customers', methods=['GET'])
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
        return make_response('Phone is required',401)
    
    customer = Customers()
    customer = customer.create(req['customer_name'],req['customer_lastName'],req['customer_email'],req['customer_password'])
    try:
        db.session.add(customer)
        db.session.commit()
    except:
        return make_response('Insert error', 500)

    return make_response('Created', 201)

@app.route('/customers/<string:cid>', methods=['GET'])
def getCustomerById(cid):
    customer = Customers.query.filter_by(cid = cid).first()

    if customer is None:
        return make_response('Not found', 404)

    resp = make_response(json.dumps(customer.as_dict()), 200)
    return resp

@app.route('/customers/<string:cid>', methods=['PATCH'])
def editCustomerById(cid):
    req = request.get_json()

    customer = Customers.query.filter_by(cid=cid).first()
    if customer is None:
        return make_response('Not found',404)

    updated = False
    if 'customer_name' in req:
        customer.customer_name = req['customer_name']
        updated = True
    if 'customer_lastName' in req:
        customer.customer_lastName = req['customer_name']
        updated = True
    if 'customer_email' in req:
        customer.customer_email = req['customer_email']
        updated = True
    if 'customer_password' in req:
        customer.customer_password = req['customer_password']
        updated = True

    if updated:
        db.session.commit()
        return make_response('Updated', 201)
    else:
        return make_response('Nothing to upgrade', 200)