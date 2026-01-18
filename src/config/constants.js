/**
 * Configuración y constantes de la aplicación
 */

export const API_CONFIG = {
    BASE_URL: 'https://zapatos-shoes-lulu.onrender.com',
    API_URL: 'https://zapatos-shoes-lulu.onrender.com/api',
    ENDPOINTS: {
        PRODUCTS: '/zapatoes',
        UPLOADS: '/uploads'
    },
    TIMEOUT: 60000 // 60 segundos
};

export const CONTACT = {
    WHATSAPP: '573232312340',
    EMAIL: 'info@shoeslulu.com',
    ADDRESS: 'Calle Principal #123'
};

export const APP_CONFIG = {
    CURRENCY: 'COP',
    LOCALE: 'es-ES',
    ITEMS_PER_PAGE: 12,
    CACHE_DURATION: 5 * 60 * 1000 // 5 minutos
};

export const STORAGE_KEYS = {
    CART: 'shoesLuluCart',
    FAVORITES: 'shoesLuluFavorites'
};
