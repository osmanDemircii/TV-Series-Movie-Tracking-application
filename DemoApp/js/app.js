//App.js

import { addContent, deleteContent, getData, updateContent, filterContent, platforms } from "./storage.js"
import { render, clearFilmForm, clearDiziForm, setFilmFormForEdit, setDiziFormForEdit, toggleForms, updatePlatformSelects } from "./ui.js";

const initializeApp = () => {
    // Ana liste elemanı
    const contentList = document.querySelector('#content-list');
    
    // Form toggle butonları
    const toggleFilmBtn = document.querySelector('#toggle-film-btn');
    const toggleDiziBtn = document.querySelector('#toggle-dizi-btn');
    
    // Film formu elemanları
    const filmInput = document.querySelector('#film-input');
    const filmWatchedCheckbox = document.querySelector('#_checkbox-26');
    const filmPuanInput = document.querySelector('#puan-input');
    const filmAciklaInput = document.getElementById("film-Acikla");
    const filmPlatformSelect = document.getElementById("film-platform");
    const platformLinkInput = document.querySelector('#film-platform-link');
    const addFilmBtn = document.querySelector('#add-button');
    
    // Dizi formu elemanları
    const diziInput = document.querySelector('#dizi-input');
    const diziWatchedCheckbox = document.querySelector('#_checkbox-dizi');
    const diziPuanInput = document.querySelector('#dizi-puan-input');
    const diziAciklaInput = document.getElementById("dizi-Acikla");
    const diziPlatformSelect = document.getElementById("dizi-platform");
    const diziPlatformLinkInput = document.querySelector('#dizi-platform-link');
    const sezonInput = document.querySelector('#sezon-input');
    const bolumInput = document.querySelector('#bolum-input');
    const addDiziBtn = document.querySelector('#add-dizi-button');
    
    // Filtreleme ve arama elemanları
    const filterAllBtn = document.querySelector('#filter-all');
    const filterFilmBtn = document.querySelector('#filter-film');
    const filterDiziBtn = document.querySelector('#filter-dizi');
    const searchInput = document.querySelector('#search-input');


    // Düzenleme modu için değişkenler
    let editMode = false;
    let editIndex = -1;
    let editType = null;
    
    // Filtreleme için değişkenler
    let currentFilter = null; // null=tümü, "film"=filmler, "dizi"=diziler
    let currentSearch = "";

    // Platform seçimlerini güncelleyin
    updatePlatformSelects();

    // Başlangıçta tüm içeriği göster
    render(getData("contents") || [], contentList);

    // Film izlendi checkbox'ı değişikliği
    filmWatchedCheckbox.addEventListener("change", () => {
        filmPuanInput.disabled = !filmWatchedCheckbox.checked;
        filmAciklaInput.disabled = !filmWatchedCheckbox.checked;
    });
    
    // Dizi izlendi checkbox'ı değişikliği
    diziWatchedCheckbox.addEventListener("change", () => {
        diziPuanInput.disabled = !diziWatchedCheckbox.checked;
        diziAciklaInput.disabled = !diziWatchedCheckbox.checked;
    });
    
    // Film platformu değişikliği (link input gösterme/gizleme)
    filmPlatformSelect.addEventListener("change", () => {
        const selectedPlatform = filmPlatformSelect.value;
        platformLinkInput.style.display = (selectedPlatform === 'Exxen' || selectedPlatform === 'BluTV') ? 'block' : 'none';
    });

    // Dizi platformu değişikliği (link input gösterme/gizleme)
    diziPlatformSelect.addEventListener("change", () => {
        const selectedPlatform = diziPlatformSelect.value;
        diziPlatformLinkInput.style.display = (selectedPlatform === 'Exxen' || selectedPlatform === 'BluTV') ? 'block' : 'none';
    });
    
    // Form toggle butonları
    toggleFilmBtn.addEventListener("click", () => {
        toggleForms(true, false);
        resetEditMode();
    });
    
    toggleDiziBtn.addEventListener("click", () => {
        toggleForms(false, true);
        resetEditMode();
    });
    
    // Filtreleme butonlarına tıklama
    filterAllBtn.addEventListener("click", () => {
        setFilterActive(filterAllBtn, null);
    });
    
    filterFilmBtn.addEventListener("click", () => {
        setFilterActive(filterFilmBtn, "film");
    });
    
    filterDiziBtn.addEventListener("click", () => {
        setFilterActive(filterDiziBtn, "dizi");
    });
    
    // Arama kutusu değişikliği
    searchInput.addEventListener("input", () => {
        currentSearch = searchInput.value.trim();
        updateContentList();
    });

    // Düzenleme modunu sıfırla
    const resetEditMode = () => {
        editMode = false;
        editIndex = -1;
        editType = null;
        
        // Film butonunu sıfırla
        addFilmBtn.innerHTML = '<i class="bi bi-plus-lg"></i>';
        addFilmBtn.classList.remove('btn-success');
        addFilmBtn.classList.add('btn-primary');
        
        // Dizi butonunu sıfırla
        addDiziBtn.innerHTML = '<i class="bi bi-plus-lg"></i>';
        addDiziBtn.classList.remove('btn-success');
        addDiziBtn.classList.add('btn-info');
        
        // Formları sıfırla
        clearFilmForm(filmInput, filmPuanInput, filmWatchedCheckbox, filmAciklaInput, filmPlatformSelect);
        clearDiziForm(diziInput, diziPuanInput, diziWatchedCheckbox, diziAciklaInput, diziPlatformSelect, sezonInput, bolumInput);
    };
    
    // Filtreleme butonlarını ayarla
    const setFilterActive = (activeBtn, filterType) => {
        // Tüm butonlardan active sınıfını kaldır
        filterAllBtn.classList.remove('active');
        filterFilmBtn.classList.remove('active');
        filterDiziBtn.classList.remove('active');
        
        // Aktif butona active sınıfını ekle
        activeBtn.classList.add('active');
        
        // Filtre türünü güncelle
        currentFilter = filterType;
        
        // Listeyi güncelle
        updateContentList();
    };
    
    // Listeyi güncelle
    const updateContentList = () => {
        const filteredContents = filterContent(currentFilter, currentSearch);
        render(filteredContents, contentList);
    };
    
    // Film ekle/güncelle
    const addOrUpdateFilm = () => {
        const filmText = filmInput.value.trim();
        const watched = filmWatchedCheckbox.checked;
        const rating = filmPuanInput.value;
        const description = filmAciklaInput.value.trim();
        const platform = filmPlatformSelect.value;
        
        if (filmText.length > 0) {
            if (editMode && editIndex !== -1 && editType === "film") {
                // Film güncelleme
                updateContent(editIndex, filmText, "film", watched, rating, description, null, null, platform);
                resetEditMode();
            } else {
                // Yeni film ekleme
                addContent(filmText, "film", watched, rating, description, null, null, platform);
                clearFilmForm(filmInput, filmPuanInput, filmWatchedCheckbox, filmAciklaInput, filmPlatformSelect);
            }
            updateContentList();
        }
    };
    
    // Dizi ekle/güncelle
    const addOrUpdateDizi = () => {
        const diziText = diziInput.value.trim();
        const watched = diziWatchedCheckbox.checked;
        const rating = diziPuanInput.value;
        const description = diziAciklaInput.value.trim();
        const platform = diziPlatformSelect.value;
        const season = sezonInput.value !== "" ? parseInt(sezonInput.value) : null;
        const episode = bolumInput.value !== "" ? parseInt(bolumInput.value) : null;
        
        if (diziText.length > 0) {
            if (editMode && editIndex !== -1 && editType === "dizi") {
                // Dizi güncelleme
                updateContent(editIndex, diziText, "dizi", watched, rating, description, season, episode, platform);
                resetEditMode();
            } else {
                // Yeni dizi ekleme
                addContent(diziText, "dizi", watched, rating, description, season, episode, platform);
                clearDiziForm(diziInput, diziPuanInput, diziWatchedCheckbox, diziAciklaInput, diziPlatformSelect, sezonInput, bolumInput);
            }
            updateContentList();
        }
    };
    
    // Buton olay dinleyicileri
    addFilmBtn.addEventListener("click", addOrUpdateFilm);
    addDiziBtn.addEventListener("click", addOrUpdateDizi);
    
    // Enter tuşu dinleyicileri
    filmInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            addOrUpdateFilm();
        }
    });
    
    diziInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            addOrUpdateDizi();
        }
    });
    
    // İçerik silme fonksiyonu
    window.deleteContent = (index) => {
        deleteContent(index);
        
        // Eğer düzenlenen içerik silindiyse formu sıfırla
        if (editMode && editIndex === index) {
            resetEditMode();
        }
        
        updateContentList();
    };
    
    // İçerik düzenleme fonksiyonu
    window.editContent = (index) => {
        const contents = getData("contents");
        const content = contents[index];
        
        // Düzenleme modunu aktifleştir
        editMode = true;
        editIndex = index;
        editType = content.type;
        
        // İçerik türüne göre formu göster
        if (content.type === "film") {
            toggleForms(true, false);
            
            // Film düzenleme butonunu güncelle
            addFilmBtn.innerHTML = '<i class="bi bi-check-lg"></i>';
            addFilmBtn.classList.remove('btn-primary');
            addFilmBtn.classList.add('btn-success');
            
            // Film formunu doldur
            setFilmFormForEdit(filmInput, filmPuanInput, filmWatchedCheckbox, filmAciklaInput, filmPlatformSelect, content);
        } else if (content.type === "dizi") {
            toggleForms(false, true);
            
            // Dizi düzenleme butonunu güncelle
            addDiziBtn.innerHTML = '<i class="bi bi-check-lg"></i>';
            addDiziBtn.classList.remove('btn-info');
            addDiziBtn.classList.add('btn-success');
            
            // Dizi formunu doldur
            setDiziFormForEdit(diziInput, diziPuanInput, diziWatchedCheckbox, diziAciklaInput, diziPlatformSelect, sezonInput, bolumInput, content);
        }
    };

    // Api 

    // Sayfa yüklendiğinde API'den verileri çek
