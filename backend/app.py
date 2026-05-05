from flask import Flask, request, jsonify
from flask_cors import CORS
from rules import get_recommendations

app = Flask(__name__)
CORS(app)

@app.route("/recommend", methods=["POST"])
def recommend():
    data = request.get_json(silent=True) or {}
    supplements = data.get("supplements", [])

    results = get_recommendations(supplements)
    return jsonify(results)

import os

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
