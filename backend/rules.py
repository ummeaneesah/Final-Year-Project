import os
import pandas as pd

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(
    BASE_DIR,
    "data",
    "Vitamin_RuleModel_Output (7)",
    "Vitamin_RuleModel_Output (7).xlsb"
)

# ✅ GLOBAL CACHE
_rules_df = None

def load_rules_df():
    global _rules_df
    if _rules_df is None:
        _rules_df = pd.read_excel(DATA_PATH, engine="pyxlsb")
        _rules_df.columns = _rules_df.columns.str.strip()
    return _rules_df


def get_supplements_list():
    df = load_rules_df()
    return sorted(
        df["Product Name"]
        .dropna()
        .astype(str)
        .str.strip()
        .unique()
        .tolist()
    )


def derive_recommended_time(row):
    if row.get("bedtime"):
        return "bedtime"
    if row.get("evening"):
        return "evening"
    if row.get("morning"):
        return "morning"
    return "anytime"


def get_recommendations(selected_supplements):
    df = load_rules_df()
    matched = df[df["Product Name"].isin(selected_supplements)]

    results = []
    for _, row in matched.iterrows():
        results.append({
            "product": row["Product Name"],
            "dose_min": int(row["dose_min"]) if pd.notna(row.get("dose_min")) else None,
            "dose_max": int(row["dose_max"]) if pd.notna(row.get("dose_max")) else None,
            "recommended_time": derive_recommended_time(row),
            "notes": row.get("suggested_use_clean")
        })
    return results
