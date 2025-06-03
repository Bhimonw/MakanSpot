class TempatMakan:
    def __init__(self, nama, harga, rating, jarak, kategori=None, alamat=None):
        self.nama = nama
        self.harga = harga
        self.rating = rating
        self.jarak = jarak
        self.kategori = kategori
        self.alamat = alamat

    def to_dict(self):
        return {
            'nama': self.nama,
            'harga': self.harga,
            'rating': self.rating,
            'jarak': self.jarak,
            'kategori': self.kategori,
            'alamat': self.alamat
        } 