/**
 * Vista del Carrito
 * Maneja la renderización del carrito
 */

import { formatPrice, sanitizeHTML } from '../utils/helpers.js';

export class CartView {
    constructor() {
        this.modal = document.getElementById('cartModal');
        this.cartItems = document.getElementById('cartItems');
        this.emptyCart = document.getElementById('emptyCart');
        this.cartTotalPrice = document.getElementById('cartTotalPrice');
        this.cartCount = document.querySelector('.cart-count');
        this.closeBtn = this.modal.querySelector('.cart-close');
        this.isModalOpen = false;
        
        // Manejar navegación con botón "Atrás"
        this._setupHistoryHandler();
    }

    /**
     * Muestra el modal del carrito
     */
    show() {
        this.modal.style.display = 'block';
        this.isModalOpen = true;
        
        // Agregar estado al historial para manejar botón "Atrás"
        if (window.history.state?.cartModal !== true) {
            window.history.pushState({ cartModal: true }, '');
        }
    }

    /**
     * Oculta el modal del carrito
     */
    hide() {
        this.modal.style.display = 'none';
        this.isModalOpen = false;
        
        // Si el historial tiene el estado del modal, volver atrás
        if (window.history.state?.cartModal === true) {
            window.history.back();
        }
    }

    /**
     * Actualiza el contador del carrito en el header
     */
    updateCount(count) {
        this.cartCount.textContent = count;
    }

    /**
     * Renderiza los items del carrito
     */
    renderItems(items, total, callbacks) {
        if (items.length === 0) {
            this.cartItems.style.display = 'none';
            this.emptyCart.style.display = 'block';
            this.cartTotalPrice.textContent = '$0.00';
            return;
        }

        this.cartItems.style.display = 'block';
        this.emptyCart.style.display = 'none';
        this.cartTotalPrice.textContent = `$${formatPrice(total)}`;

        this.cartItems.innerHTML = items
            .map(item => this._createCartItem(item))
            .join('');

        // Agregar event listeners
        this._attachEventListeners(callbacks);
    }

    /**
     * Crea un item del carrito
     */
    _createCartItem(item) {
        return `
            <div class="cart-item" data-id="${item.id}">
                <img 
                    src="${item.imagen}" 
                    alt="${sanitizeHTML(item.nombre)}" 
                    class="cart-item-image" 
                    onerror="this.src='https://via.placeholder.com/80x80?text=Sin+Imagen'"
                >
                <div class="cart-item-info">
                    <h4>${sanitizeHTML(item.nombre)}</h4>
                    <p class="cart-item-price">$${formatPrice(item.precio)}</p>
                </div>
                <div class="cart-item-quantity">
                    <button class="qty-btn qty-decrease" data-id="${item.id}">-</button>
                    <span>${item.cantidad}</span>
                    <button class="qty-btn qty-increase" data-id="${item.id}">+</button>
                </div>
                <div class="cart-item-total">
                    <p>$${formatPrice(item.precio * item.cantidad)}</p>
                </div>
                <button class="cart-item-remove" data-id="${item.id}" title="Eliminar">🗑️</button>
            </div>
        `;
    }

    /**
     * Agrega event listeners a los botones
     */
    _attachEventListeners(callbacks) {
        // Botones de aumentar cantidad
        this.cartItems.querySelectorAll('.qty-increase').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(btn.dataset.id);
                callbacks.onUpdateQuantity(id, 1);
            });
        });

        // Botones de disminuir cantidad
        this.cartItems.querySelectorAll('.qty-decrease').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(btn.dataset.id);
                callbacks.onUpdateQuantity(id, -1);
            });
        });

        // Botones de eliminar
        this.cartItems.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(btn.dataset.id);
                callbacks.onRemove(id);
            });
        });
    }

    /**
     * Inicializa event listeners del modal
     */
    initEventListeners(callbacks) {
        this.closeBtn.addEventListener('click', () => this.hide());
        
        window.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.hide();
            }
        });

        // Botón de WhatsApp
        const btnWhatsappCart = document.getElementById('btnWhatsappCart');
        if (btnWhatsappCart) {
            btnWhatsappCart.addEventListener('click', callbacks.onWhatsAppClick);
        }
    }

    /**
     * Configura el manejador del historial del navegador
     */
    _setupHistoryHandler() {
        window.addEventListener('popstate', (event) => {
            // Si el modal está abierto y se presiona "Atrás", cerrar el modal
            if (this.isModalOpen) {
                this.modal.style.display = 'none';
                this.isModalOpen = false;
            }
        });
    }
}
