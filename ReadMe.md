<!-- ## Pizza App 

### Mise en place de l'environnement

Pour installer les dependances
``` pip install -r requirements.txt```

Accès à la page d'administration 
``` http://localhost:5000/admin ```

Lancement du server 
``` python run.py ```

NOTE : Penser a travailler en environnement virtuel avec virtualenv

## API

### Customers
##### Client
   * Commande des pizza
    * Creer un compte
    * Modifie son compte
    * Affiche son compte
##### Admin
   * Liste tous les customers
    * Modifie un compte
    * Affiche un compte

##### Routes
   * /customers
     * GET : Liste les clients (admin)
     * POST : Creer un client
    * /customers/{customer_id}
      * GET : info sur un client
      * PATCH : Modifie un client

### Pizza
  * Lister les pizzas
  * Detail d'une pizza
  * Ajouter une pizza
  * Supprimer une pizza

  * OPT : Lister les elements de la pizza
  * OPT : Creer sa propre pizza
#### Routes
  * /pizzas
    * GET : Liste les pizza
    * POST : Creer une pizza
  * /pizzas/{pizza_id}
    * GET : Detail d'une pizza
    * PATCH : Modifie une pizza
    * DELETE : Supprime une pizza 

### CommandesSorry to say, your presentation even made more sense
  * Qui a effectué la commande ?
  * Passer une commande
  * Valider une commande 
  * Etre averti d'une nouvelle commande
#### Routes
  * /order?[state={state}]
      * GET : Obtient la liste des commandes
      * POST : Creer une commande
  * /order/{order_id}
      * GET : Info sur la commande
      * PATCH : Modifie une commande <-- Permet l'annulation
  * /order
      * ws : Permet d'actualiser la vue admin -->

## Pizza App

#### Technologies used

###### Server-side
 Python with the [micro-framework Flask](http://flask.pocoo.org/)

 List of libraries used : 
 * [flask-cors](http://flask-cors.readthedocs.io/en/latest/)
 * [Flask-SqlAlchemy ](http://flask-sqlalchemy.pocoo.org/2.3/)(DB management)
 * [flask-socketio ](http://flask-socketio.readthedocs.io/en/latest/)(Real time management)
 * [flask-login](https://flask-login.readthedocs.io/en/latest/)

###### Client-side
  [Reactjs](https://reactjs.org/)

  List of libraries used :
  * [react-router-dom](https://reacttraining.com/react-router/web/example/basic)
  * [react-cookies](https://www.npmjs.com/package/react-cookies)
  * [axios ](https://github.com/axios/axios)(HTTP request management)
  * [react-materialize ](https://react-materialize.github.io/#/)(Graphic library)
  * [socket.io-client ](https://www.npmjs.com/package/socket.io-client)(Real time management)

#### Features
  Currently here are the features covered:
For the customers :
- Account creation
- Possibilities to place an order
- To have access and to be able to modify his information
- See the state of his orders

For the administrator:
- Add / Edit / Delete pizza
- Display of orders, and real-time updating of the list upon receipt of a new order.
- Modification of the status of an order: New / In preparation / In delivery / Delivered
- Show and edit Customers list

#### Links
[GitHub](https://github.com/gwenoleR/ADD)
[Live demo](http://pizza.roton.ovh)