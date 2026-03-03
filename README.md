# Caching Proxy CLI

Gelen HTTP isteklerini gerçek sunucuya ileten ve cevapları önbelleğe alan bir CLI proxy aracı.

## Kurulum
```bash
npm install
```

## Kullanım

### Sunucuyu Başlat
```bash
node src/index.js --port <numara> --origin <url>
```

**Örnek:**
```bash
node src/index.js --port 3000 --origin http://dummyjson.com
```

### İstek Yap

Sunucu çalışırken tarayıcıdan veya terminalden istek at:
```
http://localhost:3000/products
```

- İlk istekte `X-Cache: MISS` — origin sunucusundan gelir
- Aynı istek tekrarlanınca `X-Cache: HIT` — önbellekten döner

### Önbelleği Temizle

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

## Teknolojiler

- **Node.js** — çalışma ortamı
- **Express** — HTTP sunucusu
- **Commander** — CLI argüman yönetimi