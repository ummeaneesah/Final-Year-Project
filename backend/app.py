from flask import Flask, jsonify, request
from rules import get_recommendations

app = Flask(__name__)

@app.route("/", methods=["GET"])
def home():
    return {"status": "Supplement Scheduler Backend Running"}

@app.route("/supplements", methods=["GET"])
def list_supplements():
    # Example response – adapt as needed
    return jsonify([
        "Vitamin D",
        "Magnesium",
        "Inositol"
    ])

@app.route("/recommend", methods=["POST"])
def recommend():
    data = request.get_json()
    supplements = data.get("supplements", [])
    results = get_recommendations(supplements)
    return jsonify(results)

import os

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
