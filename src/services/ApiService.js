/**
 * Servicio de API
 * Maneja todas las peticiones HTTP
 */

import { API_CONFIG } from '../config/constants.js';
import { Product } from '../models/Product.js';

export class ApiService {
    constructor() {
        this.baseURL = API_CONFIG.API_URL;
        this.timeout = API_CONFIG.TIMEOUT;
    }

    /**
     * Realiza una petición fetch con timeout
     */
    async fetchWithTimeout(url, options = {}) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), this.timeout);

        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal,
                headers: {
                    'Accept': 'application/json',
                    ...options.headers
                }
            });

            clearTimeout(timeout);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            clearTimeout(timeout);
            
            if (error.name === 'AbortError') {
                throw new Error('La solicitud ha excedido el tiempo de espera');
            }
            
            throw error;
        }
    }

    /**
     * Obtiene todos los productos
     */
    async getProducts() {
        try {
            const url = `${this.baseURL}${API_CONFIG.ENDPOINTS.PRODUCTS}?populate=*`;
            const data = await this.fetchWithTimeout(url);
            
            // Convertir los datos a instancias de Product
            const products = (data.data || []).map(item => new Product(item));
            
            return products;
        } catch (error) {
            console.error('Error al obtener productos:', error);
            throw error;
        }
    }

    /**
     * Obtiene un producto por ID
     */
    async getProductById(id) {
        try {
            const url = `${this.baseURL}${API_CONFIG.ENDPOINTS.PRODUCTS}/${id}?populate=*`;
            const data = await this.fetchWithTimeout(url);
            
            return new Product(data.data);
        } catch (error) {
            console.error('Error al obtener producto:', error);
            throw error;
        }
    }

    /**
     * Filtra productos por criterios
     */
    async filterProducts(filters = {}) {
        try {
            const queryParams = new URLSearchParams();
            
            if (filters.search) {
                queryParams.append('filters[$or][0][nombre][$containsi]', filters.search);
                queryParams.append('filters[$or][1][descripcion][$containsi]', filters.search);
            }
            
            if (filters.available) {
                queryParams.append('filters[activo][$eq]', 'true');
                queryParams.append('filters[stock][$gt]', '0');
            }
            
            queryParams.append('populate', '*');
            
            const url = `${this.baseURL}${API_CONFIG.ENDPOINTS.PRODUCTS}?${queryParams.toString()}`;
            const data = await this.fetchWithTimeout(url);
            
            return (data.data || []).map(item => new Product(item));
        } catch (error) {
            console.error('Error al filtrar productos:', error);
            throw error;
        }
    }
}

// Exportar una instancia singleton
export const apiService = new ApiService();
