/**
 * Vista de Productos
 * Maneja la renderización de productos
 */

import { formatPrice, sanitizeHTML } from '../utils/helpers.js';

export class ProductView {
    constructor() {
        this.productsGrid = document.getElementById('productsGrid');
        this.loadingSpinner = document.getElementById('loadingSpinner');
        this.errorMessage = document.getElementById('errorMessage');
        this.noProducts = document.getElementById('noProducts');
    }

    /**
     * Muestra el spinner de carga
     */
    showLoading(message = 'Cargando productos...') {
        this.loadingSpinner.style.display = 'block';
        this.errorMessage.style.display = 'none';
        this.noProducts.style.display = 'none';
        
        const loadingText = this.loadingSpinner.querySelector('p');
        if (loadingText) {
            loadingText.textContent = message;
        }
    }

    /**
     * Oculta el spinner de carga
     */
    hideLoading() {
        this.loadingSpinner.style.display = 'none';
    }

    /**
     * Muestra un mensaje de error
     */
    showError(message) {
        this.hideLoading();
        this.errorMessage.style.display = 'block';
        
        const errorText = this.errorMessage.querySelector('p');
        if (errorText) {
            errorText.innerHTML = message;
        }
    }

    /**
     * Renderiza una lista de productos
     */
    renderProducts(products, onProductClick) {
        this.hideLoading();
        
        if (!products || products.length === 0) {
            this.noProducts.style.display = 'block';
            this.productsGrid.innerHTML = '';
            return;
        }

        this.noProducts.style.display = 'none';
        this.productsGrid.innerHTML = products
            .map(product => this._createProductCard(product))
            .join('');

        // Agregar event listeners
        this.productsGrid.querySelectorAll('.product-card').forEach((card, index) => {
            card.addEventListener('click', () => onProductClick(products[index]));
        });
    }

    /**
     * Crea una tarjeta de producto
     */
    _createProductCard(product) {
        const stockBadgeClass = product.isAvailable() ? '' : 'out-stock';
        
        return `
            <div class="product-card" data-id="${product.id}">
                <div class="product-badge ${stockBadgeClass}">
                    ${sanitizeHTML(product.getStockStatus())}
                </div>
                <img 
                    src="${product.getPrimaryImage()}" 
                    alt="${sanitizeHTML(product.nombre)}" 
                    class="product-image" 
                    loading="lazy" 
                    onerror="this.src='https://via.placeholder.com/300x300?text=Sin+Imagen'"
                >
                <div class="product-info">
                    <h3 class="product-name">${sanitizeHTML(product.nombre)}</h3>
                    <p class="product-description">${sanitizeHTML(product.descripcion)}</p>
                    <p class="product-price">$${formatPrice(product.precio)}</p>
                    <p class="product-stock">Stock: ${product.stock} unidades</p>
                </div>
            </div>
        `;
    }

    /**
     * Limpia la vista
     */
    clear() {
        this.productsGrid.innerHTML = '';
        this.hideLoading();
        this.errorMessage.style.display = 'none';
        this.noProducts.style.display = 'none';
    }
}
