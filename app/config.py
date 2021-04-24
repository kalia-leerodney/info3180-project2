import os

class Config(object):
    """Base Config Object"""
    DEBUG = False
    
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'Som3$ec5etK*y'
    SQLALCHEMY_DATABASE_URI = 'postgresql://mbkdmakofvzswq:b0d1c9a4ef341b0f465c6dd9f18f5cbafdb6cdba9fd69a5b9227be61f58314b5@ec2-34-233-0-64.compute-1.amazonaws.com:5432/d2dr02vn5e3i9j'
    SQLALCHEMY_TRACK_MODIFICATIONS = False # This is just here to suppress a warning from SQLAlchemy as it will soon be removed
    UPLOAD_FOLDER = './app/static/uploads'

class DevelopmentConfig(Config):
    """Development Config that extends the Base Config Object"""
    DEVELOPMENT = True
    DEBUG = True

class ProductionConfig(Config):
    """Production Config that extends the Base Config Object"""
    DEBUG = False