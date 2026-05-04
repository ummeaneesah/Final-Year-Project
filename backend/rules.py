import os
import pandas as pd

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

DATA_PATH = os.path.join(
    BASE_DIR,
    "data",
    "Vitamin_RuleModel_Output (7)",
    "Vitamin_RuleModel_Output (7).xlsb"
)

rules_df = pd.read_excel(DATA_PATH, engine="pyxlsb")

def derive_recommended_time(row):
    if pd.notna(row.get("bedtime")) and row["bedtime"]:
        return "bedtime"
    if pd.notna(row.get("evening")) and row["evening"]:
        return "evening"
    if pd.notna(row.get("morning")) and row["morning"]:
        return "morning"
    return "anytime"


def get_recommendations(selected_supplements):
    results = []

    matched = rules_df[
        rules_df["Product Name"].isin(selected_supplements)
    ]

    for _, row in matched.iterrows():
        results.append({
            "product": row["Product Name"],
            "dose_min": int(row["dose_min"]) if pd.notna(row["dose_min"]) else None,
            "dose_max": int(row["dose_max"]) if pd.notna(row["dose_max"]) else None,
            "recommended_time": derive_recommended_time(row),
            "notes": row["suggested_use_clean"] if pd.notna(row["suggested_use_clean"]) else None
        })

    return results
