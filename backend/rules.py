import pandas as pd
import os

# Load Excel once (IMPORTANT: don't reload for every request)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(BASE_DIR, "data", "")

df = pd.read_excel(DATA_PATH)

def get_recommendations(selected_supplements):
    """
    selected_supplements: list of supplement names from frontend
    """

    results = []

    for supplement in selected_supplements:
        match = df[df["Product Name"].str.contains(supplement, case=False, na=False)]

        if match.empty:
            continue

        for _, row in match.iterrows():
            results.append({
                "product": row["Product Name"],
                "recommended_time": row.get("recommended_time", "anytime"),
                "with_food": bool(row.get("with_food", False)),
                "frequency_per_day": row.get("frequency_per_day"),
                "dose_min": row.get("dose_min"),
                "dose_max": row.get("dose_max"),
                "notes": row.get("suggested_use_clean")
            })

    return results
``
