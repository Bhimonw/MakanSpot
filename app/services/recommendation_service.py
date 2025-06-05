import os
import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
from app.models.models import TempatMakan
from fuzzywuzzy import fuzz, process
from geopy.distance import geodesic
import re

# Path ke file CSV (dari root folder app/)
DATA_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'public', 'storage', 'Form Pengisian Data Tempat Makan (Responses) - Cleaning.csv')

data = pd.read_csv(DATA_PATH)

# Fungsi untuk normalisasi nama tempat
def normalize_name(name):
    if not isinstance(name, str):
        return ""
    # Konversi ke lowercase
    name = name.lower()
    # Hapus karakter khusus dan angka
    name = re.sub(r'[^\w\s]', '', name)
    # Hapus kata-kata umum yang tidak penting
    common_words = ['warung', 'makan', 'rumah', 'rm', 'depot', 'kedai']
    for word in common_words:
        name = name.replace(word, '')
    # Hapus spasi berlebih
    name = re.sub(r'\s+', ' ', name).strip()
    return name

# Tambahkan kolom nama yang dinormalisasi
data['normalized_name'] = data['Nama Tempat'].apply(normalize_name)

# Ekstrak koordinat dari URL maps jika memungkinkan
def extract_coordinates(maps_url):
    try:
        if 'maps.app.goo.gl' in maps_url or 'g.co/kgs' in maps_url:
            return None, None  # Shortened URL, tidak bisa ekstrak koordinat
        
        # Coba ekstrak dari format URL Google Maps
        if '@' in maps_url:
            coords_part = maps_url.split('@')[1].split(',')[:2]
            if len(coords_part) >= 2:
                return float(coords_part[0]), float(coords_part[1])
    except:
        pass
    return None, None

# Tambahkan kolom koordinat
data['lat'], data['lng'] = zip(*data['Lokasi (maps)'].apply(extract_coordinates))

# Fungsi untuk mengelompokkan tempat berdasarkan kesamaan nama dan lokasi
def group_similar_places(df):
    groups = []
    processed_indices = set()
    
    for i, row in df.iterrows():
        if i in processed_indices:
            continue
            
        name = row['normalized_name']
        similar_places = [i]
        processed_indices.add(i)
        
        # Cari tempat dengan nama serupa
        for j, other_row in df.iterrows():
            if j in processed_indices or j == i:
                continue
                
            other_name = other_row['normalized_name']
            # Gunakan fuzzy matching untuk nama
            name_similarity = fuzz.ratio(name, other_name)
            
            # Cek kesamaan lokasi jika koordinat tersedia
            location_match = False
            if (row['lat'] is not None and row['lng'] is not None and 
                other_row['lat'] is not None and other_row['lng'] is not None):
                distance = geodesic(
                    (row['lat'], row['lng']), 
                    (other_row['lat'], other_row['lng'])
                ).kilometers
                location_match = distance < 0.5  # Jika jarak < 500m
            
            # Cek kesamaan URL maps
            maps_match = row['Lokasi (maps)'] == other_row['Lokasi (maps)']
            
            # Gabungkan jika nama sangat mirip atau nama cukup mirip dan lokasi sama
            if name_similarity > 85 or (name_similarity > 70 and (location_match or maps_match)):
                similar_places.append(j)
                processed_indices.add(j)
        
        groups.append(similar_places)
    
    return groups

# Kelompokkan tempat serupa
groups = group_similar_places(data)

