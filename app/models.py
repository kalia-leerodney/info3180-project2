from . import db
from werkzeug.security import generate_password_hash
from flask_login._compat import unicode


class Cars(db.Model):
    __tablename__ = 'cars'

    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(80))
    make = db.Column(db.String(80))
    model = db.Column(db.String(80))
    colour=db.Column(db.String(255))
    year=db.Column(db.String(255))
    transmission=db.Column(db.String(255))
    car_type=db.Column(db.String(255))
    price=db.Column(db.Float)
    photo=db.Column(db.String(255))
    user_id=db.Column(db.Integer)

    def __init__(self, description, make, model, colour, year, transmission, car_type, price, photo, user_id ):
        self.description = description
        self.make = make
        self.model = model
        self.colour = colour
        self.year= year
        self.transmission=transmission
        self.car_type= car_type
        self.price= price
        self.photo= photo
        self.user_id= user_id

    def get_id(self):
        try:
            return unicode(self.id)  # python 2 support
        except NameError:
            return str(self.id)  # python 3 support



class Users(db.Model):
    # You can use this to change the table name. The default convention is to use
    # the class name. In this case a class name of UserProfile would create a
    # user_profile (singular) table, but if we specify __tablename__ we can change it
    # to `user_profiles` (plural) or some other name.
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80))
    password = db.Column(db.String(80))
    name = db.Column(db.String(80))
    email=db.Column(db.String(255))
    location=db.Column(db.String(255))
    biography=db.Column(db.String(255))
    photo=db.Column(db.String(255))
    date_joined=db.Column(db.DateTime)

    def __init__(self, username, password, name, email, location, biography, photo, date_joined):
        self.username = username
        self.password = generate_password_hash(password, method='pbkdf2:sha256')
        self.name = name
        self.email = email
        self.location= location
        self.biography=biography
        self.photo= photo
        self.date= date_joined


    def is_authenticated(self):
        return True

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def get_id(self):
        try:
            return unicode(self.id)  # python 2 support
        except NameError:
            return str(self.id)  # python 3 support

    def __repr__(self):
        return '<User %r>' % (self.username)


class Favourites(db.Model):
    __tablename__ = 'favourites'

    id = db.Column(db.Integer, primary_key=True)
    car_id = db.Column(db.Integer)
    user_id = db.Column(db.Integer)


    def __init__(self, car_id, user_id ):
        self.car_id= car_id
        self.user_id= user_id

    def get_id(self):
        try:
            return unicode(self.id)  # python 2 support
        except NameError:
            return str(self.id)  # python 3 support