from flask import Flask, render_template, request, send_file
import pandas as pd
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta
from reportlab.lib.pagesizes import LETTER
from reportlab.pdfgen import canvas
import tempfile
import os

app = Flask(__name__)
app.config["APP_NAME"] = "Supplement Scheduler"
DATA_FILE = "Vitamin_RuleModel_Output (6).csv.gz"

# LOAD DATA
def load_data():
    if not os.path.exists(DATA_FILE):
        raise FileNotFoundError(f"{DATA_FILE} not found")
    return pd.read_csv(DATA_FILE)

df = load_data()

# CYCLE LOGIC
use_cycle = request.form.get("use_cycle") == "yes"

if use_cycle:
    if not request.form.get("cycle_start"):
        return render_template(
            "index.html",
            products=products,
            error="Please select a cycle start date."
        )

    cycle_start = datetime.strptime(
        request.form["cycle_start"], "%Y-%m-%d"
    ).date()

    today = datetime.today().date()

    if not is_on_cycle(cycle_start, today):
        return render_template(
            "index.html",
            products=products,
            error="Today is an OFF-cycle day (30 days on / 7 days off)."
        )

# ROUTES
@app.route("/", methods=["GET", "POST"])
def index():
    products = sorted(df["Product Name"].dropna().unique())

    if request.method == "POST":
        selected = request.form.getlist("products")
        cycle_start = datetime.strptime(
            request.form["cycle_start"], "%Y-%m-%d"
        ).date()

        today = datetime.today().date()
        if not is_on_cycle(cycle_start, today):
            return render_template(
                "index.html",
                products=products,
                error="Today is an OFF‑cycle day (30 on / 7 off)."
            )

        schedule_rows = []
        selected_df = df[df["Product Name"].isin(selected)]

        for idx, row in selected_df.iterrows():
            dose = request.form.get(f"dose_{idx}")
            if not dose:
                continue

            schedule_rows.append({
                "Supplement": row["Product Name"],
                "Dose": dose,
                "Timing": (
                    "Bedtime" if row.get("bedtime")
                    else "Morning" if row.get("morning")
                    else "With meals" if row.get("with_food")
                    else "Anytime"
                ),
                "Instructions": row.get("suggested_use_clean", "")
            })

        return render_template(
            "schedule.html",
            schedule=schedule_rows
        )

    return render_template("index.html", products=products)

# PDF EXPORT
@app.route("/download", methods=["POST"])
def download_pdf():
    schedule = request.form.get("schedule_data")
    rows = eval(schedule)

    temp = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")
    c = canvas.Canvas(temp.name, pagesize=LETTER)

    width, height = LETTER
    y = height - 40

    c.setFont("Helvetica-Bold", 16)
    c.drawString(40, y, "Daily Supplement Schedule")
    y -= 30

    c.setFont("Helvetica", 10)
    for row in rows:
        c.drawString(
            40, y,
            f"{row['Supplement']} – {row['Dose']} ({row['Timing']})"
        )
        y -= 14

        if row["Instructions"]:
            c.setFont("Helvetica-Oblique", 9)
            c.drawString(60, y, row["Instructions"][:90])
            c.setFont("Helvetica", 10)
            y -= 18

        if y < 80:
            c.showPage()
            y = height - 40

    c.save()
    return send_file(temp.name, as_attachment=True)

# ENTRY POINT
if __name__ == "__main__":
    app.run(debug=True)
