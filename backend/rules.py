import os
import pandas as pd

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(
    BASE_DIR,
    "data",
    "Vitamin_RuleModel_Output (7)",
    "Vitamin_RuleModel_Output (7).xlsb"
)

# GLOBAL CACHE
_rules_df = None


def load_rules_df():
    global _rules_df
    if _rules_df is None:
        _rules_df = pd.read_excel(DATA_PATH, engine="pyxlsb")
        _rules_df.columns = _rules_df.columns.str.strip().str.lower()
    return _rules_df


def _get_product_column(df):
    """
    Find the correct column that contains supplement names.
    """
    for col in df.columns:
        if "product" in col or "supplement" in col or col == "name":
            return col
    raise ValueError("No product/supplement column found in Excel file")


def get_supplements_list():
    df = load_rules_df()
    product_col = _get_product_column(df)

    names = (
        df[product_col]
        .dropna()
        .astype(str)
        .str.strip()
        .unique()
        .tolist()
    )

    return sorted(names)


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
    product_col = _get_product_column(df)

    matched = df[df[product_col].isin(selected_supplements)]

    results = []
    for _, row in matched.iterrows():
        results.append({
    "product": row[product_col],
    "dose_min": int(row["dose_min"]) if pd.notna(row.get("dose_min")) else None,
    "dose_max": int(row["dose_max"]) if pd.notna(row.get("dose_max")) else None,
    "recommended_time": derive_recommended_time(row),
    "notes": None if pd.isna(row.get("suggested_use_clean")) else str(row.get("suggested_use_clean"))
})
    return results