# Buat DataFrame baru dengan tempat yang sudah digabungkan
merged_data = []
for group in groups:
    group_data = data.iloc[group]
    
    # Ambil nama tempat yang paling sering muncul dalam grup
    nama_tempat = group_data['Nama Tempat'].mode().iloc[0]
    
    # Rata-ratakan kolom numerik
    harga = group_data['Estimasi Harga (RP.)'].mean()
    rating = group_data['Rating Tempat Makan'].mean()
    jarak = group_data['Jarak dari kampus (km)'].mean()
    
    # Ambil tipe tempat yang paling sering
    tipe_tempat = group_data['Tipe Tempat'].mode().iloc[0]
    
    # Ambil lokasi dari entri pertama
    lokasi = group_data['Lokasi (maps)'].iloc[0]
    
    merged_data.append({
        'Nama Tempat': nama_tempat,
        'Tipe Tempat': tipe_tempat,
        'Estimasi Harga (RP.)': harga,
        'Rating Tempat Makan': rating,
        'Lokasi (maps)': lokasi,
        'Jarak dari kampus (km)': jarak
    })

# Buat DataFrame baru
data = pd.DataFrame(merged_data)

# Konversi tipe data numerik
for col in ['Estimasi Harga (RP.)', 'Rating Tempat Makan', 'Jarak dari kampus (km)']:
    data[col] = pd.to_numeric(data[col], errors='coerce')

# Encode tipe tempat
tipe_map = {'Outdoor': 1, 'Warung': 2, 'Indoor': 3, 'Cafe': 4, 'Mix indoor outdoor dan cafe': 5}
data['Tipe Tempat Encoded'] = data['Tipe Tempat'].map(lambda x: tipe_map.get(x, 0))

# K-Means Clustering
X = data[['Estimasi Harga (RP.)', 'Rating Tempat Makan', 'Jarak dari kampus (km)']]
kmeans = KMeans(n_clusters=3, random_state=42, n_init=10)
data['cluster'] = kmeans.fit_predict(X)

# Evaluasi Silhouette Score
try:
    silhouette = silhouette_score(X, data['cluster'])
except Exception:
    silhouette = None

# Fungsi rekomendasi
# Fungsi rekomendasi
def get_recommendations(price_range, min_rating, max_distance, kategori=None):
    filtered_data = data[
        (data['Estimasi Harga (RP.)'] <= price_range) &
        (data['Rating Tempat Makan'] >= min_rating) &
        (data['Jarak dari kampus (km)'] <= max_distance)
    ]
    
    # Filter berdasarkan kategori jika disediakan
    if kategori:
        filtered_data = filtered_data[filtered_data['Tipe Tempat'].str.lower() == kategori.lower()]
    
    # Urutkan berdasarkan cluster (ekonomis ke menengah ke premium)
    # dan dalam cluster yang sama, urutkan berdasarkan rating (tertinggi dulu)
    filtered_data = filtered_data.sort_values(['cluster', 'Rating Tempat Makan'], ascending=[True, False])
    
    rekomendasi = []
    for _, row in filtered_data.iterrows():
        tempat = TempatMakan(
            nama=row.get('Nama Tempat'),
            harga=row.get('Estimasi Harga (RP.)'),
            rating=row.get('Rating Tempat Makan'),
            jarak=row.get('Jarak dari kampus (km)'),
            kategori=row.get('Tipe Tempat'),
            alamat=row.get('Lokasi (maps)'),
            cluster=int(row.get('cluster', -1))
        )
        rekomendasi.append(tempat)
    return rekomendasi
    
    # Urutkan berdasarkan rating dan jarak
    filtered_data['score'] = filtered_data['Rating Tempat Makan'] - (0.2 * filtered_data['Jarak dari kampus (km)'])
    filtered_data = filtered_data.sort_values('score', ascending=False)
    
    rekomendasi = []
    for _, row in filtered_data.iterrows():
        tempat = TempatMakan(
            nama=row.get('Nama Tempat'),
            harga=row.get('Estimasi Harga (RP.)'),
            rating=row.get('Rating Tempat Makan'),
            jarak=row.get('Jarak dari kampus (km)'),
            kategori=row.get('Tipe Tempat'),
            alamat=row.get('Lokasi (maps)'),
            cluster=int(row.get('cluster', -1))
        )
        rekomendasi.append(tempat)
    return rekomendasi