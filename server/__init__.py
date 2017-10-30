import flask
import flask_sqlalchemy
import flask_restless
import flask_admin
import flask_admin.contrib.sqla
import uuid

app = flask.Flask(__name__)

app.secret_key = str(uuid.uuid4())

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////tmp/test.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
db = flask_sqlalchemy.SQLAlchemy(app)

manager = flask_restless.APIManager(app, flask_sqlalchemy_db=db)

admin = flask_admin.Admin(app, name='Pizza App', template_mode='bootstrap3')

ModelView = flask_admin.contrib.sqla.ModelView