from flask import Flask, json, Response, make_response, request
from flask_cors import CORS
from collections import OrderedDict
from flask_marshmallow import Marshmallow
from flask_sqlalchemy import SQLAlchemy
import sys
from pprint import pprint


app = Flask(__name__)

app.config["SESSION_PERMANENT"] = True
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db/port.db"
app.config['JSON_SORT_KEYS'] = False
app.config['SECRET_KEY'] = "fxinsecret"
#app.secret_key = "fxinsecret"
db = SQLAlchemy(app)
marshmallow = Marshmallow(app)
cors = CORS(app)

from api import *    
if __name__ == '__main__':
    app.run(host='0.0.0.0', port= 5000, debug=True)
