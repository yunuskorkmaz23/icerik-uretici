# İçerik Üretici

Blog yazıları için otomatik içerik üretme aracı. Bu araç, verilen anahtar kelimeler ve başlıklar doğrultusunda SEO uyumlu blog içerikleri oluşturur.

## Gereksinimler

- Node.js >= 18.0.0
- NPM veya Yarn
- En az bir API anahtarı:
  - Google Gemini API anahtarı
  - OpenAI API anahtarı (opsiyonel)

## Özellikler

- Anahtar kelime odaklı içerik üretimi
- SEO meta başlıkları ve açıklamaları
- Alt başlık önerileri
- İçerik analizi (kelime sayısı, başlık sayısı)
- Responsive tasarım
- Kolay kullanımlı arayüz
- Esnek API kullanımı (Gemini veya GPT-4)

## Kurulum

```bash
# Repository'yi klonlayın
git clone https://github.com/yunuskorkmazcom/icerik-uretici.git

# Proje dizinine gidin
cd icerik-uretici

# Bağımlılıkları yükleyin
npm install

# .env dosyasını oluşturun
cp .env.example .env

# .env dosyasını düzenleyip en az bir API anahtarı ekleyin
# GEMINI_API_KEY=your_gemini_api_key_here
# OPENAI_API_KEY=your_openai_api_key_here (opsiyonel)

# Geliştirme sunucusunu başlatın
npm run dev
```

## API Anahtarları

Bu projeyi çalıştırmak için en az bir API anahtarına ihtiyacınız var:

1. **Google Gemini API** (Önerilen): [Google AI Studio](https://makersuite.google.com/app/apikey)'dan alabilirsiniz
2. **OpenAI API** (Opsiyonel): [OpenAI Platform](https://platform.openai.com/api-keys)'dan alabilirsiniz

API anahtarlarını aldıktan sonra `.env` dosyasına eklemeniz gerekiyor. En az bir API anahtarı gereklidir, ancak her ikisini de kullanabilirsiniz.

## Kullanım

1. Anahtar kelimeleri girin
2. İçerik uzunluğunu seçin
3. Kullanılabilir API'lerden birini seçin
4. "İçerik Oluştur" butonuna tıklayın
5. Oluşturulan içeriği düzenleyin
6. Alt başlıkları yönetin
7. İçeriği dışa aktarın

## Teknolojiler

- Node.js
- Express.js
- Bootstrap
- Google Gemini API
- OpenAI API (opsiyonel)

## Lisans

Bu çalışma, Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0) lisansı altında lisanslanmıştır.

**Önemli Not:** Ticari kullanım yasaktır.

Daha fazla bilgi için: [Creative Commons Lisans Açıklaması](https://creativecommons.org/licenses/by-nc/4.0/)

## İletişim

Yunus Korkmaz - [GitHub](https://github.com/yunuskorkmaz23)