document.addEventListener("DOMContentLoaded", () => {
    fetchContentsFromAPI(); // API'den içerikleri çek
});

// API'den içerik verilerini çekme
const fetchContentsFromAPI = async () => {
    try {
        const response = await fetch("https://api.example.com/contents"); // Gerçek API URL'si ile değiştirin
        if (!response.ok) {
            throw new Error("API'den veri alınırken bir hata oluştu");
        }
        const data = await response.json();
        saveData("contents", data);  // API'den alınan veriyi yerel depolamaya kaydet
        render(getData("contents"), contentList);  // UI'yi güncelle
    } catch (error) {
        console.error("Veri çekme hatası:", error);
    }
};

// API'ye içerik ekleme
const addContentToAPI = async (content) => {
    try {
        const response = await fetch("https://api.example.com/contents", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(content),
        });

        if (!response.ok) {
            throw new Error("API'ye veri gönderme hatası");
        }

        const addedContent = await response.json();
        console.log("Yeni içerik başarıyla eklendi:", addedContent);
    } catch (error) {
        console.error("Veri gönderme hatası:", error);
    }
};

// İçerik eklerken, API'ye veri gönder
const addContent = (text, type, watched, rating, description, season, episode, platform) => {
    // Yerel depolamaya ekle
    saveData("contents", getData("contents").concat([{ text, type, watched, rating, description, season, episode, platform }]));

    // API'ye gönder
    addContentToAPI({ text, type, watched, rating, description, season, episode, platform });

    // UI'yi yeniden render et
    render(getData("contents"), contentList);
};

};


document.addEventListener("DOMContentLoaded", initializeApp);


