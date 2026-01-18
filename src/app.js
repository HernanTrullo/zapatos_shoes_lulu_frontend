/**
 * Punto de entrada principal de la aplicación
 * Inicializa controladores y maneja el ciclo de vida de la app
 */

import { ProductController } from './controllers/ProductController.js';
import { CartController } from './controllers/CartController.js';

class App {
    constructor() {
        this.cartController = null;
        this.productController = null;
    }

    /**
     * Inicializa la aplicación
     */
    async init() {
        try {
            console.log('🚀 Iniciando Shoes Lulu App...');
            
            // Agregar estilos para notificaciones
            this.injectNotificationStyles();

            // Inicializar controladores
            this.cartController = new CartController();
            this.productController = new ProductController(this.cartController);

            // Cargar productos
            await this.productController.loadProducts();

            console.log('✅ App inicializada correctamente');
        } catch (error) {
            console.error('❌ Error al inicializar la app:', error);
        }
    }

    /**
     * Inyecta estilos CSS para las notificaciones
     */
    injectNotificationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }

            .notification {
                font-family: 'Poppins', sans-serif;
                font-weight: 500;
            }
        `;
        document.head.appendChild(style);
    }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        const app = new App();
        app.init();
    });
} else {
    const app = new App();
    app.init();
}
