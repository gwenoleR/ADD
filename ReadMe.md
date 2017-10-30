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