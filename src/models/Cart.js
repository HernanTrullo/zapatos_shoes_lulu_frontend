/**
 * Modelo del Carrito de Compras
 * Maneja la lógica del carrito
 */

import { STORAGE_KEYS } from '../config/constants.js';

export class Cart {
    constructor() {
        this.items = [];
        this.loadFromStorage();
    }

    /**
     * Agrega un producto al carrito
     */
    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.cantidad++;
        } else {
            this.items.push({
                id: product.id,
                documentId: product.documentId,
                nombre: product.nombre,
                precio: product.precio,
                imagen: product.getPrimaryImage(),
                cantidad: 1
            });
        }
        
        this.saveToStorage();
        return true;
    }

    /**
     * Elimina un producto del carrito
     */
    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveToStorage();
    }

    /**
     * Actualiza la cantidad de un producto
     */
    updateQuantity(productId, change) {
        const item = this.items.find(item => item.id === productId);
        
        if (item) {
            item.cantidad += change;
            
            if (item.cantidad <= 0) {
                this.removeItem(productId);
            } else {
                this.saveToStorage();
            }
        }
    }

    /**
     * Obtiene el número total de items
     */
    getTotalItems() {
        return this.items.reduce((sum, item) => sum + item.cantidad, 0);
    }

    /**
     * Calcula el total del carrito
     */
    getTotal() {
        return this.items.reduce((sum, item) => {
            return sum + (item.precio * item.cantidad);
        }, 0);
    }

    /**
     * Verifica si el carrito está vacío
     */
    isEmpty() {
        return this.items.length === 0;
    }

    /**
     * Limpia el carrito
     */
    clear() {
        this.items = [];
        this.saveToStorage();
    }

    /**
     * Obtiene todos los items
     */
    getItems() {
        return [...this.items];
    }

    /**
     * Guarda el carrito en localStorage
     */
    saveToStorage() {
        try {
            localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(this.items));
        } catch (error) {
            console.error('Error al guardar el carrito:', error);
        }
    }

    /**
     * Carga el carrito desde localStorage
     */
    loadFromStorage() {
        try {
            const savedCart = localStorage.getItem(STORAGE_KEYS.CART);
            if (savedCart) {
                this.items = JSON.parse(savedCart);
            }
        } catch (error) {
            console.error('Error al cargar el carrito:', error);
            this.items = [];
        }
    }

    /**
     * Genera mensaje para WhatsApp
     */
    generateWhatsAppMessage() {
        if (this.isEmpty()) {
            return '';
        }

        let mensaje = '¡Hola! Estoy interesado en los siguientes productos:\n\n';
        
        this.items.forEach((item, index) => {
            mensaje += `${index + 1}. ${item.nombre}\n`;
            mensaje += `   Cantidad: ${item.cantidad}\n`;
            mensaje += `   Precio unitario: $${this._formatPrice(item.precio)}\n`;
            mensaje += `   Subtotal: $${this._formatPrice(item.precio * item.cantidad)}\n\n`;
        });

        mensaje += `*Total: $${this._formatPrice(this.getTotal())}*`;
        return mensaje;
    }

    /**
     * Formatea el precio
     */
    _formatPrice(price) {
        return new Intl.NumberFormat('es-ES', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(price);
    }
}
