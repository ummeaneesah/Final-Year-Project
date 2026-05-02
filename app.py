from flask import Flask, request, jsonify
from backend.rules import get_recommendations

app = Flask(__name__)

@app.route("/recommend", methods=["POST"])
def recommend():
    data = request.get_json()
    supplements = data.get("supplements", [])

    results = get_recommendations(supplements)
    return jsonify(results)

if __name__ == "__main__":
    app.run(debug=True)
