import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
import cors from 'cors';

// ES modules için __dirname ve __filename tanımlama
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// .env dosyasını yükle
const result = dotenv.config();
if (result.error) {
    console.error('.env dosyası yüklenemedi:', result.error);
    process.exit(1);
}

// API anahtarlarını kontrol et
const availableAPIs = {
    gemini: Boolean(process.env.GEMINI_API_KEY),
    openai: Boolean(process.env.OPENAI_API_KEY)
};

if (!availableAPIs.gemini && !availableAPIs.openai) {
    console.error('En az bir API anahtarı gerekli. Lütfen .env dosyasını kontrol edin.');
    process.exit(1);
}

console.log('Kullanılabilir API\'ler:', Object.entries(availableAPIs)
    .filter(([_, available]) => available)
    .map(([name]) => name)
    .join(', ')
);

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Ana sayfa
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API durumunu kontrol et
app.get('/api/status', (req, res) => {
    res.json({ apis: availableAPIs });
});

// API rotaları
app.post('/api/generate-headings-gemini', async (req, res) => {
    if (!availableAPIs.gemini) {
        return res.status(400).json({ error: 'Gemini API anahtarı bulunamadı' });
    }

    try {
        const { title, keywords, headingCount } = req.body;
        console.log('Gemini API isteği:', { title, keywords, headingCount });
        
        const { generateHeadingsWithGemini } = await import('./api.js');
        const headings = await generateHeadingsWithGemini(title, keywords, headingCount);
        
        console.log('Gemini API yanıtı:', headings);
        res.json({ headings });
    } catch (error) {
        console.error('Gemini API Hatası:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/generate-headings-gpt4', async (req, res) => {
    if (!availableAPIs.openai) {
        return res.status(400).json({ error: 'OpenAI API anahtarı bulunamadı' });
    }

    try {
        const { title, keywords, headingCount } = req.body;
        const { generateHeadingsWithGPT4 } = await import('./api.js');
        const headings = await generateHeadingsWithGPT4(title, keywords, headingCount);
        res.json({ headings });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/generate-content-gemini', async (req, res) => {
    if (!availableAPIs.gemini) {
        return res.status(400).json({ error: 'Gemini API anahtarı bulunamadı' });
    }

    try {
        const formData = req.body;
        const { generateContentWithGemini } = await import('./api.js');
        const content = await generateContentWithGemini(formData);
        res.json({ content });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/generate-content-gpt4', async (req, res) => {
    if (!availableAPIs.openai) {
        return res.status(400).json({ error: 'OpenAI API anahtarı bulunamadı' });
    }

    try {
        const formData = req.body;
        const { generateContentWithGPT4 } = await import('./api.js');
        const content = await generateContentWithGPT4(formData);
        res.json({ content });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DOCX dönüşümü
app.post('/api/convert-docx', async (req, res) => {
    try {
        const { content } = req.body;
        const { convertToDocx } = await import('./api.js');
        const docxBlob = await convertToDocx(content);
        res.type('application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.send(Buffer.from(await docxBlob.arrayBuffer()));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Sunucuyu başlat
app.listen(port, () => {
    console.log(`Sunucu http://localhost:${port} adresinde çalışıyor`);
}); 