"""
Flask Documentation:     http://flask.pocoo.org/docs/
Jinja2 Documentation:    http://jinja.pocoo.org/2/documentation/
Werkzeug Documentation:  http://werkzeug.pocoo.org/documentation/
This file creates your application.
"""

from flask import Flask  
from app import app, db, login_manager
from flask import render_template, request, redirect, url_for, flash,send_from_directory,jsonify, session, abort, g, make_response
from flask_login import login_user, logout_user, current_user, login_required
from app.forms import LoginForm,RegisterForm,CarForm
from app.models import Users,Cars,Favourites
from app.config import *
from werkzeug.utils import secure_filename
from werkzeug.security import check_password_hash
import jwt
from flask import _request_ctx_stack
from functools import wraps
import datetime

# Create a JWT @requires_auth decorator
# This decorator can be used to denote that a specific route should check
# for a valid JWT token before displaying the contents of that route.
def requires_auth(f):

    @wraps(f)
    def decorated(*args, **kwargs):
        auth = request.headers.get('Authorization', None) # or request.cookies.get('token', None)

        if not auth:
            return jsonify({'code': 'authorization_header_missing', 'description': 'Authorization header is expected'}), 401

        parts = auth.split()

        if parts[0].lower() != 'bearer':

            return jsonify({'code': 'invalid_header', 'description': 'Authorization header must start with Bearer'}), 401
        elif len(parts) == 1:
            return jsonify({'code': 'invalid_header', 'description': 'Token not found'}), 401
        elif len(parts) > 2:
            return jsonify({'code': 'invalid_header', 'description': 'Authorization header must be Bearer + \s + token'}), 401

        token = parts[1]
        try:
            payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])

        except jwt.ExpiredSignatureError:
            return jsonify({'code': 'token_expired', 'description': 'token is expired'}), 401
        except jwt.DecodeError:
            return jsonify({'code': 'token_invalid_signature', 'description': 'Token signature is invalid'}), 401

        g.current_user = user = payload
        return f(*args, **kwargs)

    return decorated
###
# Routing for your application.
###
@app.route('/api/secure', methods=['GET'])
@requires_auth
def api_secure():
    # This data was retrieved from the payload of the JSON Web Token
    # take a look at the requires_auth decorator code to see how we decoded
    # the information from the JWT.
    user = g.current_user
    return jsonify(data={"user": user}, message="Success")

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def index(path):
    """
    Because we use HTML5 history mode in vue-router we need to configure our
    web server to redirect all routes to index.html. Hence the additional route
    "/<path:path".
    Also we will render the initial webpage and then let VueJS take control.
    """
    return render_template('index.html')

@app.route("/api/auth/login", methods=["POST"])
def login():
    form = LoginForm()
    if request.method == "POST":
        form.username.data = request.form['username']
        form.password.data = request.form['password']
        
        if form.validate_on_submit():
            username = form.username.data
            password = form.password.data
            user = Users.query.filter_by(username=username).first()
            if user is not None and check_password_hash(user.password, password):
                payload = { 'username': user.username,'userid': user.id}
                token = jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256').decode('utf-8')
                jsonmsg=jsonify(message=" Login Successful and Token was Generated",data={"token":token})         
                return jsonmsg 
            else: 
                return jsonify(message="Login Failed") 
        else:
            err=form_errors(form)
            jsonErr=jsonify(errors=err)
            return jsonErr

@app.route('/api/auth/logout', methods=['GET'])
@requires_auth
def logout():
    user = g.current_user
    return jsonify(data={"user": user}, message="Logged Out")


# user_loader callback. This callback is used to reload the user object from
# the user ID stored in the session
@app.route('/api/register', methods=['POST'])
def register():
    # Instantiate your form class
    form=RegisterForm()
    # Validate file upload on submit
    if request.method == 'POST':
        if form.validate_on_submit():
        # Get file data and save to your uploads folder
            username=request.form['username']
            password=request.form['password']
            fullname=request.form['fullname']
            email=request.form['email']
            location=request.form['location']
            bio=request.form['bio']
            pic=request.files['pic'] # or form.pic.data
            filename=secure_filename(pic.filename)
            dt=datetime.datetime.now()
            acc=Users(username=username,password=password,name=fullname, email=email, location=location, biography=bio,photo=filename,date_joined=dt)
            if acc is not None:
                db.session.add(acc)
                db.session.commit()
                pic.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
                jsonmsg=jsonify(message="Successful",username=username,password=password,fullname=fullname, email=email, location=location, biography=bio,photo=filename,date_joined=dt)        
                return jsonmsg
        else:
            err=form_errors(form)
            for er in err:
                jsonErr=jsonify(errors=err)
            return jsonErr

@app.route('/api/cars', methods=['POST'])
def car():
    # Instantiate your form class
    form=CarForm()
    # Validate file upload on submit
    if request.method == 'POST':
        if form.validate_on_submit():
        # Get file data and save to your uploads folder
            make=request.form['make']
            model=request.form['model']
            colour=request.form['colour']
            year=request.form['year']
            price=request.form['price']
            cartype=request.form['cartype']
            #print(cartype)
            trans=request.form['transmission']
            desc=request.form['description']
            pic=request.files['pic'] # or form.pic.data
            filename=secure_filename(pic.filename)
            car=Cars(make=make,model=model,colour=colour, year=year, transmission=trans,car_type=cartype,price=price,description=desc,photo=filename,user_id=1)
            #car=Cars(description=desc, make=make, model=model, colour=colour, year=year, transmission=trans, car_type=cartype, price=price, photo=pic, user_id=current_user.user_id )
            if car is not None:
                db.session.add(car)
                db.session.commit()
                pic.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
                jsonmsg=jsonify(message="Successful")         
                return jsonmsg
        else:
            err=form_errors(form)
            for er in err:
                jsonErr=jsonify(errors=err)
            return jsonErr


@login_manager.user_loader
def load_user(id):
    return Users.query.get(int(id))

###
# The functions below should be applicable to all Flask apps.
###

def form_errors(form):
    error_messages = []
    """Collects form errors"""
    for field, errors in form.errors.items():
        for error in errors:
            message = u"Error in the %s field - %s" % (
                    getattr(form, field).label.text,
                    error
                )
            error_messages.append(message)

    return error_messages

@app.route('/<file_name>.txt')
def send_text_file(file_name):
    """Send your static text file."""
    file_dot_text = file_name + '.txt'
    return app.send_static_file(file_dot_text)


@app.after_request
def add_header(response):
    """
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also to cache the rendered page for 10 minutes.
    """
    response.headers['X-UA-Compatible'] = 'IE=Edge,chrome=1'
    response.headers['Cache-Control'] = 'public, max-age=0'
    return response


@app.errorhandler(404)
def page_not_found(error):
    """Custom 404 page."""
    return render_template('404.html'), 404


if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port="8080")
