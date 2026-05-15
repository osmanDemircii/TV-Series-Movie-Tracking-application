// tmdb.js - TMDB API entegrasyonu

const TMDB_API_KEY = '39af7eb05f21caf35b127c10c99444a8'; // TMDB API anahtarınızı buraya ekleyin
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// Film araması yapma
export const searchMovie = async (query) => {
    try {
        const response = await fetch(`${BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=tr-TR`);
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('Film arama hatası:', error);
        return [];
    }
};

// Dizi araması yapma 
export const searchTVShow = async (query) => {
    try {
        const response = await fetch(`${BASE_URL}/search/tv?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=tr-TR`);
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('Dizi arama hatası:', error);
        return [];
    }
};

// Film detaylarını alma
export const getMovieDetails = async (movieId) => {
    try {
        const response = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&language=tr-TR`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Film detayları alınamadı:', error);
        return null;
    }
};

// Dizi detaylarını alma
export const getTVShowDetails = async (tvId) => {
    try {
        const response = await fetch(`${BASE_URL}/tv/${tvId}?api_key=${TMDB_API_KEY}&language=tr-TR`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Dizi detayları alınamadı:', error);
        return null;
    }
};

// Film veya dizi için önerilen içerikleri alma
export const getRecommendations = async (id, type) => {
    try {
        const endpoint = type === 'film' ? 'movie' : 'tv';
        const response = await fetch(`${BASE_URL}/${endpoint}/${id}/recommendations?api_key=${TMDB_API_KEY}&language=tr-TR`);
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('Öneriler alınamadı:', error);
        return [];
    }
};

// Platform kontrolü
export const formatPlatformData = (platform, platformLink = '') => {
    // Yerli platformlar için link alma
    if (platform === 'BluTV' || platform === 'Exxen') {
        return {
            platform,
            externalLink: platformLink || ''
        };
    }
    
    // TMDB API ile çalışan platformlar
    return { platform, externalLink: '' };
};

// Poster URL'i oluşturma
export const getPosterUrl = (posterPath) => {
    if (!posterPath) return '';
    return `${IMAGE_BASE_URL}${posterPath}`;
};

// TMDB içerik kimliğinden detay alıp biçimlendiren fonksiyon
export const formatContentDetailsFromTMDB = (tmdbData, type) => {
    if (!tmdbData) return null;
    
    // Ortak alanlar
    const details = {
        tmdbId: tmdbData.id,
        overview: tmdbData.overview || '',
        poster: tmdbData.poster_path ? getPosterUrl(tmdbData.poster_path) : '',
        backdrop: tmdbData.backdrop_path ? getPosterUrl(tmdbData.backdrop_path) : '',
        rating: tmdbData.vote_average ? (tmdbData.vote_average / 2).toFixed(1) : '', // 10 üzerinden puanı 5 üzerinden puana çevir
        genres: tmdbData.genres ? tmdbData.genres.map(g => g.name).join(', ') : ''
    };

    // İçerik türüne özel alanlar
    if (type === 'film') {
        details.title = tmdbData.title || '';
        details.releaseDate = tmdbData.release_date || '';
        details.runtime = tmdbData.runtime ? `${tmdbData.runtime} dk` : '';
    } else {
        details.title = tmdbData.name || '';
        details.firstAirDate = tmdbData.first_air_date || '';
        details.numberOfSeasons = tmdbData.number_of_seasons || '';
        details.numberOfEpisodes = tmdbData.number_of_episodes || '';
    }

    return details;
};

