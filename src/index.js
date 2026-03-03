#!/usr/bin/env node

const { program } = require('commander');
const express = require('express');
const fs = require('fs');
const path = require('path');

program
  .name('caching-proxy')
  .description('Bir CLI önbellekleme proxy sunucusu')
  .version('1.0.0');

program
  .option('--port <numara>', 'Proxy sunucusunun çalışacağı port')
  .option('--origin <url>', 'İsteklerin iletileceği orijinal sunucu URL\'i')
  .option('--clear-cache', 'Önbelleği temizle');

program.parse(process.argv);

const seçenekler = program.opts();

// Cache dosyasının yolu
const önbellekDosyası = path.join(__dirname, '..', 'cache.json');

// Cache dosyasını oku, yoksa boş obje döndür
function önbellekOku() {
  if (!fs.existsSync(önbellekDosyası)) return {};
  try {
    const içerik = fs.readFileSync(önbellekDosyası, 'utf-8');
    if (!içerik.trim()) return {};
    return JSON.parse(içerik);
  } catch {
    return {};
  }
}

// Cache dosyasına yaz
function önbellekYaz(veri) {
  fs.writeFileSync(önbellekDosyası, JSON.stringify(veri, null, 2));
}

// --clear-cache komutu
if (seçenekler.clearCache) {
  önbellekYaz({});
  console.log('🗑️  Önbellek temizlendi!');
  process.exit(0);
}

// --port ve --origin zorunlu
if (!seçenekler.port || !seçenekler.origin) {
  console.error('❌ Hata: --port ve --origin parametreleri zorunludur.');
  console.error('Kullanım: caching-proxy --port <numara> --origin <url>');
  process.exit(1);
}

const uygulama = express();

uygulama.get('/{*path}', async (istek, yanıt) => {
  const istekPath = istek.path;
  const hedefUrl = `${seçenekler.origin}${istekPath}`;
  const önbellek = önbellekOku();

  if (önbellek[istekPath]) {
    console.log(`✅ Önbellekten döndü: ${istekPath}`);
    const önbellekVerisi = önbellek[istekPath];
    yanıt.setHeader('X-Cache', 'HIT');
    yanıt.setHeader('Content-Type', önbellekVerisi.içerikTipi);
    return yanıt.send(Buffer.from(önbellekVerisi.veri));
  }

  console.log(`🌐 Origin'e istek atıldı: ${hedefUrl}`);
  const originYanıtı = await fetch(hedefUrl);
  const içerikTipi = originYanıtı.headers.get('content-type') || 'application/octet-stream';
  const veri = Buffer.from(await originYanıtı.arrayBuffer());

  // Yeni veriyi cache'e ekle ve dosyaya kaydet
  önbellek[istekPath] = { veri: veri.toJSON(), içerikTipi };
  önbellekYaz(önbellek);
  console.log(`💾 Önbelleğe kaydedildi: ${istekPath}`);

  yanıt.setHeader('X-Cache', 'MISS');
  yanıt.setHeader('Content-Type', içerikTipi);
  yanıt.send(veri);
});

uygulama.listen(seçenekler.port, () => {
  console.log(`🚀 Proxy sunucusu ${seçenekler.port} portunda çalışıyor...`);
  console.log(`🔗 İstekler ${seçenekler.origin} adresine iletilecek`);
});