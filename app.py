from flask import Flask, render_template, request, send_file
import pandas as pd
from datetime import datetime
from reportlab.lib.pagesizes import LETTER
from reportlab.pdfgen import canvas
import tempfile
import os

# APP SETUP
app = Flask(__name__)
app.config["APP_NAME"] = "Supplement Scheduler"

DATA_FILE = "Vitamin_RuleModel_Output (6).csv.gz"

# LOAD DATA
# This function loads the supplement data from a CSV file. It checks if the file exists and raises an error if it doesn't.
def load_data():
    if not os.path.exists(DATA_FILE):
        raise FileNotFoundError(f"{DATA_FILE} not found")
    return pd.read_csv(DATA_FILE)

df = load_data()

# CYCLE LOGIC HELPER
# This function determines if the current date falls within the "on" cycle based on a 37-day cycle (30 days on, 7 days off) starting from a given date.
def is_on_cycle(start_date, check_date):
    delta = (check_date - start_date).days
    return (delta % 37) < 30   # 30 days on / 7 days off

# MAIN ROUTE
# This route handles both GET and POST requests. On GET, it displays the product selection form. On POST, it processes the selected products, applies optional cycle logic, and generates a schedule to be displayed on the next page.
@app.route("/", methods=["GET", "POST"])
def index():
    products = sorted(df["Product Name"].dropna().unique())

    if request.method == "POST":
        selected = request.form.getlist("products")
        use_cycle = request.form.get("use_cycle") == "yes"

        # OPTIONAL CYCLE LOGIC 
        # If the user opts to use cycle logic, we check if they provided a cycle start date. We then determine if today is an "on" day or an "off" day based on the 37-day cycle. If it's an "off" day, we show an error message and do not generate the schedule.
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

        # BUILD SCHEDULE 
        # We create a list of schedule rows based on the selected products. For each selected product, we retrieve the dose from the form and determine the timing (bedtime or anytime) based on the product's attributes. We also include any suggested use instructions.
        schedule_rows = []
        selected_df = df[df["Product Name"].isin(selected)]

        for idx, row in selected_df.iterrows():
            dose = request.form.get(f"dose_{idx}")
            if not dose:
                continue

            schedule_rows.append({
                "Supplement": row["Product Name"],
                "Dose": dose,
                "Timing": "Bedtime" if row.get("bedtime") else "Anytime",
                "Instructions": row.get("suggested_use_clean", "")
            })

        return render_template("schedule.html", schedule=schedule_rows)

    # GET request (page load)
    # We simply render the index page with the list of products for selection.
    return render_template("index.html", products=products)

# PDF EXPORT
# This route handles the generation of a PDF file based on the schedule data submitted from the schedule page. It creates a temporary PDF file, writes the schedule information to it using ReportLab, and then sends the file to the user for download.
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
# This is the entry point of the application. When the script is run directly, it starts the Flask development server with debug mode enabled.
if __name__ == "__main__":
    app.run(debug=True)
