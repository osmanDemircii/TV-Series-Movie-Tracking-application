// storage.js (veri okuma ve kaydetme işlemleri)
export const getData = (key) => {
    return JSON.parse(localStorage.getItem(key)) || [];
};

export const saveData = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
};

// Platform bilgileri
export const platforms = {
    "Netflix": {
        color: "#E50914",
        icon: "bi-netflix",
        usesTMDB: true
    },
    "BluTV": {
        color: "#1A2768",
        icon: "bi-collection-play",
        usesTMDB: false
    },
    "Exxen": {
        color: "#F7B500",
        icon: "bi-collection-play",
        usesTMDB: false
    },
    "Disney+": {
        color: "#0063E5",
        icon: "bi-disney-plus",
        usesTMDB: true
    },
    "Prime Video": {
        color: "#00A8E1",
        icon: "bi-badge-4k",
        usesTMDB: true
    },
    "Diğer": {
        color: "#6c757d",
        icon: "bi-collection-play",
        usesTMDB: false
    }
};

// İçerik ekleme (film veya dizi)
export const addContent = (text, type, watched = false, rating = "", description = "", season = null, episode = null, platform = "", tmdbData = null, platformLink = "") => {
    const contents = getData("contents");

    const newContent = {
        text: text,
        type: type, // "film" veya "dizi"
        date: new Date().toLocaleDateString("tr-TR", {
            day: "2-digit",
            month: "long",
            year: "numeric"
        }),
        watched: watched,
        rating: watched ? rating : "",
        description: description,
        season: type === "dizi" ? season : null,
        episode: type === "dizi" ? episode : null,
        platform: platform,
        platformLink: platformLink,
        tmdbData: tmdbData // TMDB verilerini saklama
    };

    contents.push(newContent);
    saveData("contents", contents);
};

// İçerik güncelleme (film veya dizi)
export const updateContent = (index, text, type, watched = false, rating = "", description = "", season = null, episode = null, platform = "", tmdbData = null, platformLink = "") => {
    const contents = getData("contents");
    
    // Mevcut tarihi koru, diğer bilgileri güncelle
    const currentDate = contents[index].date;
    
    contents[index] = {
        text: text,
        type: type,
        date: currentDate,
        watched: watched,
        rating: watched ? rating : "",
        description: description,
        season: type === "dizi" ? season : null,
        episode: type === "dizi" ? episode : null,
        platform: platform,
        platformLink: platformLink || contents[index].platformLink || "",
        tmdbData: tmdbData || contents[index].tmdbData || null
    };
    
    saveData("contents", contents);
};

// İçerik silme (film veya dizi)
export const deleteContent = (index) => {
    const contents = getData("contents");
    contents.splice(index, 1);
    saveData("contents", contents);
};

// İçeriği filtreleme
export const filterContent = (type = null, searchText = "") => {
    const contents = getData("contents");
    
    return contents.filter(content => {
        // Tür filtresi
        const typeMatch = type === null || content.type === type;
        
        // Arama filtresi (büyük-küçük harf duyarsız)
        const searchMatch = searchText === "" || 
            content.text.toLowerCase().includes(searchText.toLowerCase()) || 
            (content.description && content.description.toLowerCase().includes(searchText.toLowerCase())) ||
            (content.platform && content.platform.toLowerCase().includes(searchText.toLowerCase())) ||
            (content.tmdbData && content.tmdbData.overview && 
             content.tmdbData.overview.toLowerCase().includes(searchText.toLowerCase())) ||
            (content.tmdbData && content.tmdbData.genres && 
             content.tmdbData.genres.toLowerCase().includes(searchText.toLowerCase()));
        
        return typeMatch && searchMatch;
    });
};