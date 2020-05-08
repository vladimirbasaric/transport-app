from app import app
from flask import jsonify, json, Response, make_response, request, session, flash
from models import *
from datetime import datetime
from sqlalchemy import func, and_
from functools import wraps
import sys
import jwt
import datetime


def check_for_token(func):
    @wraps(func)
    def wrapped(*args, **kwargs):
        #token = request.args.get('token')
        print('wrap-SESSION LOGGED IN::' + str(session.get('logged_in'))  , file=sys.stderr)
        auth_header = request.headers.get('Authorization')
        token = auth_header.split(' ')[1]
        if not token:
            return jsonify({'message':  'Missing token'}), 403
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'])
        except:
            return jsonify({'message': 'Invalid token'}), 403
        return func(*args, **kwargs)
    return wrapped 


######################################################### LOGIN  ###################################################
@app.route('/login', methods=['POST'])
def login():
    req_data = request.get_json(force=True)
    username = req_data['username']
    password = req_data['password']

    user = User.query.filter_by(username = username).first()

    #session.pop('logged_in', None)

    if user.username and user.password == password:
        #session['logged_in'] = True
        #session['username'] = username
        #session.modified = True
        print('SESSION LOGGED IN::' + str(session.get('logged_in'))  , file=sys.stderr)
        token = jwt.encode({
            'user': username,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(seconds = 6000)
            },
            app.config['SECRET_KEY'])
        response = jsonify({'token': token.decode('UTF-8'), 'user': user.full_name})
        response.headers.add('Access-Control-Allow-Headers',
                         "Origin, X-Requested-With, Content-Type, Accept, x-auth")
        return response
    else : 
        return make_response('Unable to verify', 403, {'WWW-Authenticate': 'Basic realm: "login required"'})


    #return jsonify({'token':token})

#@app.before_request
#def before_request():
#    print('SESSION LOGGED IN BEFORE REQ::' + str(session.get('logged_in'))  , file=sys.stderr)
#    if 'logged_in' in session:
#        print('fck yeah !!!' + str(session.get('logged_in'))  , file=sys.stderr)



######################################################## DRIVERS ###################################################
@app.route('/all_drivers')
def all_drivers():
    all_drivers = Driver.query.all()
    driver_schema = DriverSchema(many=True)
    output = driver_schema.dump(all_drivers)
    return jsonify(output)

@app.route('/company_drivers')
def company_drivers():
    company_driers = Driver.query.filter_by(company_driver=True)
    driver_schema = DriverSchema(many=True)
    output = driver_schema.dump(company_driers)
    return jsonify(output)


@app.route('/driver', methods=['POST'])
def save_driver():
    req_data = request.get_json(force=True)
    name = req_data['name']
    family_name = req_data['familyName']
    passport_number = req_data['passport_number']
    phone = req_data['phone']
    cmr = req_data['cmr']
    company = req_data['company']

    #print('REQUEST DATA::' + str(name) + ' ' + str(family_name)  , file=sys.stderr)

    driver = Driver(name=name, family_name=family_name, passport_number=passport_number, phone=phone, cmr=cmr, company=company, company_driver=True)
    db.session.add(driver)
    db.session.commit()

    return jsonify(response="OK")

@app.route('/driver/<int:driver_id>', methods=['PUT', 'DELETE'])
def update_or_delete_driver(driver_id):

    if request.method == 'PUT':
        req_data = request.get_json(force=True)
        driver = Driver.query.filter_by(id=driver_id).first()

        driver.name = req_data['name']
        driver.family_name = req_data['familyName']
        driver.passport_number = req_data['passport_number']
        driver.phone = req_data['phone']
        driver.cmr = req_data['cmr']
        driver.company = req_data['company']

        db.session.commit()

    elif request.method == 'DELETE':
        #print('DEL REQUEST', file=sys.stderr)
        Driver.query.filter_by(id=driver_id).delete()
        truck = Truck.query.filter_by(driver_id=driver_id).first()
        if truck is not None:
            truck.driver_id = None
        db.session.commit()

    return jsonify(response="OK")


