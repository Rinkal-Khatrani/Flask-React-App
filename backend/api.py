import flask
from flask import Flask,jsonify,request,make_response,redirect
from flask_sqlalchemy import SQLAlchemy
from flask_praetorian import Praetorian
from werkzeug.security import generate_password_hash, check_password_hash
import uuid
import jwt
import datetime
from functools import wraps


guard = Praetorian()
app = Flask(__name__)
app.config['SECRET_KEY']='thisisthesecretkey'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///user.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

def token_required(f):
    @wraps(f)
    def decorated(*args,**kwargs):
        token=flask.request.get_json(force=True)
        """ if 'x-access-tokens' in request.headers:
            token = request.headers['x-access-tokens']
            print("decoded",jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"], options={"require": ["exp"]})) """

        if not token:
            return jsonify({'message':'Token is missing!'}),403
        
        try:
            data=jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"], options={"require": ["exp"]})
            
        except:
            return jsonify({'message':'Token is invalid!!','token':token}),403
        return f(*args,**kwargs)
    return decorated


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)    
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), nullable=False)
    firstname = db.Column(db.String(80),nullable=False)
    lastname = db.Column(db.String(80), nullable=False)
    phoneno = db.Column(db.String(80), nullable=False)


    def __repr__(self):
        return f"{self.email}-{self.password}"


@app.route('/welcome',methods=['POST','GET'])
@token_required
def welcome():
    return make_response(jsonify({'message':'Token is valid'}), 201, {'WWW.Authentication': 'Basic realm:"Token is valid"'})    


@app.route('/login',methods=['POST','GET'])
def login():
    req=flask.request.get_json(force=True)
    email=req['email']
    password=req['password']
      

   

    user=User.query.filter_by(email=email).first()
    if user==None:
        return make_response(jsonify({'message':'User Not Found!!'}), 401, {'WWW.Authentication': 'Basic realm: "login required"'})

    
    if check_password_hash(user.password,password):  
        token=jwt.encode({'email':email,'exp':datetime.datetime.utcnow()+datetime.timedelta(minutes=1)},app.config['SECRET_KEY'],algorithm="HS256")
        return make_response(jsonify({'token':token,'exp':5,'userName':user.firstname+' '+user.lastname}), 201, {'WWW.Authentication': 'Basic realm: "login  Successfully!!"'})   
    return make_response(jsonify({'message':'User is Not Authorized!!'}), 401, {'WWW.Authentication': 'Basic realm: "login required"'})    

     
 
@app.route('/registration',methods=['POST','GET'])
def register():
     req = flask.request.get_json(force=True)
     email=req['email']
     password=req['password']
     fname=req['fname']
     lname=req['lname']
     phno=req['phno']    
     hashed_password = generate_password_hash(password, method='sha256')
     user=User.query.filter_by(email=email).first()
     if user!=None and user.email==email:
         return make_response(jsonify({'message':'User Already exist'}), 401,{'WWW.Authentication': 'Basic realm: "already exist"'})
     data=User(email=email,password=hashed_password,firstname=fname,lastname=lname,phoneno=phno)
     db.session.add(data)
     db.session.commit()
     result=User.query.all()
     user=User.query.filter_by(email=email).first()
     token=jwt.encode({'email':email,'exp':datetime.datetime.utcnow()+datetime.timedelta(minutes=1)},app.config['SECRET_KEY'],algorithm="HS256")
     return make_response(jsonify({'message':'Sucessfully inserted','token':token,'userid':user.id,'userName':user.firstname+' '+user.lastname}), 200,{'WWW.Authentication': 'Basic realm: "successfully registered"'})
     
 

if(__name__)=="__main__":
    app.run(debug=True)

