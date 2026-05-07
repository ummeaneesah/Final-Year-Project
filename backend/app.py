from flask import Flask, jsonify, request
from flask_cors import CORS
from rules import get_supplements_list, get_recommendations

app = Flask(__name__)
CORS(app)

@app.route("/", methods=["GET"])
def home():
    return {"status": "Flask backend running locally"}

@app.route("/supplements", methods=["GET"])
def supplements():
    return jsonify(get_supplements_list())

@app.route("/recommend", methods=["POST"])
def recommend():
    data = request.get_json()
    supplements = data.get("supplements", [])
    return jsonify(get_recommendations(supplements))

print("REGISTERED ROUTES:", app.url_map)
if __name__ == "__main__":
    app.run(debug=True)