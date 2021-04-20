from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, TextAreaField,SelectField,DecimalField
from wtforms.validators import InputRequired,Email,DataRequired
from flask_wtf.file import FileField, FileRequired, FileAllowed


class LoginForm(FlaskForm):
    username = StringField('Username', validators=[InputRequired()])
    password = PasswordField('Password', validators=[InputRequired()])
 


class RegisterForm(FlaskForm):
    username = StringField('Username', validators=[InputRequired()])
    password = PasswordField('Password', validators=[InputRequired()])
    fullname = StringField('Fullname', validators=[InputRequired()])
    email = StringField('Email', validators=[DataRequired(), Email()])
    location = StringField('Location', validators=[InputRequired()])
    bio= TextAreaField('Biography', validators=[InputRequired()])
    pic=FileField('Upload Photo',validators=[FileRequired(),FileAllowed(['jpg','png'],'Images only!')])


class CarForm(FlaskForm):
    make = StringField('Make', validators=[InputRequired()])
    model = StringField('Model', validators=[InputRequired()])
    colour = StringField('Colour', validators=[InputRequired()])
    year = StringField('Year', validators=[InputRequired()])
    price = DecimalField('Price',places=2, validators=[InputRequired()])
    cartype=SelectField(u'Car Type' ,choices=[('SUV','SUV'),('Sports Car','Sports Car'),('Sedan','Sedan'),('Coupe','Coupe')])
    transmission=SelectField(u'Transmission' ,choices=[('Automatic','Automatic'),('Manual','Manual')])
    description= TextAreaField('Description', validators=[DataRequired()])
    pic=FileField('Upload Photo',validators=[FileRequired(),FileAllowed(['jpg','png'],'Images only!')])


