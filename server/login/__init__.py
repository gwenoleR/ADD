from .. import app, db, login_manager, flask_login, flask, Connected, Customers    
import json
from functools import wraps
from flask import request, make_response

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
        return None

    return customer

@app.route('/logout')
def logout():
    connect = Connected.query.filter_by(connected_username = request.authorization.username).all()
    for c in connect:
        db.session.delete(c)
    db.session.commit()
    return make_response('log out success', 200)

def check_auth(username, password):
    customer = getCustomerByEmail(username)
    if customer is None:
        return False
    if username == customer.customer_email and password == customer.customer_password:
        connect = Connected()
        connect = connect.create(username)
        if customer.customer_admin :
            connect.connected_isAdmin = True
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
    connect = Connected.query.filter_by(connected_username = request.authorization.username).first()
    if connect.connected_isAdmin:
        return make_response(json.dumps({'username' : request.authorization.username, 'token' : connect.connected_token, 'isAdmin' : True}),200)

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
        if not auth or not check_token(auth.username, auth.password):
            return authenticate()
        return f(*args, **kwargs)
    return decorated

def check_token_admin(username, token):
    connect = Connected.query.filter_by(connected_username = username).filter_by(connected_isActive = True).filter_by(connected_isAdmin = True).first()
    if connect is None:
        return False
    return connect.connected_username == username and connect.connected_token == token
  
def requires_connected_admin(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth = request.authorization
        if not auth or not check_token_admin(auth.username, auth.password):
            return authenticate()
        return f(*args, **kwargs)
    return decorated