########################################################### TRUCKS ###############################

@app.route('/all_trucks')
def all_trucks():
    all_trucks = Truck.query.all()
    truck_schema = TruckSchema(many=True)
    output = truck_schema.dump(all_trucks)
    return jsonify(output)

@app.route('/ready_trucks')
def ready_trucks():
    ready_trucks = Truck.query.filter((Truck.trailer_id != None) | (Truck.trailer_id != ''), Truck.company_truck==True)
    truck_schema = TruckSchema(many=True)
    output = truck_schema.dump(ready_trucks)
    return jsonify(output)   

@app.route('/truck', methods=['POST'])
def save_truck():
    req_data = request.get_json(force=True)
    model = req_data['model']
    registration_number = req_data['registration_number']
    #company_truck = req_data['company_truck']

    truck = Truck(model=model, registration_number=registration_number, company_truck=True )
    db.session.add(truck)
    db.session.commit()
    return jsonify(response="OK")


@app.route('/truck/<int:truck_id>', methods=['PUT', 'DELETE'])
def update_or_delete_truck(truck_id):

    if request.method == 'PUT':
        req_data = request.get_json(force=True)
        truck = Truck.query.filter_by(id=truck_id).first()

        truck.model = req_data['model']
        truck.registration_number = req_data['registration_number']
        #truck.company_truck = req_data['company_truck']

        db.session.commit()

    elif request.method == 'DELETE':
        print('DEL REQUEST', file=sys.stderr)
        Truck.query.filter_by(id=truck_id).delete()
        db.session.commit()

    return jsonify(response="OK")


@app.route('/tour/custom/carrier', methods=['POST'])
def save_custom_tour_carrier():
    req_data = request.get_json(force=True)

    client_driver_name = req_data['client_driver_name']
    client_truck_registration_number = req_data['client_truck_registration_number']
    client_trailer_registartion_number = req_data['client_trailer_registartion_number']
    client_truck_ldm = req_data['client_truck_ldm']
    client_truck_weight = req_data['client_truck_weight']
    client_custom_reference = req_data['client_custom_reference']

    driver = Driver(name=client_driver_name, family_name=client_custom_reference, passport_number='/', phone='/', cmr='/', company=client_driver_name, company_driver=False)
    db.session.add(driver)
    db.session.commit()

    if client_trailer_registartion_number == '/':
        client_trailer_registartion_number = str(client_driver_name) + '-' + str(client_custom_reference) +'-' + 'registration_number'

    if client_truck_ldm == '/':
        client_truck_ldm = 0

    if client_truck_weight == '/':
        client_truck_weight = 0

    trailer = Trailer(registration_number=client_trailer_registartion_number, ldm=client_truck_ldm, weight=client_truck_weight, height=0, company_trailer=False)
    db.session.add(trailer)
    db.session.commit()

    if client_truck_registration_number == '/':
        client_truck_registration_number = str(client_driver_name) + '-' + str(client_custom_reference) +'-' + 'registration_number'

    truck_model = str(client_driver_name) + '-' + str(client_custom_reference) + '-' + 'truck'

    truck = Truck(model=truck_model, registration_number=client_truck_registration_number, driver_id=driver.id, trailer_id=trailer.id,company_truck=False)
    db.session.add(truck)
    db.session.commit()

    return jsonify(response="OK")

####################################################### TRAILERS ###############################

@app.route('/all_trailers')
def all_trailers():
    all_trailers = Trailer.query.all()
    trailer_schema = TrailerSchema(many=True)
    output = trailer_schema.dump(all_trailers)
    return jsonify(output)

@app.route('/company_trailers')
def all_company_trailers():
    all_company_trailers = Trailer.query.filter_by(company_trailer=True)
    trailer_schema = TrailerSchema(many=True)
    output = trailer_schema.dump(all_company_trailers)
    return jsonify(output)


