//ui.js
import { platforms } from "./storage.js";

export const render = (contents, contentList) => {
    contentList.innerHTML = "";  

    contents.forEach((content, index) => {
        const li = document.createElement("li");
        li.setAttribute("class", "list-group-item");
        li.setAttribute("data-type", content.type);

        // İzlenme badge'i
        const watchedBadge = content.watched
            ? `<span class="badge bg-success">İzlendi</span>`
            : `<span class="badge bg-danger">İzlenmedi</span>`;

        // Tür badge'i (film veya dizi)
        const typeBadge = content.type === "film"
            ? `<span class="badge bg-primary">Film</span>`
            : `<span class="badge bg-info">Dizi</span>`;

        // Puan badge'i
        const ratingText = content.watched && content.rating
            ? `<span class="badge bg-warning text-dark">Puan ${content.rating}/10</span>`
            : "";

        // Platform badge'i
        const platformBadge = content.platform ? getPlatformBadge(content.platform) : "";

        // Sezon ve bölüm bilgisi (sadece diziler için)
        const seasonEpisodeText = content.type === "dizi" && content.season && content.episode
            ? `<span class="badge bg-secondary">S${content.season}:B${content.episode}</span>`
            : "";

        // Açıklama satırı
        const descriptionSection = content.watched && content.description
            ? `<div class="mt-2 description-text text-muted d-none">${content.description}</div>`
            : "";

        li.innerHTML = `
            <div class="d-flex justify-content-between align-items-center fs-5 toggle-description" style="cursor:pointer;">
                <div>
                    <span class="badge bg-light text-dark">${content.date}</span>
                    ${typeBadge} ${watchedBadge} ${seasonEpisodeText} ${content.text}
                </div>
                <div>
                ${platformBadge}
                    ${ratingText}
                    <button class="btn btn-success btn-sm edit-content" onclick="editContent(${index})">
                        <i class="bi bi-pencil-square"></i>
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteContent(${index})">
                        <i class="bi bi-trash-fill"></i>
                    </button>
                </div>
            </div>
            ${descriptionSection}
        `;

        // Açıklama göster/gizle özelliği
        li.querySelector(".toggle-description").addEventListener("click", () => {
            const desc = li.querySelector(".description-text");
            if (desc) {
                desc.classList.toggle("d-none");
            }
        });

        contentList.appendChild(li);
    });
};

// Platform badge'i oluşturma
const getPlatformBadge = (platform) => {
    if (!platform || !platforms[platform]) return "";
    
    const platformInfo = platforms[platform];
    const icon = platformInfo.icon || "bi-collection-play";
    const color = platformInfo.color || "#6c757d";
    
    return `<span class="badge" style="background-color: ${color}"><i class="bi ${icon} me-1"></i>${platform}</span>`;
};

// Platform seçim kutularını güncelleme
export const updatePlatformSelects = () => {
    const filmPlatformSelect = document.getElementById("film-platform");
    const diziPlatformSelect = document.getElementById("dizi-platform");
    
    // Seçim kutularını platform bilgileriyle doldur
    if (filmPlatformSelect && diziPlatformSelect) {
        updatePlatformSelect(filmPlatformSelect);
        updatePlatformSelect(diziPlatformSelect);
    }
};

// Tek bir platform seçim kutusunu güncelleme
const updatePlatformSelect = (selectElement) => {
    // Mevcut içeriği temizle ve ilk seçeneği ekle
    selectElement.innerHTML = '<option value="">Platform Seçin</option>';
    
    // Her platform için bir seçenek ekle
    Object.keys(platforms).forEach(platform => {
        const opt = document.createElement("option");
        opt.value = platform;
        opt.textContent = platform;
        selectElement.appendChild(opt);
    });
};

// Film formu için sıfırlama
export const clearFilmForm = (filmInput, puanInput, watchedCheckbox, descriptionInput, platformSelect) => {
    filmInput.value = "";
    puanInput.value = "";
    watchedCheckbox.checked = false;
    puanInput.disabled = true;
    descriptionInput.value = "";
    descriptionInput.disabled = true;
    if (platformSelect) platformSelect.value = "";
};

// Dizi formu için sıfırlama
export const clearDiziForm = (diziInput, puanInput, watchedCheckbox, descriptionInput, platformSelect, seasonInput, episodeInput) => {
    diziInput.value = "";
    puanInput.value = "";
    watchedCheckbox.checked = false;
    puanInput.disabled = true;
    descriptionInput.value = "";
    descriptionInput.disabled = true;
    if (platformSelect) platformSelect.value = "";
    seasonInput.value = "";
    episodeInput.value = "";
};

// Film formu düzenleme modu
export const setFilmFormForEdit = (filmInput, puanInput, watchedCheckbox, descriptionInput, platformSelect, content) => {
    filmInput.value = content.text;
    watchedCheckbox.checked = content.watched;
    
    // İzleme durumuna göre input alanlarını etkinleştir/devre dışı bırak
    puanInput.disabled = !content.watched;
    descriptionInput.disabled = !content.watched;
    
    if (content.watched) {
        puanInput.value = content.rating;
        descriptionInput.value = content.description || "";
    } else {
        puanInput.value = "";
        descriptionInput.value = "";
    }
    
    // Platform bilgisini ayarla
    if (platformSelect) {
        platformSelect.value = content.platform || "";
    }
    
    // İmleci input'un sonuna konumlandır
    filmInput.focus();
    const inputLength = filmInput.value.length;
    filmInput.setSelectionRange(inputLength, inputLength);
};

// Dizi formu düzenleme modu
export const setDiziFormForEdit = (diziInput, puanInput, watchedCheckbox, descriptionInput, platformSelect, seasonInput, episodeInput, content) => {
    diziInput.value = content.text;
    watchedCheckbox.checked = content.watched;
    
    // İzleme durumuna göre input alanlarını etkinleştir/devre dışı bırak
    puanInput.disabled = !content.watched;
    descriptionInput.disabled = !content.watched;
    
    // İzlenme durumundan bağımsız olarak sezon ve bölüm bilgilerini doldur
    seasonInput.value = content.season || "";
    episodeInput.value = content.episode || "";
    
    // Platform bilgisini ayarla
    if (platformSelect) {
        platformSelect.value = content.platform || "";
    }
    
    if (content.watched) {
        puanInput.value = content.rating;
        descriptionInput.value = content.description || "";
    } else {
        puanInput.value = "";
        descriptionInput.value = "";
    }
    
    // İmleci input'un sonuna konumlandır
    diziInput.focus();
    const inputLength = diziInput.value.length;
    diziInput.setSelectionRange(inputLength, inputLength);
};

// Form gösterme/gizleme
export const toggleForms = (showFilmForm, showDiziForm) => {
    const filmForm = document.getElementById("film-form");
    const diziForm = document.getElementById("dizi-form");
    
    if (showFilmForm) {
        filmForm.classList.remove("d-none");
    } else {
        filmForm.classList.add("d-none");
    }
    
    if (showDiziForm) {
        diziForm.classList.remove("d-none");
    } else {
        diziForm.classList.add("d-none");
    }
};







