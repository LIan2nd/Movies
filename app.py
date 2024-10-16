# Import Package
import os
from os.path import join, dirname
from dotenv import load_dotenv

from http import client
from flask import Flask, render_template, request, jsonify
from pymongo import MongoClient

import requests
from bs4 import BeautifulSoup

# Setup
dotenv_path = join(dirname(__file__), '.env')
load_dotenv(dotenv_path)

MONGODB_URI = os.environ.get("MONGODB_URI")
DB_NAME =  os.environ.get("DB_NAME")

client = MongoClient(MONGODB_URI)

db = client[DB_NAME]
app = Flask(__name__)

@app.route('/')
def home() :
  return render_template('index.html')

@app.route("/movie", methods=["POST"])
def movie_post():
    url = request.form['url']
    star = request.form['star']
    comment = request.form['comment']

    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'}
    data = requests.get(url, headers=headers)

    soup = BeautifulSoup(data.text, 'html.parser')

    og_image = soup.select_one('meta[property="og:image"]')
    og_title = soup.select_one('meta[property="og:title"]')
    og_description = soup.select_one('meta[name="description"]')

    image = og_image['content']
    title = og_title['content']
    desc = og_description['content']

    doc = {
        'image':image,
        'title':title,
        'description':desc,
        'star':star,
        'comment':comment
    }

    db.movies.insert_one(doc)


    return jsonify({'msg':'POST request!'})

@app.route("/movie", methods=["GET"])
def movie_get():
    movie_list = list(db.movies.find({},{'_id':False}))
    return jsonify({'movies':movie_list, "msg": "Mahaooo"})

port=5000
debug=True
if __name__ == "__main__" : 
  app.run('0.0.0.0', port=port, debug=debug)