@app.route('/trailer', methods=['POST'])
def save_trailer():
    req_data = request.get_json(force=True)
    registration_number = req_data['registration_number']
    ldm = req_data['ldm']
    weight = req_data['weight']
    height = req_data['height']

    trailer = Trailer(registration_number=registration_number, ldm=ldm, weight=weight, height=height, company_trailer=True)
    db.session.add(trailer)
    db.session.commit()
    return jsonify(response="OK")


@app.route('/trailer/<int:trailer_id>', methods=['PUT', 'DELETE'])
def update_or_delete_trailer(trailer_id):

    if request.method == 'PUT':
        req_data = request.get_json(force=True)
        trailer = Trailer.query.filter_by(id=trailer_id).first()

        trailer.registration_number = req_data['registration_number']
        trailer.ldm = req_data['ldm']
        trailer.weight = req_data['weight']
        trailer.height = req_data['height']

        db.session.commit()

    elif request.method == 'DELETE':
        Trailer.query.filter_by(id=trailer_id).delete()
        truck = Truck.query.filter_by(trailer_id=trailer_id).first()
        if truck is not None:
            truck.trailer_id = None
        db.session.commit()

    return jsonify(response="OK")


######################################################## STATES ###############################

@app.route('/all_states')
def all_states():
    all_states = State.query.all()
    state_schema = StateSchema(many=True)
    output = state_schema.dump(all_states)
    return jsonify(output)


######################################################## CITIES ###############################


@app.route('/all_cities')
def all_cities():
    all_cities = City.query.all()
    city_schema = CitySchema(many=True)
    output = city_schema.dump(all_cities)
    return jsonify(output)

@app.route('/cities/<int:state_id>')
def cities_per_state(state_id):
    cities = City.query.filter_by(state_id=state_id)
    city_schema = CitySchema(many=True)
    output = city_schema.dump(cities)
    return jsonify(output)


@app.route('/city/state/<int:state_id>', methods=['POST'])
def save_city(state_id):
    req_data = request.get_json(force=True)
    city_from_req = req_data['city']

    city = City(city=city_from_req, state_id=state_id)
    db.session.add(city)
    db.session.commit()
    return jsonify(response="OK")

@app.route('/city/<int:city_id>', methods=['PUT', 'DELETE'])
def update_or_delete_city(city_id):

    if request.method == 'PUT':
        req_data = request.get_json(force=True)
        city = City.query.filter_by(id=city_id).first()

        city.city = req_data['city']
        db.session.commit()

    elif request.method == 'DELETE':
        City.query.filter_by(id=city_id).delete()
        db.session.commit()

    return jsonify(response="OK")

######################################################## CLIENTS ###############################

@app.route('/all_clients')
@check_for_token
def all_clients():
    #session.modified = True
    #print('SESSION LOGGED IN::' + str(session.get('logged_in'))  , file=sys.stderr)
    #print('SESSION Username ::' + str(session)  , file=sys.stderr)
    #if not session.get('logged_in'):
    #    return jsonify({'message': 'Not logged in'}), 403

    all_clients = Client.query.all()
    client_schema = ClientSchema(many=True)
    output = client_schema.dump(all_clients)
    return jsonify(output)

@app.route('/client/state/<int:state_id>', methods=['POST'])
def save_client(state_id):
    req_data = request.get_json(force=True)
    name_from_req = req_data['name']
    address_from_req = req_data['address']
    pib_from_req = req_data['pib']
    main_id_from_req = req_data['main_id']
    phone_number_from_req = req_data['phone_number']
    email_from_req = req_data['email']
    forwarder = req_data['forwarder']
    additional_contact_from_req = req_data['additional_contact']

    client = Client(name=name_from_req, address=address_from_req, pib=pib_from_req, 
    	main_id=main_id_from_req, phone_number=phone_number_from_req, email=email_from_req, 
        state_id=state_id, forwarder=forwarder, additional_contact=additional_contact_from_req)
    db.session.add(client)
    db.session.commit()
    return jsonify(response="OK")

