 // storage.js (veri okuma ve kaydetme işlemleri)
 export const getData = (key) => {
     try {
         const data = JSON.parse(localStorage.getItem(key));
         return Array.isArray(data) ? data : [];  // Eğer veri yanlış formatta ise boş bir dizi döndür
     } catch (error) {
         console.error("Veri okuma hatası:", error);
         return [];  // Hata durumunda boş bir dizi döndür
     }
 };

 export const saveData = (key, data) => {
         try {
             localStorage.setItem(key, JSON.stringify(data));
         } catch (error) {
             console.error("Veri kaydetme hatası:", error);
         }
 };



// Platform bilgileri
export const platforms = {
    "Netflix": {
        color: "#E50914",
        
    },
    "BluTV": {
        color: "#1A2768",
        
    },
    "Exxen": {
        color: "#F7B500",
     
    },
    "Disney+": {
        color: "#0063E5",
        
    },
    "Prime Video": {
        color: "#00A8E1",
      
    },
    "Diğer": {
        color: "#6c757d",
        
    }
};

// İçerik ekleme (film veya dizi)
export const addContent = (text, type, watched = false, rating = "", description = "", season = null, episode = null, platform = "") => {
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
        platform: platform
    };

    contents.push(newContent);
    saveData("contents", contents);
};

// İçerik güncelleme (film veya dizi)
export const updateContent = (index, text, type, watched = false, rating = "", description = "", season = null, episode = null, platform = "") => {
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
        platform: platform
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
            (content.platform && content.platform.toLowerCase().includes(searchText.toLowerCase()));
        
        return typeMatch && searchMatch;
    });
};



