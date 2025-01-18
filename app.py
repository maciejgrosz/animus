from flask import Flask, jsonify, request, render_template
import numpy as np
import logging

app = Flask(__name__)

# Setup basic logging
logging.basicConfig(level=logging.INFO)

# Serve the frontend
@app.route('/')
def index():
    return render_template('index.html')

# Serve the frontend
@app.route('/live-animation')
def liveanimation():
    return render_template('live-animation.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)