@app.route('/client/<int:client_id>/state/<int:state_id>', methods=['PUT'])
def update_client(client_id, state_id):

    req_data = request.get_json(force=True)
    client = Client.query.filter_by(id=client_id).first()

    client.name = req_data['name']
    client.address = req_data['address']
    client.pib = req_data['pib']
    client.main_id = req_data['main_id']
    client.phone_number = req_data['phone_number']
    client.email = req_data['email']
    client.state_id = state_id
    client.forwarder = req_data['forwarder']
    client.additional_contact = req_data['additional_contact']
    db.session()
    db.session.commit()

    return jsonify(response="OK")

@app.route('/client/<int:client_id>', methods=['DELETE'])
def delete_client(client_id):

    Client.query.filter_by(id=client_id).delete()
    db.session.commit()

    return jsonify(response="OK")

######################################################## TOURS ##################################
@app.route('/tour/close/<int:tour_id>', methods=['PUT'])
def close_tour(tour_id):

    tour = Tour.query.filter_by(id=tour_id).first()
    tour.closed=True
    db.session.add(tour)
    db.session.commit()

    return jsonify(response="OK")

@app.route('/tour/<int:tour_id>', methods=['delete'])
def delete_tour(tour_id):

    Load.query.filter_by(tour_id=tour_id).delete()
    Tour.query.filter_by(id=tour_id).delete()
    db.session.commit()

    return jsonify(response="OK")


@app.route('/all_tours')
def all_tours():
    #all_tours = Tour.query.all()
    #all_tours = Tour.query.join(Load, Tour.id == Load.tour_id).all()
    # all_tours = db.session.execute('''
    #     SELECT tour.id as tour_id, driver.name as driver_name, driver.family_name as driver_family_name 
    #     FROM tour 
    #     INNER JOIN load ON tour.id = load.tour_id
    #     INNER JOIN driver ON tour.driver_id = driver.id
    #     INNER JOIN truck ON tour.truck_id = truck.id
    #     INNER JOIN trailer ON tour.trailer_id = trailer.id ''')
    # json_data=[]
    # for tour in all_tours:
    #     json_data.append(dict(tour.items()))
    #tour_schema = TourSchema(many=True)
    #output = tour_schema.dump(all_tours)
    #return jsonify({'result':all_tours})
    return json.dumps(json_data)


@app.route('/tour', methods=['POST'])
def save_tour():

    req_data = request.get_json(force=True)
    price = req_data['price']
    weight = req_data['weight']
    ldm = req_data['ldm']
    driver_id = req_data['driver_id']
    truck_id = req_data['truck_id']
    trailer_id = req_data['trailer_id']

    tour = Tour(price=price, weight=weight, ldm=ldm, closed=False ,driver_id=driver_id, truck_id=truck_id, trailer_id=trailer_id)
    db.session.add(tour)
    db.session.commit()    

    last_saved_tour_id = tour.id

    loads = req_data['loads']

    for load in loads:
        pickup_date = load['pickup_date']
        pickup_date = datetime.datetime.strptime(pickup_date, '%Y-%m-%d')

        delivery_date = load['delivery_date']
        delivery_date = datetime.datetime.strptime(delivery_date, '%Y-%m-%d')

        pickup_city = City.query.filter_by(city = load['pickup_city']).first()
        pickup_state = State.query.filter_by(id = pickup_city.state_id).first()
        pickup_flag = pickup_state.flag

        delivery_city = City.query.filter_by(city = load['delivery_city']).first()
        delivery_state = State.query.filter_by(id = delivery_city.state_id).first()
        delivery_flag = delivery_state.flag
        client_ref = load['client_ref']
        #attrs = vars(pickup_city)

        print('REQUEST DATA::' + str(delivery_flag) , file=sys.stderr)

        load_for_storage = Load( goods=load['goods'], ldm=load['ldm'], weight=load['weight'], kolets=load['kolets'], price=load['price'], client_id=load['client_id'], 
            flag1 = pickup_flag, pickup_city=load['pickup_city'],
            zip1=load['zip1'], pickup_date=pickup_date, exporter=load['exporter'], flag2=delivery_flag, delivery_city=load['delivery_city'], zip2=load['zip2'],
            delivery_date=delivery_date, importer=load['importer'], tour_id=last_saved_tour_id, client_ref=client_ref, invoice=False, invoice_number='-')
        db.session.add(load_for_storage)
        
    db.session.commit()    
    return jsonify(response="OK")


