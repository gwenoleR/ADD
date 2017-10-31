import flask
import flask_sqlalchemy
import flask_restless
import flask_admin
import flask_admin.contrib.sqla
import uuid
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

manager = flask_restless.APIManager(app, flask_sqlalchemy_db=db)

admin = flask_admin.Admin(app, name='Pizza App', template_mode='bootstrap3')

ModelView = flask_admin.contrib.sqla.ModelView

