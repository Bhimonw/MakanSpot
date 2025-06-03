from flask import Flask, render_template, request
import pandas as pd

# Membaca data tempat nongkrong
# Pastikan pandas sudah terinstall: pip install pandas
data = pd.read_csv(r'D:\Code\Program\MakanSpot\public\storage\Form Pengisian Data Tempat Makan (Responses) - Cleaning.csv')

# Fungsi untuk memberikan rekomendasi tempat berdasarkan harga, jarak, dan rating
def get_recommendations(price_range, min_rating, max_distance):
    filtered_data = data[
        (data['Estimasi Harga (RP.)'] <= price_range) &
        (data['Rating Tempat Makan'] >= min_rating) &
        (data['Jarak dari kampus (km)'] <= max_distance)
    ]
    return filtered_data

# Membuat aplikasi Flask
app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def index():
    recommendations = None
    if request.method == 'POST':
        price_range = int(request.form['price_range'])
        min_rating = float(request.form['min_rating'])
        max_distance = float(request.form['max_distance'])
        
        # Mendapatkan rekomendasi berdasarkan input pengguna
        recommendations = get_recommendations(price_range, min_rating, max_distance)

    return render_template('index.html', recommendations=recommendations)

if __name__ == '__main__':
    app.run(debug=True)