@app.route('/tour/driver/delete/<int:driver_id>')
def can_delete_driver(driver_id):
    tour = Tour.query.filter_by(driver_id=driver_id).first()

    if tour is not None :
        return jsonify(response="false")
    return jsonify(response="true")


@app.route('/tour/trailer/delete/<int:trailer_id>')
def can_delete_trailer(trailer_id):
    tour = Tour.query.filter_by(trailer_id=trailer_id).first()

    if tour is not None :
        return jsonify(response="false")
    return jsonify(response="true")


@app.route('/tour/truck/delete/<int:truck_id>')
def can_delete_truck(truck_id):
    tour = Tour.query.filter_by(truck_id=truck_id).first()

    if tour is not None :
        return jsonify(response="false")
    return jsonify(response="true")

@app.route('/tour/<int:tour_id>/driver/<int:driver_id>', methods=['PUT'])
def update_company_tour_driver(tour_id, driver_id):
    tour = Tour.query.filter_by(id=tour_id).first()
    tour.driver_id = driver_id
    db.session.add(tour)
    db.session.commit()    

    return jsonify(response="OK")



# @app.route('/tour/invoice/<int:tour_id>', methods=['PUT'])
# def tour_invoice(tour_id):

#     tour = Tour.query.filter_by(id=tour_id).first()
#     tour.invoice = not tour.invoice

#     db.session.add(tour)
#     db.session.commit()    
#     return jsonify(response="OK")

######################################################## CLIENT-TOURS ##################################

@app.route('/tour/client', methods=['POST'])
def save_client_tour():

    req_data = request.get_json(force=True)
    price = req_data['price']
    weight = req_data['weight']
    ldm = req_data['ldm']
    driver_name = req_data['driver_name']
    client_truck_registration_number = req_data['truck_registration']
    client_trailer_registartion_number = req_data['trailer_registration']

       

    driver = Driver(name=driver_name, family_name='0', passport_number='0', phone='0', cmr='0', company='0', company_driver=False)
    db.session.add(driver)
    db.session.commit()

    truck = Truck(model='0', registration_number=client_truck_registration_number, driver_id=0, trailer_id=0, company_truck=False)
    db.session.add(truck)
    db.session.commit()

    trailer = Trailer(registration_number=client_trailer_registartion_number, ldm=0, weight=0, height=0, company_trailer=False)
    db.session.add(trailer)
    db.session.commit()

    tour = Tour(price=price, weight=weight, ldm=ldm, closed=False ,driver_id=driver.id, truck_id=truck.id, trailer_id=trailer.id)
    db.session.add(tour)
    db.session.commit() 

    last_saved_tour_id = tour.id

    loads = req_data['loads']

    for load in loads:
        pickup_date = load['pickup_date']
        pickup_date = datetime.datetime.strptime(pickup_date, '%Y-%m-%d')

        delivery_date = load['delivery_date']
        delivery_date = datetime.datetime.strptime(delivery_date, '%Y-%m-%d')

        pickup_city = City.query.filter_by(city = load['pickup_city']).first()
        pickup_state = State.query.filter_by(id = pickup_city.state_id).first()
        pickup_flag = pickup_state.flag

        delivery_city = City.query.filter_by(city = load['delivery_city']).first()
        delivery_state = State.query.filter_by(id = delivery_city.state_id).first()
        delivery_flag = delivery_state.flag
        client_ref = load['client_ref']
        #attrs = vars(pickup_city)

        print('REQUEST DATA::' + str(delivery_flag) , file=sys.stderr)

        load_for_storage = Load( goods=load['goods'], ldm=load['ldm'], weight=load['weight'], kolets=load['kolets'], price=load['price'], client_id=load['client_id'], 
            flag1 = pickup_flag, pickup_city=load['pickup_city'],
            zip1=load['zip1'], pickup_date=pickup_date, exporter=load['exporter'], flag2=delivery_flag, delivery_city=load['delivery_city'], zip2=load['zip2'],
            delivery_date=delivery_date, importer=load['importer'], tour_id=last_saved_tour_id, client_ref=client_ref, invoice=False, invoice_number='-')
        db.session.add(load_for_storage)
        
    db.session.commit()    
    return jsonify(response="OK")


