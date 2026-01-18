/**
 * Controlador de Productos
 * Maneja la lógica de negocio de productos
 */

import { apiService } from '../services/ApiService.js';
import { ProductView } from '../views/ProductView.js';
import { ModalView } from '../views/ModalView.js';
import { showNotification, generateWhatsAppURL, debounce } from '../utils/helpers.js';
import { CONTACT } from '../config/constants.js';

export class ProductController {
    constructor(cartController) {
        this.view = new ProductView();
        this.modalView = new ModalView();
        this.cartController = cartController;
        this.products = [];
        this.filteredProducts = [];
        
        this.initEventListeners();
    }

    /**
     * Inicializa event listeners
     */
    initEventListeners() {
        // Modal
        this.modalView.initEventListeners();

        // Búsqueda
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.getElementById('searchBtn');

        const debouncedSearch = debounce(() => this.performSearch(), 300);
        
        searchInput.addEventListener('input', debouncedSearch);
        searchBtn.addEventListener('click', () => this.performSearch());
        searchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                this.performSearch();
            }
        });

        // Filtros
        document.getElementById('sortFilter').addEventListener('change', () => this.applyFilters());
        document.getElementById('stockFilter').addEventListener('change', () => this.applyFilters());

        // Scroll suave
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    /**
     * Carga todos los productos
     */
    async loadProducts() {
        try {
            this.view.showLoading('Cargando productos... (Puede tomar hasta 50 segundos si el servidor estaba inactivo)');
            
            this.products = await apiService.getProducts();
            this.filteredProducts = [...this.products];
            
            this.view.renderProducts(this.filteredProducts, (product) => {
                this.openProductModal(product);
            });

            console.log('Productos cargados:', this.products.length);
        } catch (error) {
            console.error('Error al cargar productos:', error);
            
            let errorMessage = '⚠️ Error al cargar los productos. ';
            if (error.message.includes('tiempo de espera')) {
                errorMessage += '<a href="javascript:location.reload()">Recarga la página</a> e intenta de nuevo.';
            } else {
                errorMessage += `${error.message}. <a href="javascript:location.reload()">Intentar de nuevo</a>`;
            }
            
            this.view.showError(errorMessage);
        }
    }

    /**
     * Abre el modal de detalles del producto
     */
    openProductModal(product) {
        this.modalView.show(product, {
            onWhatsAppClick: (prod) => this.contactWhatsApp(prod),
            onAddToCart: (prod) => this.addToCart(prod)
        });
    }

    /**
     * Realiza búsqueda de productos
     */
    performSearch() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
        
        if (!searchTerm) {
            this.filteredProducts = [...this.products];
        } else {
            this.filteredProducts = this.products.filter(product => {
                return product.nombre.toLowerCase().includes(searchTerm) ||
                       product.descripcion.toLowerCase().includes(searchTerm);
            });
        }
        
        this.applyFilters();
    }

    /**
     * Aplica filtros y ordenamiento
     */
    applyFilters() {
        const sortValue = document.getElementById('sortFilter').value;
        const stockValue = document.getElementById('stockFilter').value;

        let products = [...this.filteredProducts];

        // Filtrar por stock
        if (stockValue === 'available') {
            products = products.filter(product => product.isAvailable());
        }

        // Ordenar
        switch (sortValue) {
            case 'price-asc':
                products.sort((a, b) => a.precio - b.precio);
                break;
            case 'price-desc':
                products.sort((a, b) => b.precio - a.precio);
                break;
            case 'name':
                products.sort((a, b) => a.nombre.localeCompare(b.nombre));
                break;
        }

        this.view.renderProducts(products, (product) => {
            this.openProductModal(product);
        });
    }

    /**
     * Agrega producto al carrito
     */
    addToCart(product) {
        this.cartController.addProduct(product);
        showNotification('Producto agregado al carrito ✓');
    }

    /**
     * Contacta por WhatsApp sobre un producto
     */
    contactWhatsApp(product) {
        const mensaje = `Hola! Estoy interesado en el producto: ${product.nombre} - $${product.precio}`;
        const url = generateWhatsAppURL(CONTACT.WHATSAPP, mensaje);
        window.open(url, '_blank');
    }
}
