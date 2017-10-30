## Pizza App 

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
  * /pizza
    * GET : Liste les pizza
    * POST : Creer une pizza
  * /pizza/{pizza_id}
    * GET : Detail d'une pizza
    * PATCH : Modifie une pizza
    * DELETE : Supprime une pizza 

### Commandes
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
      * ws : Permet d'actualiser la vue admin