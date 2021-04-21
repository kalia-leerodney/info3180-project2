"""
Flask Documentation:     http://flask.pocoo.org/docs/
Jinja2 Documentation:    http://jinja.pocoo.org/2/documentation/
Werkzeug Documentation:  http://werkzeug.pocoo.org/documentation/
This file creates your application.
"""

from flask import Flask  
from app import app, db, login_manager
from flask import render_template, request, redirect, url_for, flash,send_from_directory,jsonify, session, abort
from flask_login import login_user, logout_user, current_user, login_required
from app.forms import LoginForm,RegisterForm,CarForm
from app.models import Users,Cars,Favourites
from app.config import *
from werkzeug.utils import secure_filename
from werkzeug.security import check_password_hash
import datetime


###
# Routing for your application.
###

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
    #if current_user.is_authenticated:

    form = LoginForm()
    if request.method == "POST" and form.validate_on_submit():
        # change this to actually validate the entire form submission
        # and not just one field
        if form.username.data and form.password.data:
            username = form.username.data
            password = form.password.data
            user = Users.query.filter_by(username=username).first()
            if user is not None and check_password_hash(user.password, password):

                login_user(user)
                flash("Login Successful","Success")
                jsonmsg=jsonify(message=" Login Successful",token="token")         
                return jsonmsg  
        else:
            err=form_errors(form)
            for er in err:
                jsonErr=jsonify(errors=err)
            return jsonErr

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
            trans=request.form['transmission']
            desc=request.form['description']
            pic=request.files['pic'] # or form.pic.data
            filename=secure_filename(pic.filename)
            car=Cars(make=make,model=model,colour=colour, year=year, cartype=cartype, transmission=trans,description=desc,photo=filename)
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
