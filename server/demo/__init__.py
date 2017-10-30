from .. import app, db, manager, admin, ModelView

class Measurement(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    device_name = db.Column(db.Unicode)
    sensor_name = db.Column(db.Unicode)
    value = db.Column(db.Float)
    time_created = db.Column(db.DateTime(timezone=True), server_default=db.func.now())
    time_updated = db.Column(db.DateTime(timezone=True), onupdate=db.func.now())

manager.create_api(Measurement, methods=['GET', 'POST', 'PUT', 'DELETE'])
print('Measurement')

admin.add_view(ModelView(Measurement, db.session))
