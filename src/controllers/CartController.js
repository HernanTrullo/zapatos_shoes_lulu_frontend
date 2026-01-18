/**
 * Controlador del Carrito
 * Maneja la lógica de negocio del carrito
 */

import { Cart } from '../models/Cart.js';
import { CartView } from '../views/CartView.js';
import { showNotification, generateWhatsAppURL } from '../utils/helpers.js';
import { CONTACT } from '../config/constants.js';

export class CartController {
    constructor() {
        this.model = new Cart();
        this.view = new CartView();
        
        this.initEventListeners();
        this.updateView();
    }

    /**
     * Inicializa event listeners
     */
    initEventListeners() {
        // Abrir modal del carrito
        const cartIcon = document.querySelector('.cart-icon');
        cartIcon.addEventListener('click', () => this.openCart());

        // Event listeners del modal
        this.view.initEventListeners({
            onWhatsAppClick: () => this.sendToWhatsApp()
        });
    }

    /**
     * Agrega un producto al carrito
     */
    addProduct(product) {
        this.model.addItem(product);
        this.updateView();
    }

    /**
     * Elimina un producto del carrito
     */
    removeProduct(productId) {
        this.model.removeItem(productId);
        this.updateView();
        showNotification('Producto eliminado del carrito');
    }

    /**
     * Actualiza la cantidad de un producto
     */
    updateQuantity(productId, change) {
        this.model.updateQuantity(productId, change);
        this.updateView();
    }

    /**
     * Abre el modal del carrito
     */
    openCart() {
        this.updateView();
        this.view.show();
    }

    /**
     * Actualiza la vista del carrito
     */
    updateView() {
        const items = this.model.getItems();
        const total = this.model.getTotal();
        const count = this.model.getTotalItems();

        this.view.updateCount(count);
        this.view.renderItems(items, total, {
            onUpdateQuantity: (id, change) => this.updateQuantity(id, change),
            onRemove: (id) => this.removeProduct(id)
        });
    }

    /**
     * Envía el carrito por WhatsApp
     */
    sendToWhatsApp() {
        if (this.model.isEmpty()) {
            showNotification('El carrito está vacío');
            return;
        }

        const mensaje = this.model.generateWhatsAppMessage();
        const url = generateWhatsAppURL(CONTACT.WHATSAPP, mensaje);
        window.open(url, '_blank');
    }

    /**
     * Limpia el carrito
     */
    clearCart() {
        this.model.clear();
        this.updateView();
        showNotification('Carrito vaciado');
    }

    /**
     * Obtiene el número total de items
     */
    getTotalItems() {
        return this.model.getTotalItems();
    }

    /**
     * Obtiene el total del carrito
     */
    getTotal() {
        return this.model.getTotal();
    }
}
