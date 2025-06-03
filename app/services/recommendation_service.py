import pandas as pd
import os
from app.models.models import TempatMakan

# Path ke file CSV (dari root folder app/)
DATA_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'public', 'storage', 'Form Pengisian Data Tempat Makan (Responses) - Cleaning.csv')

data = pd.read_csv(DATA_PATH)
# Hapus duplikat berdasarkan Nama Tempat dan Lokasi (maps)
data = data.drop_duplicates(subset=['Nama Tempat', 'Lokasi (maps)'])

def get_recommendations(price_range, min_rating, max_distance):
    filtered_data = data[
        (data['Estimasi Harga (RP.)'] <= price_range) &
        (data['Rating Tempat Makan'] >= min_rating) &
        (data['Jarak dari kampus (km)'] <= max_distance)
    ]
    rekomendasi = []
    for _, row in filtered_data.iterrows():
        tempat = TempatMakan(
            nama=row.get('Nama Tempat'),
            harga=row.get('Estimasi Harga (RP.)'),
            rating=row.get('Rating Tempat Makan'),
            jarak=row.get('Jarak dari kampus (km)'),
            kategori=row.get('Tipe Tempat'),
            alamat=row.get('Lokasi (maps)')
        )
        rekomendasi.append(tempat)
    return rekomendasi 