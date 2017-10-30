from server import app, db

import server.demo # load it!
# import server.machines
# import server.contacts

db.create_all()

if __name__ == "__main__":
  app.debug = True
  app.run()