@app.route('/tour/trailer/<int:tour_id>')
def get_client_trailer_from_tour(tour_id):
    tour = Tour.query.filter_by(id=tour_id).first()
    #print('DATA::' + str(tour.__dict__) , file=sys.stderr)
    trailer_id = tour.trailer_id

    trailer = Trailer.query.filter_by(id=trailer_id).first()

    trailer_schema = TrailerSchema(many=False)
    output = trailer_schema.dump(trailer)
    return jsonify(output)


@app.route('/tour/client/<int:tour_id>', methods=['PUT'])
def update_client_tour_data(tour_id):

    req_data = request.get_json(force=True)

    driver_name = req_data['driver_name']
    truck_registration = req_data['truck_registration']
    trailer_registration = req_data['trailer_registration']
    trailer_ldm = req_data['trailer_ldm']
    trailer_weight = req_data['trailer_weight']
    trailer_height = req_data['trailer_height']

    print('DATA::' + str(trailer_ldm) + str(trailer_weight) + str(trailer_height) +str(trailer_registration) , file=sys.stderr)

    tour = Tour.query.filter_by(id=tour_id).first()

    driver_id = tour.driver_id
    driver = Driver.query.filter_by(id=driver_id).first()
    driver.name = driver_name
    driver.family_name = '*'
    db.session.add(driver)

    truck_id = tour.truck_id
    truck = Truck.query.filter_by(id=truck_id).first()
    truck.registration_number = truck_registration
    db.session.add(truck)

    trailer_id = tour.trailer_id
    trailer = Trailer.query.filter_by(id=trailer_id).first()
    trailer.registration_number = trailer_registration
    trailer.ldm = trailer_ldm
    trailer.weight = trailer_weight
    trailer.height = trailer_height
    db.session.add(trailer)

    db.session.commit()
    return jsonify(response="OK")



######################################################## LOADS ###############################

@app.route('/all_loads')
@check_for_token
def all_loads():
    #all_loads = Load.query.all()
    all_loads = Load.query.join(Tour, Load.tour_id==Tour.id).filter(Tour.closed==False).group_by(Load.tour_id).having(func.max(Load.delivery_date)).order_by(Load.pickup_date.asc())
    for load in all_loads:

        tour_id = load.tour_id
        load_with_latest_pickup_date = Load.query.filter_by(tour_id=tour_id).group_by(Load.tour_id).having(func.max(Load.pickup_date)).order_by(Load.pickup_date.asc()).first()
        
        load.flag1 = load_with_latest_pickup_date.flag1
        load.pickup_date = load_with_latest_pickup_date.pickup_date
        load.pickup_city = load_with_latest_pickup_date.pickup_city
        load.zip1 = load_with_latest_pickup_date.zip1


    load_schema = LoadSchema(many=True)
    output = load_schema.dump(all_loads)
    return jsonify(output)

