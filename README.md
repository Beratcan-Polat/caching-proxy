# Caching Proxy Sunucusu

Bu proje, JavaScript ile yazılmış basit bir önbellekli proxy sunucusu uygulamasıdır. Gelen HTTP isteklerini gerçek sunucuya ileten ve cevapları dosya tabanlı önbellekte saklayan bir CLI aracıdır. Aynı isteğin tekrarlanması durumunda cevap önbellekten döndürülerek daha hızlı yanıt süresi sağlanır.

## Özellikler

1. **Dosya Tabanlı Önbellek:** Cevaplar `cache.json` dosyasında saklanır. Sunucu yeniden başlatılsa bile önbellek korunur.
2. **Proxy Sunucusu:** HTTP sunucusu, kullanıcı adına orijinal sunucuya istek atar ve cevabı önbelleğe kaydeder.
3. **Önbellek Temizleme:** `--clear-cache` komutu ile önbellek istenildiğinde temizlenebilir.

## Kısıtlamalar

1. Yalnızca GET isteklerini desteklemektedir.
2. Minimalist bir tasarıma sahip olduğundan büyük veri setleri için uygun değildir.

## Kullanım

### 1. Repoyu Klonla
```bash
git clone https://github.com/Beratcan-Polat/caching-proxy
cd caching-proxy
```

### 2. Bağımlılıkları Yükle
```bash
npm install
```

### 3. Sunucuyu Başlat
```bash
node src/index.js --port <numara> --origin <url>
```

**Örnek:**
```bash
node src/index.js --port 3000 --origin http://dummyjson.com
```

### 4. İstek At
```bash
curl -i http://localhost:3000/products
```

### 5. Beklenen Çıktılar

İlk istekte — origin sunucusundan gelir:
```
X-Cache: MISS
```

Aynı istek tekrarlandığında — önbellekten döner:
```
X-Cache: HIT
```

### 6. Önbelleği Temizle

Ayrı bir terminalde çalıştır:
```bash
node src/index.js --clear-cache
```

## Proje Yapısı
```
caching-proxy/
├── src/
│   └── index.js    ← ana uygulama kodu
├── .gitignore
├── package.json
└── README.md
```

## Kullanılan Teknolojiler

- **Node.js** — çalışma ortamı
- **Express** — HTTP sunucusu
- **Commander** — CLI argüman yönetimi