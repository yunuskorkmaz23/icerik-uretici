// API Anahtarları
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Alt başlık oluşturma promptu
const HEADING_PROMPT = `Verilen başlık ve anahtar kelimeler için SEO uyumlu başlıklar oluştur.

ÖNEMLİ FORMAT KURALLARI:
1. Her başlık yeni bir satırda olmalı
2. Başlıklar sadece şu formatta olabilir:
H2: Başlık Metni
H3: Başlık Metni
H4: Başlık Metni

3. Kesinlikle kullanılmaması gerekenler:
- Yıldız (*)
- Tire (-)
- Bold (**)
- Numaralandırma

HİYERARŞİ KURALLARI:
- H2den sonra H4 gelemez, önce H3 gelmeli
- Her H2 başlığının en az 2 H3 alt başlığı olmalı
- Her H3 başlığının en az 2 H4 alt başlığı olmalı
- Başlıklar mantıksal bir sıra izlemeli
- İçerik piramidi prensibi uygulanmalı (genelden özele)

SEO KURALLARI:
- Başlıklar anahtar kelime açısından optimize edilmeli
- Başlıklar 50-60 karakter uzunluğunda olmalı
- Başlıklar kullanıcı arama niyetine uygun olmalı
- Her başlık benzersiz ve özgün olmalı
- Başlıklar tıklanma oranını artıracak şekilde ilgi çekici olmalı

ÖRNEK ÇIKTI:
H2: SEO Temel Prensipleri
H3: Arama Motorlarının Çalışma Mantığı
H4: Google Algoritması Bileşenleri
H4: Kullanıcı Sinyalleri
H3: SEO Stratejileri
H4: İçerik Optimizasyonu
H4: Teknik SEO Uygulamaları`;

// İçerik oluşturma promptu
const CONTENT_PROMPT = `
Kullanıcının belirttiği kriterlere uygun şekilde SEO uyumlu bir blog içeriği hazırla. İçerik, hedef kitlenin ilgisini çekecek şekilde akıcı ve bilgilendirici olmalı.

İÇERİK FORMATI:
1. Giriş Bölümü:
   - Konuyu kısaca tanıt
   - Okuyucunun ilgisini çekecek bir giriş yap
   - Ana fikri belirt

2. Ana Bölüm:
   - Her H2 başlığı altında konuyu detaylandır
   - H3 ve H4 başlıklarını kullanarak alt konuları açıkla
   - Mantıksal bir akış sağla

SEO GEREKLİLİKLERİ:
- Anahtar kelimeler, içeriğin doğal akışına uygun şekilde yerleştirilmeli, spam algısı yaratmamalı.
- Semantik SEO için LSI (Latent Semantic Indexing) kelimeleri içeriğe entegre edilmeli.
- Başlık (H1) ve alt başlıklar (H2, H3, H4), kullanıcı arama niyetine uygun şekilde yapılandırılmalı.
- Öne çıkan snippet kazanma şansı artırılmalı: Tanımlar, maddeleme veya doğrudan cevaplar içermeli.
- Google NLP (Doğal Dil İşleme) uyumlu, kolay anlaşılabilir ve yapılandırılmış bir içerik oluşturulmalı.

İÇERİK ÖĞELERİ:
Kullanıcının seçimine göre şu öğeler eklenebilir:

1. Veri Tablosu:
Amaç: Karşılaştırmalı veriler veya yapılandırılmış bilgileri sunmak.
- En az 3 sütun ve 5 satırdan oluşan karşılaştırmalı tablo
- Her sütun başlığı açıklayıcı olmalı
- Veriler güncel olmalı

2. İstatistikler:
 Amaç: Güvenilir verilerle içeriği desteklemek.
- En az 5 önemli istatistik bilgi
- Her istatistik için kaynak yılı belirtilmeli
- Mümkünse karşılaştırmalı veriler kullanılmalı

3. Sık Sorulan Sorular:
Amaç: Kullanıcıların en çok merak ettiği sorulara yanıt vermek.
- En çok merak edilen 5 soru ve detaylı cevapları
- Her soru "Soru: " ile başlamalı
- Her cevap "Cevap: " ile başlamalı

4. Kaynaklar:
Amaç: İçeriği destekleyen güvenilir referanslar sunmak.
- En az 5 güvenilir kaynak
- Her kaynak için yazar adı, yayın yılı ve başlık bilgisi
- Akademik yayınlar, resmi raporlar veya güvenilir web siteleri

5. SEO Meta Bilgileri:
 Amaç: İçeriğin arama motorlarında doğru şekilde indekslenmesini sağlamak.
- SEO dostu meta başlık (60 karakter)
- Meta açıklama (160 karakter)
- 5 anahtar kelime önerisi

6. Liste:
 Amaç: İçeriğin okunabilirliğini artırmak.
- Başlıklı, numaralandırılmış veya madde işaretli liste
- En az 4-5 madde içermeli
- Her madde kısa açıklama ile desteklenmeli
Örnek Format:
En Popüler [Konu] Türleri:
1. [Tür Adı]
2. [Tür Adı]
3. [Tür Adı]
4. [Tür Adı]

7. Madde:
 Amaç: İçeriğin içinde kritik bilgileri vurgulamak.
- Paragraflar arasına serpiştirilmiş önemli noktalar
- Her madde tek cümlelik önemli bilgi içermeli
Örnek Format:
• [Ürün/Konu] [özellik] bir yapıya sahiptir.
• [Avantaj/özellik] sağlar.
• [Önemli nokta] özelliğine sahiptir.

NOT: Liste ve Madde seçenekleri aynı anda kullanılamaz, ikisinden biri seçilmelidir.`;

