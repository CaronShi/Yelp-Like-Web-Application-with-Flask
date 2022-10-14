from unicodedata import category
from flask import Flask
from flask import request
from flask import send_from_directory
import flask
import requests
import json
import os
import ipinfo
app = Flask(__name__, static_folder='static')

#run this file in local path: (.venv) PS C:\Users\13412\OneDrive\Documents> py .\main.py 

@app.route("/", methods=["GET","POST"])
def send_html():
    return send_from_directory('static','hw6.html')



@app.route("/submit", methods=["GET","POST"])
def submit_button():
    par_keyword = request.args.get('keywords')
    par_distance = request.args.get('distance') #par_distance = par_distance*1609.344
    par_categories = request.args.get('category')
    gmap_lat = request.args.get('latitude')
    gmap_lng = request.args.get('longitude')
    
    #Yelp API
    #business_id = 'tYGfD_6CQQIb1jsy0KaghQ'
    API_key = 'ZocL2CyGuBKA_oKSXHsf3B9yoBp4bTqT_DWgHEVu-r5_gzrJU5V_J0abxUg-vEhU9ZvgrlWto2Njb4BBwBVuG7qAEMt5jjXecc1epsVUFWyXFT3gc68Sjdg6U3whY3Yx'
    endpoint = 'https://api.yelp.com/v3/businesses/search'
    header = {'Authorization':'bearer %s' % API_key}
    parameters = {'term' : par_keyword, 
                    'radius': par_distance, #/ 1609.344,
                    'latitude': gmap_lat,
                    'longitude': gmap_lng,
                    'categories':par_categories
                }
    reponse = requests.get(url = endpoint, params=parameters, headers = header)
    business_data = reponse.json()
    return business_data
    


@app.route("/detail", methods=["GET","POST"])
def detail_():
    par_id = request.args.get('id')
    
    #Yelp API
    #business_id = 'tYGfD_6CQQIb1jsy0KaghQ'
    API_key = 'ZocL2CyGuBKA_oKSXHsf3B9yoBp4bTqT_DWgHEVu-r5_gzrJU5V_J0abxUg-vEhU9ZvgrlWto2Njb4BBwBVuG7qAEMt5jjXecc1epsVUFWyXFT3gc68Sjdg6U3whY3Yx'
    endpoint = 'https://api.yelp.com/v3/businesses/' + par_id
    header = {'Authorization':'bearer %s' % API_key}
    reponse = requests.get(url = endpoint, headers = header)

    #print('H', reponse.json(), 'W')


    return reponse.json()


    
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')