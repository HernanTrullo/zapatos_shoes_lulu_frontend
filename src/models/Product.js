/**
 * Modelo de Producto
 * Representa un producto del catálogo
 */

import { API_CONFIG } from '../config/constants.js';

export class Product {
    constructor(data) {
        this.id = data.id;
        this.documentId = data.documentId;
        this.nombre = data.nombre || 'Sin nombre';
        this.descripcion = data.descripcion || 'Sin descripción';
        this.precio = parseFloat(data.precio) || 0;
        this.stock = parseInt(data.stock) || 0;
        this.activo = data.activo !== false;
        this.imagenes = this._processImages(data.imagen);
        this.tallas = data.tallas || [];
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
    }

    /**
     * Procesa las imágenes del producto
     */
    _processImages(imageData) {
        if (!imageData || !Array.isArray(imageData) || imageData.length === 0) {
            return ['https://via.placeholder.com/400x400?text=Sin+Imagen'];
        }

        return imageData.map(img => {
            const url = img.url || '';
            return url.startsWith('http') 
                ? url 
                : `${API_CONFIG.BASE_URL}${url}`;
        });
    }

    /**
     * Obtiene la primera imagen del producto
     */
    getPrimaryImage() {
        return this.imagenes[0];
    }

    /**
     * Verifica si el producto está disponible
     */
    isAvailable() {
        return this.stock > 0 && this.activo;
    }

    /**
     * Obtiene el estado del stock
     */
    getStockStatus() {
        return this.isAvailable() ? 'En Stock' : 'Agotado';
    }

    /**
     * Verifica si el producto tiene múltiples imágenes
     */
    hasMultipleImages() {
        return this.imagenes.length > 1;
    }

    /**
     * Serializa el producto para almacenamiento
     */
    toJSON() {
        return {
            id: this.id,
            documentId: this.documentId,
            nombre: this.nombre,
            descripcion: this.descripcion,
            precio: this.precio,
            stock: this.stock,
            activo: this.activo,
            imagen: this.imagenes[0]
        };
    }
}
