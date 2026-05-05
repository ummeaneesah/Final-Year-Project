from flask import Flask, jsonify, request
from rules import get_recommendations

app = Flask(__name__)

@app.route("/", methods=["GET"])
def home():
    return {"status": "Supplement Scheduler Backend Running"}

@app.route("/debug-columns")
def debug_columns():
    from rules import load_rules_df
    df = load_rules_df()
    return {
        "columns": list(df.columns),
        "rows": len(df),
        "non_null_product_names": int(df["Product Name"].notna().sum())
    }

@app.route("/supplements", methods=["GET"])
def supplements():
    from rules import get_supplements_list
    return jsonify(get_supplements_list())


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
