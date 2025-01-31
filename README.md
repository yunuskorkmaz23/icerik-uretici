# 📝 İçerik Üretici

Bu proje, blog yazarları için yapay zeka destekli bir içerik üretme aracıdır. Anahtar kelimelerinizi girdiğinizde, SEO uyumlu blog yazıları otomatik olarak oluşturulur.

## 🚀 Ne İşe Yarar?

- Blog yazılarınızı otomatik olarak oluşturur
- SEO için meta başlıklar ve açıklamalar ekler
- Alt başlıkları otomatik düzenler
- İçerik analizini otomatik yapar (kelime sayısı, anahtar kelime kullanımı vb.)
- Mobil uyumlu arayüz sunar
- İki farklı AI servisi seçeneği sunar (Google Gemini veya OpenAI)

## 💻 Kurulum İçin Gerekenler

### 1. Programlar
Bu projeyi çalıştırmak için aşağıdaki programları kurmanız gerekiyor:

- [📥 Cursor](https://cursor.sh/) 
  * Modern bir kod editörüdür
  * Yapay zeka destekli geliştirme ortamı sunar
  * Ücretsizdir ve kolay kullanılır

- [📥 AMPPS](https://ampps.com/downloads)
  * Yerel sunucu programıdır
  * PHP, MySQL ve Apache içerir
  * Windows, Mac ve Linux için mevcuttur

### 2. Teknik Gereksinimler
- [Node.js](https://nodejs.org/) (Sürüm 18 veya üstü)
- NPM (Node.js ile otomatik gelir) veya [Yarn](https://yarnpkg.com/)

### 3. API Anahtarları
En az bir API anahtarına ihtiyacınız var:

- [Google Gemini API](https://makersuite.google.com/app/apikey) (Önerilen)
  * Ücretsiz hesap açabilirsiniz
  * Aylık belirli bir kotaya kadar ücretsizdir
  * Hızlı ve güvenilirdir

- [OpenAI API](https://platform.openai.com/api-keys) (İsteğe bağlı)
  * Kredi kartı gerektirir
  * Kullanım başına ücretlendirilir
  * GPT-4 modelini kullanır

## 📦 Nasıl Kurulur?

1. Önce bu projeyi bilgisayarınıza indirin:
```bash
# Terminal veya Komut İstemcisini açın
# Projeyi indirin
git clone https://github.com/yunuskorkmazcom/icerik-uretici.git

# Proje klasörüne gidin
cd icerik-uretici

# Gerekli paketleri yükleyin
npm install
```

2. API anahtarlarını ayarlayın:
```bash
# Örnek dosyayı kopyalayın
cp .env.example .env

# .env dosyasını düzenleyin ve API anahtarlarınızı ekleyin:
GEMINI_API_KEY=buraya_gemini_api_anahtarinizi_yazin
OPENAI_API_KEY=buraya_openai_api_anahtarinizi_yazin  # İsteğe bağlı
```

3. Programı çalıştırın:
```bash
# Geliştirme sunucusunu başlatın
npm run dev
```

## 🎯 Nasıl Kullanılır?

1. Tarayıcınızda `http://localhost:3000` adresine gidin
2. Anahtar kelimelerinizi girin (örnek: "dijital pazarlama, sosyal medya")
3. İçerik uzunluğunu seçin (kısa, orta, uzun)
4. Kullanmak istediğiniz AI servisini seçin (Gemini veya OpenAI)
5. "İçerik Oluştur" butonuna tıklayın
6. Oluşturulan içeriği gözden geçirin ve düzenleyin
7. İsterseniz Word veya TXT olarak indirin

## 🛠️ Kullanılan Teknolojiler

- **Node.js**: Sunucu tarafı programlama
- **Express.js**: Web sunucusu
- **Bootstrap**: Mobil uyumlu arayüz
- **Google Gemini API**: Yapay zeka servisi
- **OpenAI API**: Alternatif yapay zeka servisi

## ⚖️ Lisans

Bu proje Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0) lisansı altındadır.

**❗ Önemli Not:** 
- Bu projeyi ticari amaçlarla kullanamazsınız
- Ücretsiz kullanım ve paylaşım için kaynak göstermeniz gerekir
- Değişiklik yapıp paylaşabilirsiniz, ancak yine ticari olmayan amaçlarla

[📜 Detaylı Lisans Bilgisi](https://creativecommons.org/licenses/by-nc/4.0/)

## 📞 Yardım ve İletişim

Sorularınız veya önerileriniz için:
- GitHub: [Yunus Korkmaz](https://github.com/yunuskorkmaz23)
- E-posta: [E-posta adresiniz]

## 🐛 Sorun Bildirme

Bir hata bulduysanız veya öneriniz varsa, lütfen GitHub üzerinden "Issues" bölümünden bildirin.
