/**
 * Vista del Modal de Producto
 * Maneja la visualización del modal de detalles
 */

import { formatPrice, sanitizeHTML } from '../utils/helpers.js';

export class ModalView {
    constructor() {
        this.modal = document.getElementById('productModal');
        this.closeBtn = this.modal.querySelector('.close');
        this.modalTitle = document.getElementById('modalTitle');
        this.modalPrice = document.getElementById('modalPrice');
        this.modalDescription = document.getElementById('modalDescription');
        this.modalStock = document.getElementById('modalStock');
        this.modalMainImage = document.getElementById('modalMainImage');
        this.modalThumbnails = document.getElementById('modalThumbnails');
        this.sizesContainer = this.modal.querySelector('.sizes-container');
        this.btnWhatsapp = document.getElementById('btnWhatsapp');
        this.btnAddCart = this.modal.querySelector('.btn-add-cart');
    }

    /**
     * Muestra el modal con información del producto
     */
    show(product, callbacks) {
        // Actualizar información
        this.modalTitle.textContent = product.nombre;
        this.modalPrice.textContent = `$${formatPrice(product.precio)}`;
        this.modalDescription.textContent = product.descripcion;
        this.modalStock.textContent = `Stock disponible: ${product.stock} unidades`;

        // Actualizar imágenes
        this._updateImages(product.imagenes);

        // Actualizar tallas
        this._updateSizes(product.tallas);

        // Configurar botones
        this.btnWhatsapp.onclick = () => callbacks.onWhatsAppClick(product);
        this.btnAddCart.onclick = () => callbacks.onAddToCart(product);

        this.modal.style.display = 'block';
    }

    /**
     * Oculta el modal
     */
    hide() {
        this.modal.style.display = 'none';
    }

    /**
     * Actualiza las imágenes del modal
     */
    _updateImages(images) {
        if (!images || images.length === 0) {
            images = ['https://via.placeholder.com/400x400?text=Sin+Imagen'];
        }

        // Establecer imagen principal
        this.modalMainImage.src = images[0];
        this.modalMainImage.alt = 'Producto';
        this.modalMainImage.onerror = () => {
            this.modalMainImage.src = 'https://via.placeholder.com/400x400?text=Sin+Imagen';
        };

        // Crear miniaturas
        this.modalThumbnails.innerHTML = images
            .map((img, index) => `
                <img 
                    src="${img}" 
                    alt="Miniatura ${index + 1}" 
                    class="thumbnail ${index === 0 ? 'active' : ''}" 
                    data-index="${index}" 
                    onerror="this.src='https://via.placeholder.com/80x80?text=Img'"
                >
            `)
            .join('');

        // Event listeners para miniaturas
        this.modalThumbnails.querySelectorAll('.thumbnail').forEach((thumb, index) => {
            thumb.addEventListener('click', () => {
                this.modalMainImage.src = images[index];
                this.modalThumbnails.querySelectorAll('.thumbnail').forEach(t => 
                    t.classList.remove('active')
                );
                thumb.classList.add('active');
            });
        });
    }

    /**
     * Actualiza las tallas disponibles
     */
    _updateSizes(tallas) {
        if (!tallas || !Array.isArray(tallas) || tallas.length === 0) {
            this.sizesContainer.innerHTML = '<p style="color: #7f8c8d;">No hay tallas especificadas</p>';
            return;
        }

        this.sizesContainer.innerHTML = tallas
            .map(talla => {
                const label = sanitizeHTML(talla.label || 'N/A');
                return `<span class="size-badge">${label}</span>`;
            })
            .join('');
    }

    /**
     * Inicializa event listeners
     */
    initEventListeners() {
        this.closeBtn.addEventListener('click', () => this.hide());
        
        window.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.hide();
            }
        });
    }
}
