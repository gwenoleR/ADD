import flask
import flask_sqlalchemy
import flask_restless
import flask_admin
import flask_admin.contrib.sqla
import uuid
import datetime
from flask_cors import CORS
from os import environ
import flask_login

app = flask.Flask(__name__)

app.secret_key = str(uuid.uuid4())

db = environ.get('DB_FILE')

CORS(app)

login_manager = flask_login.LoginManager()

login_manager.init_app(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///'+db
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
db = flask_sqlalchemy.SQLAlchemy(app)

class Pizzas(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    pid = db.Column(db.String(40), server_default=str(uuid.uuid4()),unique=True, nullable=False)
    pizza_name = db.Column(db.String(120), nullable=False)
    pizza_description = db.Column(db.String(800), nullable=False)
    pizza_price = db.Column(db.Float, nullable=False)
    pizza_picture = db.Column(db.String, nullable=True)
    pizza_available = db.Column(db.Boolean)

    def create(self, pizza_name, pizza_description, pizza_price, pizza_picture):
        self.pizza_name = pizza_name
        self.pizza_description = pizza_description
        self.pizza_price = pizza_price
        self.pizza_picture = pizza_picture
        self.pizza_available = True
        self.pid = str(uuid.uuid4())

        return self

    def as_dict(self):
        return {'pid' : self.pid, 'pizza_name' : self.pizza_name, 'pizza_description': self.pizza_description, 'pizza_price' : self.pizza_price, 'pizza_picture' : self.pizza_picture, 'pizza_available' : self.pizza_available}


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


class Customers(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    cid = db.Column(db.String(40), server_default=str(uuid.uuid4()),unique=True, nullable=False)
    customer_name = db.Column(db.String(120), nullable=False)
    customer_lastName = db.Column(db.String(120), nullable=False)
    customer_email = db.Column(db.String(120), unique=True, nullable=False)
    customer_password = db.Column(db.String(255), nullable=False)
    customer_address = db.Column(db.String, nullable=False)
    customer_city = db.Column(db.String, nullable=False)
    customer_zip = db.Column(db.String, nullable=False)
    customer_admin = db.Column(db.Boolean, nullable=False)


    def create(self, customer_name, customer_lastName, customer_email, customer_password,customer_address,customer_city,customer_zip):
        self.customer_name = customer_name
        self.customer_lastName = customer_lastName
        self.customer_email = customer_email
        self.customer_password = customer_password
        self.customer_address = customer_address
        self.customer_city = customer_city
        self.customer_zip = customer_zip
        self.cid = str(uuid.uuid4())
        self.customer_admin = False

        return self

    def as_dict(self):
        return {'cid' : self.cid, 'customer_name' : self.customer_name, 'customer_lastName' : self.customer_lastName, 'customer_email' : self.customer_email, 'customer_password' : self.customer_password, 'customer_address' : self.customer_address, 'customer_city' : self.customer_city, 'customer_zip' : self.customer_zip, 'customer_admin':self.customer_admin}

class Connected(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    connected_username = db.Column(db.String, nullable=False)
    connected_token = db.Column(db.String, nullable=False)
    connected_connection_time = db.Column(db.String, server_default=datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'), nullable=False)
    connected_isActive = db.Column(db.Boolean)
    connected_isAdmin = db.Column(db.Boolean)

    def create(self, connected_username):
        self.connected_username = connected_username
        self.connected_token = str(uuid.uuid4())
        self.connected_connection_time = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        self.connected_isActive = True
        self.connected_isAdmin = False

        return self

    def as_dict(self):
        return {'connected_username' : self.connected_username, 'connected_token' : self.connected_token, 'connected_connection_time' : self.connected_connection_time, 'connected_isActive' : self.connected_isActive,'connected_isAdmin' : self.connected_isAdmin}
