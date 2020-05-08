from app import db, marshmallow

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50))
    password = db.Column(db.String(100))
    full_name = db.Column(db.String(50))


class Driver(db.Model):

    #__tablename__ = "driver"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))
    family_name = db.Column(db.String(50))
    passport_number = db.Column(db.String(50))
    phone = db.Column(db.String(50))
    cmr = db.Column(db.String(50))
    company = db.Column(db.String(50))
    company_driver = db.Column(db.Boolean)


class Truck(db.Model):

    #__tablename__ = "truck"

    id = db.Column(db.Integer, primary_key=True)
    model = db.Column(db.String(50))
    registration_number = db.Column(db.String(50))
    driver_id = db.Column(db.Integer, db.ForeignKey("driver.id"))
    driver = db.relationship("Driver", backref="truck")
    trailer_id = db.Column(db.Integer, db.ForeignKey("trailer.id"))
    trailer = db.relationship("Trailer", backref="truck")
    company_truck = db.Column(db.Boolean)


class Trailer(db.Model):

    id = db.Column(db.Integer, primary_key=True)
    registration_number = db.Column(db.String(50))
    ldm = db.Column(db.Float(precision='4,2'))
    weight = db.Column(db.Float(precision='4,2'))
    height = db.Column(db.Float(precision='4,2'))
    company_trailer = db.Column(db.Boolean)


class State(db.Model):
    
    id = db.Column(db.Integer, primary_key=True)
    state = db.Column(db.String(50))
    flag = db.Column(db.String(50))
    

class City(db.Model):
    
    id = db.Column(db.Integer, primary_key=True)
    city = db.Column(db.String(50))
    state_id = db.Column(db.Integer, db.ForeignKey("state.id"))
    state = db.relationship("State", backref="city")


class Client(db.Model):

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))
    address = db.Column(db.String(100))
    pib = db.Column(db.String(50))
    main_id = db.Column(db.String(50))
    phone_number = db.Column(db.String(50))
    email = db.Column(db.String(50))
    state_id = db.Column(db.Integer, db.ForeignKey("state.id"))
    state = db.relationship("State", backref="Client")
    forwarder = db.Column(db.String(50))
    additional_contact = db.Column(db.String(100))


class Tour(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    price = db.Column(db.Float(precision='5,3'))
    weight = db.Column(db.Float(precision='5,3'))
    ldm = db.Column(db.Float(precision='5,3'))
    closed = db.Column(db.Boolean)
    driver_id = db.Column(db.Integer, db.ForeignKey("driver.id"))
    driver = db.relationship("Driver", backref="tour")
    truck_id = db.Column(db.Integer, db.ForeignKey("truck.id"))
    truck = db.relationship("Truck", backref="tour")
    trailer_id = db.Column(db.Integer, db.ForeignKey("trailer.id"))
    trailer = db.relationship("Trailer", backref="tour")
    
    #loads = db.relationship('Load', backref='tour',
     #                           lazy='dynamic')
    #ldm = db.Column(db.String(50))
    #weight = db.Column(db.String(50))

class Load(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    goods = db.Column(db.String(50))
    ldm = db.Column(db.Float(precision='4,2'))
    weight = db.Column(db.Float(precision='4,2'))
    kolets = db.Column(db.Integer)
    price = db.Column(db.Float(precision='5,3'))
    client_id = db.Column(db.Integer, db.ForeignKey("client.id"))
    client = db.relationship("Client", backref="load")
    #pickup_city_id = db.Column(db.Integer, db.ForeignKey("city.id"))
    flag1 = db.Column(db.String(50))
    pickup_city = db.Column(db.String(50))
    zip1 = db.Column(db.String(50))
    pickup_date = db.Column(db.DateTime)
    exporter = db.Column(db.String(50))
    #delivery_city_id = db.Column(db.Integer, db.ForeignKey("city.id"))
    #delivery_city = db.relationship("City", backref="load")
    flag2 = db.Column(db.String(50))
    delivery_city = db.Column(db.String(50))
    zip2 = db.Column(db.String(50))
    delivery_date = db.Column(db.DateTime)
    importer = db.Column(db.String(50))
    tour_id = db.Column(db.Integer, db.ForeignKey("tour.id"))
    tour = db.relationship("Tour", backref="load")
    client_ref = db.Column(db.String(50))
    invoice = db.Column(db.Boolean)
    invoice_number = db.Column(db.String(50))



class DriverSchema(marshmallow.SQLAlchemyAutoSchema):
    class Meta:
        model = Driver
    

class TrailerSchema(marshmallow.SQLAlchemyAutoSchema):
    class Meta:
        model = Trailer

        
class TruckSchema(marshmallow.SQLAlchemyAutoSchema):
    class Meta:
        model = Truck
    driver = marshmallow.Nested("DriverSchema")
    trailer = marshmallow.Nested("TrailerSchema")


class StateSchema(marshmallow.SQLAlchemyAutoSchema):
    class Meta:
        model = State


class CitySchema(marshmallow.SQLAlchemyAutoSchema):
    class Meta:
        model = City
    state = marshmallow.Nested("StateSchema")

class ClientSchema(marshmallow.SQLAlchemyAutoSchema):
    class Meta:
        model = Client
    state = marshmallow.Nested("StateSchema")

class LoadSchema(marshmallow.SQLAlchemyAutoSchema):
    class Meta:
        model = Load
    tour = marshmallow.Nested("TourSchema")
    client = marshmallow.Nested("ClientSchema")

class TourSchema(marshmallow.SQLAlchemyAutoSchema):
    class Meta:
        model = Tour
    driver = marshmallow.Nested("DriverSchema")
    truck = marshmallow.Nested("TruckSchema")
    trailer = marshmallow.Nested("TrailerSchema")
    #load = marshmallow.Nested("LoadSchema")

db.create_all()