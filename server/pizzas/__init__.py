from .. import app, db, manager, admin, ModelView, flask_login
import uuid
import json
from flask import request, make_response

class Pizzas(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    pid = db.Column(db.String(40), server_default=str(uuid.uuid4()),unique=True, nullable=False)
    pizza_name = db.Column(db.String(120), nullable=False)
    pizza_description = db.Column(db.String(800), nullable=False)
    pizza_price = db.Column(db.Float, nullable=False)
    pizza_picture = db.Column(db.String(255), nullable=True)
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


manager.create_api(Pizzas, methods=['GET', 'POST'])

admin.add_view(ModelView(Pizzas, db.session))

@app.route('/pizzas', methods=['GET'])
def getPizzas():
    pizzas = []
    for p in Pizzas.query.all():
        pizzas.append(p.as_dict())
    resp = make_response(json.dumps(pizzas), 200)
    return resp


@app.route('/pizzas', methods=['POST'])
def addPizza():
    req = request.get_json()

    if not 'pizza_name' in req or not req['pizza_name']:
        return make_response('pizza_name is required',401)
    if not 'pizza_description' in req or not req['pizza_description']:
        return make_response('pizza_description is required',401)
    if not 'pizza_price' in req or not req['pizza_price']:
        return make_response('pizza_price is required',401)
    if not 'pizza_picture' in req  or not req['pizza_picture']:
        req['pizza_picture'] = ''
    
    pizza = Pizzas()
    pizza = pizza.create(req['pizza_name'],req['pizza_description'],req['pizza_price'],req['pizza_picture'])
    try:
        db.session.add(pizza)
        db.session.commit()
    except:
        return make_response('Insert error', 500)

    return make_response('Created', 201)

@app.route('/pizzas/<string:pid>', methods=['GET'])
def getPizzaById(pid):
    pizza = Pizzas.query.filter_by(pid = pid).first()

    if pizza is None:
        return make_response('Not found', 404)

    resp = make_response(json.dumps(pizza.as_dict()), 200)
    return resp

@app.route('/pizzas/<string:pid>', methods=['PATCH'])
def editPizzaById(pid):
    req = request.get_json()

    pizza = Pizzas.query.filter_by(pid=pid).first()
    if pizza is None:
        return make_response('Not found',404)

    updated = False
    if 'pizza_name' in req:
        pizza.pizza_name = req['pizza_name']
        updated = True
    if 'pizza_description' in req:
        pizza.pizza_description = req['pizza_description']
        updated = True
    if 'pizza_price' in req:
        pizza.pizza_price = req['pizza_price']
        updated = True
    if 'pizza_available' in req:
        pizza.pizza_available = req['pizza_available']
        updated = True
    if 'pizza_picture' in req:
        pizza.pizza_picture = req['pizza_picture']
        updated = True

    if updated:
        db.session.commit()
        return make_response('Updated', 201)
    else:
        return make_response('Nothing to upgrade', 200)

@app.route('/pizzas/<string:pid>', methods=['DELETE'])
def deletePizzaById(pid):
    pizza = Pizzas.query.filter_by(pid = pid).first()

    if pizza is None:
        return make_response('Not found', 404)
    else:
        db.session.delete(pizza)
        db.session.commit()
        return make_response('Deleted', 302)