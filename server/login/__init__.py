from .. import app, db, manager, admin, ModelView, login_manager, flask_login, flask    
import uuid
import json
import datetime
from functools import wraps
from flask import request, make_response
from server.customers import Customers

class Connected(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    connected_username = db.Column(db.String, nullable=False)
    connected_token = db.Column(db.String, nullable=False)
    connected_connection_time = db.Column(db.String, server_default=datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'), nullable=False)
    connected_isActive = db.Column(db.Boolean)

    def create(self, connected_username):
        self.connected_username = connected_username
        self.connected_token = str(uuid.uuid4())
        self.connected_connection_time = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        self.connected_isActive = True

        return self

    def as_dict(self):
        return {'connected_username' : self.connected_username, 'connected_token' : self.connected_token, 'connected_connection_time' : self.connected_connection_time, 'connected_isActive' : self.connected_isActive}

@app.route('/connected')
def getConnected():
    connected = []
    for c in Connected.query.all():
        connected.append(c.as_dict())
    resp = make_response(json.dumps(connected), 200)
    return resp

def getCustomerByEmail(customer_email):
    customer = Customers.query.filter_by(customer_email = customer_email).first()

    if customer is None:
        return make_response('Not found', 404)

    return customer

def check_auth(username, password):
    print(username)
    customer = getCustomerByEmail(username)
    print(customer.customer_email)
    if username == customer.customer_email and password == customer.customer_password:
        connect = Connected()
        connect = connect.create(username)
        try:
            db.session.add(connect)
            db.session.commit()
        except:
            return make_response('Insert error', 500)
        return True
    return False

def authenticate():
    """Sends a 401 response that enables basic auth"""
    return make_response(
    'Could not verify your access level for that URL.\n'
    'You have to login with proper credentials', 401)
    # ,{'WWW-Authenticate': 'Basic realm="Login Required"'})

def requires_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth = request.authorization
        if not auth or not check_auth(auth.username, auth.password):
            return authenticate()
        return f(*args, **kwargs)
    return decorated

@app.route('/protected')
@requires_auth
def secret_page():
    return make_response('OK',200)

@app.route('/login', methods=['POST'])
@requires_auth
def login():
    print(request.authorization.username)
    connect = Connected.query.filter_by(connected_username = request.authorization.username).first()
    return make_response(json.dumps({'username' : request.authorization.username, 'token' : connect.connected_token}),200)

def check_token(username, token):
    connect = Connected.query.filter_by(connected_username = username).filter_by(connected_isActive = True).first()
    if connect is None:
        return False
    return connect.connected_username == username and connect.connected_token == token
    

def requires_connected(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth = request.authorization
        print(auth)
        if not auth or not check_token(auth.username, auth.password):
            return authenticate()
        return f(*args, **kwargs)
    return decorated