// Gemini API ile alt başlık oluşturma
async function generateHeadingsWithGemini(title, keywords, count) {
    try {
        console.log('Gemini API isteği hazırlanıyor:', {
            title,
            keywords,
            count,
            apiKey: process.env.GEMINI_API_KEY ? 'Mevcut' : 'Eksik'
        });

        const requestBody = {
            contents: [{
                parts: [{
                    text: `${HEADING_PROMPT}\n\nBaşlık: ${title}\nAnahtar Kelimeler: ${keywords}\nİstenen Alt Başlık Sayısı: ${count}`
                }]
            }],
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 1024,
                topP: 1,
                topK: 32
            }
        };

        console.log('Gemini API isteği gönderiliyor...');

        const response = await fetch(`https://generativelanguage.googleapis.com/v2/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        console.log('Gemini API yanıt durumu:', response.status);

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Gemini API Hata Detayları:', errorData);
            throw new Error(errorData.error?.message || 'Gemini API yanıt vermedi');
        }

        const data = await response.json();
        console.log('Gemini API ham yanıt:', JSON.stringify(data, null, 2));
        
        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts) {
            throw new Error('Geçersiz API yanıtı');
        }

        // Yanıtı satırlara böl ve boş satırları filtrele
        const headings = data.candidates[0].content.parts[0].text
            .split('\n')
            .map(line => line.trim())
            .filter(line => line && !line.startsWith('-') && !line.startsWith('*'));

        console.log('İşlenmiş başlıklar:', headings);

        // İstenen sayıda başlık döndür
        const requestedCount = parseInt(count.split('-')[0]);
        return headings.slice(0, requestedCount);
    } catch (error) {
        console.error('Gemini API Hatası:', error);
        throw new Error(error.message || 'Alt başlıklar oluşturulamadı');
    }
}

// OpenAI API ile alt başlık oluşturma
async function generateHeadingsWithGPT4(title, keywords, count) {
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4",
                messages: [{
                    role: "system",
                    content: HEADING_PROMPT
                }, {
                    role: "user",
                    content: `Başlık: ${title}\nAnahtar Kelimeler: ${keywords}\nİstenen Alt Başlık Sayısı: ${count}`
                }],
                temperature: 0.7,
                max_tokens: 500
            })
        });

        if (!response.ok) {
            throw new Error('OpenAI API yanıt vermedi');
        }

        const data = await response.json();
        
        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            throw new Error('Geçersiz API yanıtı');
        }

        // Yanıtı satırlara böl ve başlıkları filtrele
        const headings = data.choices[0].message.content
            .split('\n')
            .filter(line => line.trim().startsWith('## H2.'));

        // İstenen sayıda başlık döndür
        const requestedCount = parseInt(count.split('-')[0]);
        return headings.slice(0, requestedCount);
    } catch (error) {
        console.error('OpenAI API Hatası:', error);
        throw new Error('Alt başlıklar oluşturulamadı');
    }
}

// Gemini API ile içerik oluşturma
async function generateContentWithGemini(formData) {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v2/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `${CONTENT_PROMPT}\n\n${JSON.stringify(formData, null, 2)}`
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 8192,
                    topP: 1,
                    topK: 32
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Gemini API Error:', errorData);
            throw new Error(errorData.error?.message || 'Gemini API yanıt vermedi');
        }

        const data = await response.json();
        
        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts) {
            throw new Error('Geçersiz API yanıtı');
        }

        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error('Gemini API Hatası:', error);
        throw new Error(error.message || 'İçerik oluşturulamadı');
    }
}

// OpenAI API ile içerik oluşturma
async function generateContentWithGPT4(formData) {
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4",
                messages: [{
                    role: "system",
                    content: CONTENT_PROMPT
                }, {
                    role: "user",
                    content: JSON.stringify(formData, null, 2)
                }],
                temperature: 0.7,
                max_tokens: 3500
            })
        });

        if (!response.ok) {
            throw new Error('OpenAI API yanıt vermedi');
        }

        const data = await response.json();
        
        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            throw new Error('Geçersiz API yanıtı');
        }

        return data.choices[0].message.content;
    } catch (error) {
        console.error('OpenAI API Hatası:', error);
        throw new Error('İçerik oluşturulamadı');
    }
}

// DOCX dönüşümü
async function convertToDocx(content) {
    const docx = await import('docx');
    const { Document, Paragraph, TextRun } = docx;

    const doc = new Document({
        sections: [{
            properties: {},
            children: content.split('\n').map(line => 
                new Paragraph({
                    children: [new TextRun(line)]
                })
            )
        }]
    });

    const buffer = await docx.Packer.toBuffer(doc);
    return new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
}

// API fonksiyonlarını dışa aktar
export {
    generateHeadingsWithGemini,
    generateHeadingsWithGPT4,
    generateContentWithGemini,
    generateContentWithGPT4,
    convertToDocx
}; 