@app.route('/all_loads/history/<string:date>')
def all_loads_history(date):

    #pickup_date = load['pickup_date']
    pickup_date = datetime.datetime.strptime(date, '%Y-%m-%d')

    all_loads = Load.query.join(Tour, Load.tour_id==Tour.id).filter(Tour.closed==True).filter(Load.pickup_date > pickup_date).group_by(Load.tour_id).having(func.max(Load.delivery_date)).order_by(Load.pickup_date.asc())
    load_schema = LoadSchema(many=True)
    output = load_schema.dump(all_loads)
    return jsonify(output)


@app.route('/load/<int:tour_id>', methods=['POST'])
def save_load(tour_id):

    req_data = request.get_json(force=True)

    goods = req_data['goods']
    price = req_data['price']
    weight = req_data['weight']
    ldm = req_data['ldm']
    kolets = req_data['kolets']
    zip1 = req_data['zip1']
    zip2 = req_data['zip2']

    client_id = req_data['client_id']

    pickup_date = req_data['pickup_date']
    pickup_date = datetime.datetime.strptime(pickup_date, '%Y-%m-%d')

    delivery_date = req_data['delivery_date']
    delivery_date = datetime.datetime.strptime(delivery_date, '%Y-%m-%d')

    pickup_city = City.query.filter_by(city = req_data['pickup_city']).first()
    pickup_state = State.query.filter_by(id = pickup_city.state_id).first()
    pickup_flag = pickup_state.flag

    delivery_city = City.query.filter_by(city = req_data['delivery_city']).first()
    delivery_state = State.query.filter_by(id = delivery_city.state_id).first()
    delivery_flag = delivery_state.flag

    exporter = req_data['exporter']
    importer = req_data['importer']

    client_ref = req_data['client_ref']

    load_for_storage = Load( goods=goods, ldm=ldm, weight=weight, kolets=kolets, price=price, client_id=client_id, 
            flag1 = pickup_flag, pickup_city=req_data['pickup_city'],
            zip1=zip1, pickup_date=pickup_date, exporter=exporter, flag2=delivery_flag, delivery_city=req_data['delivery_city'], zip2=zip2,
            delivery_date=delivery_date, importer=importer, tour_id=tour_id, client_ref=client_ref, invoice=False, invoice_number='-')
    
    db.session.add(load_for_storage)

    tour = Tour.query.filter_by(id=tour_id).first()
    tour.price = tour.price + price
    tour.weight = tour.weight + weight
    tour.ldm = tour.ldm + ldm

    round(tour.price, 2)
    round(tour.weight, 2)
    round(tour.ldm, 2)

    db.session.add(tour)

    db.session.commit()    
    return jsonify(response="OK")


@app.route('/load/<int:tour_id>', methods=['PUT'])
def delete_load(tour_id):

    req_data = request.get_json(force=True)

    price = req_data['price']
    weight = req_data['weight']
    ldm = req_data['ldm']
    load_id = req_data['id']

    Load.query.filter_by(id=load_id).delete()

    tour = Tour.query.filter_by(id=tour_id).first()
    tour.price = tour.price - price
    tour.weight = tour.weight - weight
    tour.ldm = tour.ldm - ldm

    round(tour.price, 2)
    round(tour.weight, 2)
    round(tour.ldm, 2)

    db.session.add(tour)
    db.session.commit()

    return jsonify(response="OK")

