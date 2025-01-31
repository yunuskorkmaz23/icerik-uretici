document.addEventListener('DOMContentLoaded', async () => {
    // API durumunu kontrol et
    try {
        const response = await fetch('/api/status');
        const { apis } = await response.json();
        
        // API seçim alanını güncelle
        const aiModel = document.getElementById('aiModel');
        if (aiModel) {
            // Mevcut olmayan API'leri devre dışı bırak
            Array.from(aiModel.options).forEach(option => {
                if ((option.value.includes('gpt') && !apis.openai) ||
                    (option.value.includes('gemini') && !apis.gemini)) {
                    option.disabled = true;
                    option.text += ' (API anahtarı gerekli)';
                }
            });

            // Kullanılabilir bir API seç
            if (apis.gemini) {
                aiModel.value = 'gemini';
            } else if (apis.openai) {
                aiModel.value = 'gpt4';
            }
        }
    } catch (error) {
        console.error('API durumu kontrol edilemedi:', error);
    }

    // Tooltip'leri aktifleştir
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl, {
            trigger: 'hover'
        });
    });

    // DOM elementlerini seç
    const form = document.getElementById('contentForm');
    const generateHeadingsBtn = document.getElementById('generateHeadings');
    const generateContentBtn = document.getElementById('generateContent');
    const headingsSection = document.getElementById('headingsSection');
    const headingsList = document.getElementById('headingsList');
    const approveHeadingsBtn = document.getElementById('approveHeadings');
    const resultSection = document.getElementById('resultSection');
    const generatedContent = document.getElementById('generatedContent');
    const downloadTxtBtn = document.getElementById('downloadTxt');
    const downloadDocxBtn = document.getElementById('downloadDocx');

    // Element kontrolü
    if (!form || !generateHeadingsBtn || !headingsList) {
        console.error('Gerekli DOM elementleri bulunamadı');
        return;
    }

    let approvedHeadings = [];

    // Form doğrulama
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!form.checkValidity()) {
            e.stopPropagation();
            form.classList.add('was-validated');
            return;
        }
        handleContentGeneration();
    });

    // Alt başlıkları oluştur
    if (generateHeadingsBtn) {
        generateHeadingsBtn.addEventListener('click', async () => {
            const title = document.getElementById('title')?.value;
            const keywords = document.getElementById('keywords')?.value;
            const headingCount = document.getElementById('headingCount')?.value;
            const aiModel = document.getElementById('aiModel')?.value;

            if (!title || !keywords || !headingCount || !aiModel) {
                alert('Lütfen tüm alanları doldurun ve bir AI modeli seçin.');
                return;
            }

            try {
                generateHeadingsBtn.classList.add('loading');
                generateHeadingsBtn.disabled = true;

                const response = await generateHeadings(title, keywords, headingCount, aiModel);
                if (headingsSection) {
                    displayHeadings(response);
                    headingsSection.style.display = 'block';
                }

                generateHeadingsBtn.classList.remove('loading');
                generateHeadingsBtn.disabled = false;

                const headingsAlert = document.getElementById('headingsAlert');
                if (headingsAlert) {
                    headingsAlert.classList.remove('d-none');
                }
            } catch (error) {
                generateHeadingsBtn.classList.remove('loading');
                generateHeadingsBtn.disabled = false;
                alert('Alt başlıklar oluşturulurken bir hata oluştu: ' + error.message);
            }
        });
    }

    // Alt başlıkları görüntüle
    function displayHeadings(headings) {
        headingsList.innerHTML = '';
        
        // Başlıkları listele
        headings.forEach((heading) => {
            const item = document.createElement('div');
            item.className = 'list-group-item d-flex align-items-center gap-2';
            
            // Başlık metnini temizle
            const cleanHeading = heading
                .replace(/^#+\s*/, '')
                .replace(/^["']|["']$/g, '')
                .replace(/^H[0-9]\.?\s*/i, '')
                .trim();
            
            // Başlık metni
            const headingText = document.createElement('div');
            headingText.className = 'flex-grow-1';
            headingText.contentEditable = true;
            headingText.textContent = cleanHeading;
            
            // Düzenlenebilir olduğunu belirten tooltip
            headingText.setAttribute('data-bs-toggle', 'tooltip');
            headingText.setAttribute('data-bs-placement', 'top');
            headingText.setAttribute('title', 'Düzenlemek için tıklayın');
            
            // Kontrol butonları
            const controls = document.createElement('div');
            controls.className = 'd-flex gap-2';
            
            // Düzenle butonu
            const editBtn = document.createElement('button');
            editBtn.className = 'btn btn-sm btn-outline-primary';
            editBtn.innerHTML = '<i class="bi bi-pencil"></i>';
            editBtn.onclick = () => headingText.focus();
            editBtn.setAttribute('data-bs-toggle', 'tooltip');
            editBtn.setAttribute('data-bs-placement', 'top');
            editBtn.setAttribute('title', 'Düzenle');
            
            // Sil butonu
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn btn-sm btn-outline-danger';
            deleteBtn.innerHTML = '<i class="bi bi-trash"></i>';
            deleteBtn.onclick = () => item.remove();
            deleteBtn.setAttribute('data-bs-toggle', 'tooltip');
            deleteBtn.setAttribute('data-bs-placement', 'top');
            deleteBtn.setAttribute('title', 'Sil');
            
            controls.appendChild(editBtn);
            controls.appendChild(deleteBtn);
            item.appendChild(headingText);
            item.appendChild(controls);
            
            item.setAttribute('tabindex', '0');
            headingsList.appendChild(item);
        });

        // Kontrol butonları container'ı
        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'row mt-3';

        // Yeni başlık ekleme butonu
        const addHeadingBtn = document.createElement('button');
        addHeadingBtn.className = 'btn btn-success col-4';
        addHeadingBtn.innerHTML = '<i class="bi bi-plus-lg me-2"></i>Yeni Alt Başlık Ekle';
        addHeadingBtn.onclick = () => {
            const item = document.createElement('div');
            item.className = 'list-group-item d-flex align-items-center gap-2';
            
            const headingText = document.createElement('div');
            headingText.className = 'flex-grow-1';
            headingText.contentEditable = true;
            headingText.textContent = 'Yeni Alt Başlık';
            
            const controls = document.createElement('div');
            controls.className = 'd-flex gap-2';
            
            const editBtn = document.createElement('button');
            editBtn.className = 'btn btn-sm btn-outline-primary';
            editBtn.innerHTML = '<i class="bi bi-pencil"></i>';
            editBtn.onclick = () => headingText.focus();
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn btn-sm btn-outline-danger';
            deleteBtn.innerHTML = '<i class="bi bi-trash"></i>';
            deleteBtn.onclick = () => item.remove();
            
            controls.appendChild(editBtn);
            controls.appendChild(deleteBtn);
            item.appendChild(headingText);
            item.appendChild(controls);
            
            headingsList.appendChild(item);
            headingText.focus();
        };

        // Alt başlıkları onayla butonu
        const approveBtn = document.createElement('button');
        approveBtn.className = 'btn btn-primary col-4';
        approveBtn.innerHTML = '<i class="bi bi-check-circle me-2"></i>Alt Başlıkları Onayla';
        approveBtn.onclick = () => {
            const headings = Array.from(headingsList.children).map(item => {
                const headingText = item.querySelector('.flex-grow-1');
                return headingText.textContent;
            });
            
            // Global değişkene kaydet
            approvedHeadings = headings;
            
            // Success modal'ı göster
            const successModal = new bootstrap.Modal(document.getElementById('successModal'));
            successModal.show();
            
            // Alert'i göster
            document.getElementById('approveAlert').classList.remove('d-none');
        };

        // Yeniden oluştur butonu
        const regenerateBtn = document.createElement('button');
        regenerateBtn.className = 'btn btn-warning col-4';
        regenerateBtn.innerHTML = '<i class="bi bi-arrow-clockwise me-2"></i>Yeniden Oluştur';
        regenerateBtn.onclick = async () => {
            const title = document.getElementById('title')?.value;
            const keywords = document.getElementById('keywords')?.value;
            const headingCount = document.getElementById('headingCount')?.value;
            const aiModel = document.getElementById('aiModel')?.value;

            try {
                regenerateBtn.disabled = true;
                const response = await generateHeadings(title, keywords, headingCount, aiModel);
                displayHeadings(response);
            } catch (error) {
                alert('Alt başlıklar yeniden oluşturulurken bir hata oluştu: ' + error.message);
            } finally {
                regenerateBtn.disabled = false;
            }
        };
        
        // Butonları container'a ekle
        buttonsContainer.appendChild(addHeadingBtn);
        buttonsContainer.appendChild(approveBtn);
        buttonsContainer.appendChild(regenerateBtn);
        
        // Varolan butonları temizle ve yenilerini ekle
        const existingButtons = headingsList.parentElement.querySelectorAll('.btn-warning, .btn-success, .btn-primary');
        existingButtons.forEach(button => button.remove());
        headingsList.parentElement.appendChild(buttonsContainer);
        
        // Tooltip'leri yeniden başlat
        const tooltips = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltips.forEach(el => new bootstrap.Tooltip(el));
    }

    // İçerik istatistiklerini hesapla
    function analyzeContent(content, keywords) {
        // HTML içeriğini geçici bir div'e yerleştir
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = content;
        
        // Kelime sayısı (HTML etiketlerini çıkararak)
        const textContent = tempDiv.textContent || tempDiv.innerText;
        const wordCount = textContent.trim().split(/\s+/).length;
        
        // Başlık sayısı (h2 ve h3)
        const headingMatches = content.match(/<h[23][^>]*>(.*?)<\/h[23]>/g) || [];
        const headingCount = headingMatches.length;
        
        // Paragraf sayısı
        const paragraphMatches = content.match(/<p>(.*?)<\/p>/g) || [];
        const paragraphCount = paragraphMatches.length;
        
        // Anahtar kelime kullanım sayısı
        const keywordList = keywords.split(',').map(k => k.trim().toLowerCase());
        const contentLower = textContent.toLowerCase();
        const keywordCounts = keywordList.reduce((acc, keyword) => {
            const count = (contentLower.match(new RegExp(keyword, 'g')) || []).length;
            acc[keyword] = count;
            return acc;
        }, {});

        // Meta bilgileri
        const metaTitle = content.match(/Meta Title:\s*(.*?)(?=\n|$)/)?.[1] || '';
        const metaDesc = content.match(/Meta Description:\s*(.*?)(?=\n|$)/)?.[1] || '';
        
        return {
            wordCount,
            headingCount,
            paragraphCount,
            keywordCounts,
            meta: {
                title: metaTitle,
                description: metaDesc
            }
        };
    }

    // Seçili içerik öğelerini al
    function getSelectedContentElements() {
        const contentElements = [
            {
                id: 'datatable',
                type: 'datatable',
                label: 'Veri Tablosu',
                description: 'Konuyla ilgili önemli verileri içeren, en az 3 sütun ve 5 satırdan oluşan bir tablo oluştur. Her sütun başlığı açıklayıcı olmalı ve veriler güncel olmalıdır.'
            },
            {
                id: 'statistics',
                type: 'statistics',
                label: 'İstatistikler',
                description: 'Konuyla ilgili en az 5 önemli istatistik bilgiyi listele. Her istatistik için kaynak yılını belirt ve mümkünse karşılaştırmalı veriler kullan.'
            },
            {
                id: 'faq',
                type: 'faq',
                label: 'Sık Sorulan Sorular',
                description: 'Konuyla ilgili en çok merak edilen 5 soruyu belirle ve detaylı cevaplar ver. Her soru "Soru: " ile başlamalı ve her cevap "Cevap: " ile başlamalı.'
            },
            {
                id: 'references',
                type: 'references',
                label: 'Kaynaklar',
                description: 'En az 5 güvenilir kaynak belirt. Her kaynak için yazar adı (varsa), yayın yılı ve başlık bilgilerini içermeli. Kaynaklar akademik yayınlar, resmi raporlar veya güvenilir web siteleri olmalı.'
            },
            {
                id: 'seo',
                type: 'seo',
                label: 'SEO Meta Bilgileri',
                description: 'İçerik için SEO dostu bir meta başlık (60 karakter), meta açıklama (160 karakter) ve 5 anahtar kelime öner. Meta bilgileri hedef kitleye ve arama motorlarına uygun olmalı.'
            },
            {
                id: 'orderedlist',
                type: 'orderedlist',
                label: 'Liste',
                description: 'İçerikte konuyla ilgili başlıklı, numaralandırılmış veya madde işaretli bir liste oluştur. Örnek format:\n\nEn Popüler [Konu] Türleri:\n1. [Tür Adı]\n2. [Tür Adı]\n3. [Tür Adı]\n4. [Tür Adı]\n\nListe en az 4-5 madde içermeli ve her madde kısa bir açıklama ile desteklenebilir.'
            },
            {
                id: 'bulletpoints',
                type: 'bulletpoints',
                label: 'Madde',
                description: 'İçerikte önemli noktaları vurgulayan maddeler kullan. Bu maddeler paragraflar arasına serpiştirilmiş şekilde olmalı. Her madde tek cümlelik önemli bir bilgi içermeli. Örnek:\n• [Ürün/Konu] [özellik] bir yapıya sahiptir.\n• [Avantaj/özellik] sağlar.\n• [Önemli nokta] özelliğine sahiptir.'
            }
        ];
        
        return contentElements.filter(element => 
            document.getElementById(element.id)?.checked
        );
    }

    // İçerik oluştur
    async function handleContentGeneration() {
        if (approvedHeadings.length === 0) {
            alert('Lütfen önce alt başlıkları oluşturun ve onaylayın.');
            return;
        }

        const formData = {
            title: document.getElementById('title').value,
            keywords: document.getElementById('keywords').value,
            headings: approvedHeadings,
            length: document.getElementById('length').value,
            contentElements: getSelectedContentElements(),
            aiModel: document.getElementById('aiModel').value
        };

        try {
            generateContentBtn.classList.add('loading');
            generateContentBtn.disabled = true;

            const content = await generateContent(formData);
            displayContent(content);
            resultSection.style.display = 'block';

            generateContentBtn.classList.remove('loading');
            generateContentBtn.disabled = false;

            document.getElementById('contentAlert').classList.remove('d-none');
        } catch (error) {
            generateContentBtn.classList.remove('loading');
            generateContentBtn.disabled = false;
            alert('İçerik oluşturulurken bir hata oluştu: ' + error.message);
        }
    }

    // İçeriği görüntüle
    function displayContent(content) {
        const keywords = document.getElementById('keywords').value;
        
        // İçeriği temizle
        let cleanContent = content
            .replace(/^#+\s*/gm, '') // ## işaretlerini kaldır
            .replace(/\*\*(.*?)\*\*/g, '$1') // ** işaretlerini kaldır
            .replace(/\*(.*?)\*/g, '$1') // * işaretlerini kaldır
            .trim();
        
        const stats = analyzeContent(cleanContent, keywords);
        
        // Meta verileri ayır
        let mainContent = cleanContent;
        if (cleanContent.includes('Meta Title:')) {
            mainContent = cleanContent.replace(/Meta Title:[\s\S]*?Meta Description:[\s\S]*?\n\n/, '');
        }

        // Sonuç bölümünü göster
        resultSection.style.display = 'block';
        generatedContent.innerHTML = '';

        // İstatistik badge'lerini oluştur
        const statsContainer = document.createElement('div');
        statsContainer.className = 'mb-4 d-flex flex-wrap gap-2';
        statsContainer.innerHTML = `
            <span class="badge bg-primary">
                <i class="bi bi-text-paragraph me-1"></i>
                ${stats.wordCount} Kelime
            </span>
            ${Object.entries(stats.keywordCounts)
                .map(([keyword, count]) => 
                    `<span class="badge bg-secondary">
                        <i class="bi bi-tag me-1"></i>
                        "${keyword}": ${count} kez
                    </span>`
                ).join('')}
        `;

        // İstatistikleri ekle
        generatedContent.appendChild(statsContainer);

        // İçerik container'ı
        const contentContainer = document.createElement('div');
        contentContainer.className = 'content-area border p-3 bg-light';
        contentContainer.innerHTML = mainContent;
        generatedContent.appendChild(contentContainer);

        // FAQ bölümünü düzenle
        const faqContent = mainContent.match(/Sıkça Sorulan Sorular\s*([\s\S]*?)(?=<h2|$)/i);
        if (faqContent && faqContent[1]) {
            const faqSection = document.createElement('div');
            faqSection.className = 'faq-section';
            
            const faqTitle = document.createElement('h2');
            faqTitle.innerHTML = '<i class="bi bi-question-circle me-2"></i>Sıkça Sorulan Sorular';
            faqSection.appendChild(faqTitle);

            const dlElement = document.createElement('dl');
            dlElement.className = 'faq-list';
            
            const questions = faqContent[1].trim().split(/\n\n+/);
            questions.forEach(q => {
                if (q.trim()) {
                    const dt = document.createElement('dt');
                    const dd = document.createElement('dd');
                    const parts = q.split(/\nCevap:\s*/);
                    
                    if (parts.length === 2) {
                        dt.textContent = parts[0].replace(/^Soru:\s*/, '').trim();
                        dd.textContent = parts[1].trim();
                        dlElement.appendChild(dt);
                        dlElement.appendChild(dd);
                    }
                }
            });
            
            if (dlElement.children.length > 0) {
                faqSection.appendChild(dlElement);
                contentContainer.innerHTML = contentContainer.innerHTML.replace(
                    /(<h2[^>]*>Sıkça Sorulan Sorular<\/h2>[\s\S]*?)(?=<h2|$)/i,
                    faqSection.outerHTML
                );
            }
        }
    }

    // TXT olarak indir
    if (downloadTxtBtn) {
        downloadTxtBtn.addEventListener('click', () => {
            const content = generatedContent.textContent;
            const blob = new Blob([content], { type: 'text/plain' });
            downloadFile(blob, 'blog-icerigi.txt');
        });
    }

    // DOCX olarak indir
    if (downloadDocxBtn) {
        downloadDocxBtn.addEventListener('click', async () => {
            const content = generatedContent.textContent;
            try {
                const docxBlob = await convertToDocx(content);
                downloadFile(docxBlob, 'blog-icerigi.docx');
            } catch (error) {
                alert('DOCX dönüşümü sırasında bir hata oluştu: ' + error.message);
            }
        });
    }

    // Dosya indirme işlevi
    function downloadFile(blob, fileName) {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
    }

    // API İstekleri
    async function generateHeadings(title, keywords, headingCount, aiModel) {
        const apiEndpoint = aiModel === 'gemini' ? '/api/generate-headings-gemini' : '/api/generate-headings-gpt4';
        
        try {
            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title,
                    keywords,
                    headingCount,
                    format: 'hierarchical' // API'ye hiyerarşik başlık formatı istediğimizi belirt
                })
            });

            if (!response.ok) {
                throw new Error('API yanıt vermedi');
            }

            const data = await response.json();
            return data.headings; // API'den gelen başlık seviyelerini koru
        } catch (error) {
            console.error('API Hatası:', error);
            throw new Error('Alt başlıklar oluşturulamadı');
        }
    }

    async function generateContent(formData) {
        const apiEndpoint = formData.aiModel === 'gemini' ? '/api/generate-content-gemini' : '/api/generate-content-gpt4';
        
        try {
            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...formData,
                    contentElements: formData.contentElements.map(element => ({
                        ...element,
                        description: element.description
                    }))
                })
            });

            if (!response.ok) {
                throw new Error('API yanıt vermedi');
            }

            const data = await response.json();
            return data.content;
        } catch (error) {
            console.error('API Hatası:', error);
            throw new Error('İçerik oluşturulamadı');
        }
    }

    async function convertToDocx(content) {
        try {
            const response = await fetch('/api/convert-docx', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content })
            });

            if (!response.ok) {
                throw new Error('DOCX dönüşümü başarısız oldu');
            }

            return await response.blob();
        } catch (error) {
            console.error('DOCX Dönüşüm Hatası:', error);
            throw new Error('DOCX dönüşümü başarısız oldu');
        }
    }

    // Liste ve Madde İşareti seçimlerini yönet
    const orderedListCheckbox = document.getElementById('orderedlist');
    const bulletPointsCheckbox = document.getElementById('bulletpoints');

    if (orderedListCheckbox && bulletPointsCheckbox) {
        orderedListCheckbox.addEventListener('change', function() {
            if (this.checked) {
                bulletPointsCheckbox.checked = false;
                bulletPointsCheckbox.disabled = true;
            } else {
                bulletPointsCheckbox.disabled = false;
            }
        });

        bulletPointsCheckbox.addEventListener('change', function() {
            if (this.checked) {
                orderedListCheckbox.checked = false;
                orderedListCheckbox.disabled = true;
            } else {
                orderedListCheckbox.disabled = false;
            }
        });
    }
}); 