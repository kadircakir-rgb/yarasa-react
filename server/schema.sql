-- Gönüllü başvuruları tablosu
CREATE TABLE IF NOT EXISTS gonulluler (
  id SERIAL PRIMARY KEY,
  ad_soyad VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL,
  telefon VARCHAR(20),
  kurum VARCHAR(200),
  katilim_amaci TEXT[],
  uygun_gunler TEXT[],
  onceki_deneyim BOOLEAN DEFAULT FALSE,
  deneyim_notu TEXT,
  basvuru_tarihi TIMESTAMP DEFAULT NOW()
);

-- Gözlem bildirimleri tablosu
CREATE TABLE IF NOT EXISTS gozlemler (
  id SERIAL PRIMARY KEY,
  tarih DATE NOT NULL,
  saat TIME NOT NULL,
  konum TEXT NOT NULL,
  gozlem_turu VARCHAR(50) NOT NULL,
  aciklama TEXT NOT NULL,
  email VARCHAR(150) NOT NULL,
  fotograf_yolu TEXT,
  ses_yolu TEXT,
  bildirim_tarihi TIMESTAMP DEFAULT NOW()
);
