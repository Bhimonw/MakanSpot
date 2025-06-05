class TempatMakan:
    def __init__(self, nama, harga, rating, jarak, kategori=None, alamat=None, cluster=None):
        self.nama = nama
        self.harga = harga
        self.rating = rating
        self.jarak = jarak
        self.kategori = kategori
        self.alamat = alamat
        self.cluster = cluster
        self.silhouette_score = None  # Add cluster quality metric
        self.cluster_center_distance = None  # Distance to cluster center
    
    def to_dict(self):
        return {
            'nama': self.nama,
            'harga': self.harga,
            'rating': self.rating,
            'jarak': self.jarak,
            'kategori': self.kategori,
            'alamat': self.alamat,
            'cluster': self.cluster,
            'cluster_label': self.get_cluster_label()  # Tambahkan cluster_label ke dictionary
        }
    
    def get_cluster_label(self):
        """Return human-readable cluster label"""
        cluster_labels = {0: 'Value-Oriented', 1: 'Balanced-Choice', 2: 'Premium-Experience'}
        return cluster_labels.get(self.cluster, 'Unknown')