@app.route('/load/update/<int:load_id>', methods=['PUT'])
def update_load(load_id):

    req_data = request.get_json(force=True)
    load = Load.query.filter_by(id=load_id).first()

    tour = Tour.query.filter_by(id=load.tour_id).first()
    tour.price = tour.price - load.price + req_data['price']
    tour.weight = tour.weight - load.weight + req_data['weight']
    tour.ldm = tour.ldm - load.ldm + req_data['ldm']
    round(tour.price, 2)
    round(tour.weight, 2)
    round(tour.ldm, 2)

    load.goods = req_data['goods']
    load.ldm = req_data['ldm']
    load.weight = req_data['weight']
    load.kolets = req_data['kolets']
    load.price = req_data['price']
    load.client_id = req_data['client_name']
    
    pickup_city = City.query.filter_by(id = req_data['pickup_city']).first()
    pickup_state = State.query.filter_by(id = pickup_city.state_id).first()
    pickup_flag = pickup_state.flag
    pickup_date = req_data['pickup_date']
    #pickup_date_array = pickup_date.split('.')
    #pickup_date = pickup_date_array[2] + '-' + pickup_date_array[1] + '-' + pickup_date_array[0]
    pickup_date = datetime.datetime.strptime(pickup_date, '%Y-%m-%d')

    load.pickup_city = pickup_city.city
    load.flag1 = pickup_flag
    load.zip1 = req_data['zip1']
    load.pickup_date = pickup_date
    load.exporter = req_data['exporter']

    delivery_city = City.query.filter_by(id = req_data['delivery_city']).first()
    delivery_state = State.query.filter_by(id = delivery_city.state_id).first()
    delivery_flag = delivery_state.flag
    delivery_date = req_data['delivery_date']
    #delivery_date_array = delivery_date.split('.')
    #delivery_date = delivery_date_array[2] + '-' + delivery_date_array[1] + '-' + delivery_date_array[0]
    delivery_date = datetime.datetime.strptime(delivery_date, '%Y-%m-%d')

    load.delivery_city = delivery_city.city
    load.flag2 = delivery_flag
    load.zip2 = req_data['zip2']
    load.delivery_date = delivery_date
    load.importer = req_data['importer']

    client_ref = req_data['client_ref']
    load.client_ref = client_ref

    db.session.add(load)
    db.session.add(tour)

    db.session.commit()

    return jsonify(response="OK")

@app.route('/loads/<int:tour_id>')
def loads_per_tour(tour_id):
    loads = Load.query.filter_by(tour_id=tour_id).all()
    load_schema = LoadSchema(many=True)
    output = load_schema.dump(loads)
    return jsonify(output)

@app.route('/load/invoice/<int:load_id>', methods=['PUT'])
def save_invoice(load_id):
    req_data = request.get_json(force=True)
    load = Load.query.filter_by(id=load_id).first()
    invoice_number = req_data['invoice_number']

    load.invoice_number = invoice_number
    load.invoice = True

    db.session.add(load)
    db.session.commit()

    return jsonify(response="OK")


@app.route('/load/client/delete/<int:client_id>')
def can_delete_client(client_id):
    load = Load.query.filter_by(client_id=client_id).first()

    if load is not None :
        return jsonify(response="false")
    return jsonify(response="true")


######################################################## RELATIONS ###############################

@app.route('/truck/driver/attach/<int:driver_id>/<int:truck_id>', methods=['POST'])
def attach_driver_to_truck(driver_id, truck_id):

    db.session.execute('UPDATE truck SET driver_id = :val WHERE id = :val1 ', {'val': driver_id, 'val1': truck_id} )
    db.session.commit()
    return jsonify(response="OK")

@app.route('/truck/driver/remove/<int:truck_id>', methods=['POST'])
def remove_driver_from_truck(truck_id):

    db.session.execute('UPDATE truck SET driver_id = :val WHERE id = :val1 ', {'val': '', 'val1': truck_id} )
    db.session.commit()
    return jsonify(response="OK")

@app.route('/truck/trailer/attach/<int:trailer_id>/<int:truck_id>', methods=['POST'])
def attach_trailer_to_truck(trailer_id, truck_id):

    db.session.execute('UPDATE truck SET trailer_id = :val WHERE id = :val1 ', {'val': trailer_id, 'val1': truck_id} )
    db.session.commit()
    return jsonify(response="OK")

@app.route('/truck/trailer/remove/<int:truck_id>', methods=['POST'])
def remove_trailer_from_truck(truck_id):

    db.session.execute('UPDATE truck SET trailer_id = :val WHERE id = :val1 ', {'val': '', 'val1': truck_id} )
    db.session.commit()
    return jsonify(response="OK")
