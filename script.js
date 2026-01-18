// Configuración de la API
const API_URL = 'https://zapatos-shoes-lulu.onrender.com/api';
const UPLOADS_URL = 'https://zapatos-shoes-lulu.onrender.com';

// Variables globales
let allProducts = [];
let cart = [];

// Inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    initializeEventListeners();
    loadCartFromStorage();
});

// Cargar productos desde la API
async function loadProducts() {
    const loadingSpinner = document.getElementById('loadingSpinner');
    const errorMessage = document.getElementById('errorMessage');
    const productsGrid = document.getElementById('productsGrid');

    try {
        loadingSpinner.style.display = 'block';
        errorMessage.style.display = 'none';
        
        // Actualizar mensaje para indicar que el servidor puede estar despertando
        const loadingText = loadingSpinner.querySelector('p');
        if (loadingText) {
            loadingText.textContent = 'Cargando productos... (Esto puede tomar hasta 50 segundos si el servidor estaba inactivo)';
        }

        // Timeout de 60 segundos para dar tiempo a que Render despierte
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 60000);

        // Obtener zapatos con sus relaciones (tallas e imágenes)
        const response = await fetch(`${API_URL}/zapatoes?populate=*`, {
            signal: controller.signal,
            headers: {
                'Accept': 'application/json',
            }
        });
        
        clearTimeout(timeout);
        
        if (!response.ok) {
            throw new Error(`Error al cargar los productos: ${response.status}`);
        }

        const data = await response.json();
        // En Strapi 5 con flat response, los datos vienen directamente
        allProducts = data.data || [];

        console.log('Productos cargados:', allProducts); // Para debug

        loadingSpinner.style.display = 'none';

        if (allProducts.length === 0) {
            document.getElementById('noProducts').style.display = 'block';
        } else {
            displayProducts(allProducts);
        }
    } catch (error) {
        console.error('Error:', error);
        loadingSpinner.style.display = 'none';
        errorMessage.style.display = 'block';
        
        // Mensaje más descriptivo
        const errorText = errorMessage.querySelector('p');
        if (errorText) {
            if (error.name === 'AbortError') {
                errorText.innerHTML = '⚠️ El servidor tardó demasiado en responder. Por favor, <a href="javascript:location.reload()">recarga la página</a>.';
            } else {
                errorText.innerHTML = `⚠️ Error al cargar los productos: ${error.message}. <a href="javascript:location.reload()">Intentar de nuevo</a>.`;
            }
        }
    }
}

// Mostrar productos en la cuadrícula
function displayProducts(products) {
    const productsGrid = document.getElementById('productsGrid');
    const noProducts = document.getElementById('noProducts');

    if (products.length === 0) {
        productsGrid.innerHTML = '';
        noProducts.style.display = 'block';
        return;
    }

    noProducts.style.display = 'none';
    productsGrid.innerHTML = products.map(product => createProductCard(product)).join('');

    // Agregar event listeners a las tarjetas
    document.querySelectorAll('.product-card').forEach((card, index) => {
        card.addEventListener('click', () => openProductModal(products[index]));
    });
}

// Crear tarjeta de producto
function createProductCard(product) {
    const attributes = product;
    const nombre = attributes.nombre || 'Sin nombre';
    const descripcion = attributes.descripcion || 'Sin descripción';
    const precio = attributes.precio || 0;
    const stock = parseInt(attributes.stock) || 0;
    const activo = attributes.activo !== false;

    console.log('Producto:', nombre, 'Stock:', attributes.stock, 'Parseado:', stock, 'Activo:', activo); // Debug

    // Obtener la primera imagen
    let imagenUrl = 'https://via.placeholder.com/300x300?text=Sin+Imagen';
    
    // En Strapi 5, las imágenes vienen directamente como array en attributes.imagen
    if (attributes.imagen && Array.isArray(attributes.imagen) && attributes.imagen.length > 0) {
        const primeraImagen = attributes.imagen[0];
        
        if (primeraImagen?.url) {
            imagenUrl = primeraImagen.url.startsWith('http') 
                ? primeraImagen.url 
                : `${UPLOADS_URL}${primeraImagen.url}`;
            console.log('URL de imagen construida:', imagenUrl); // Debug
        }
    } else {
        console.log('No se encontraron imágenes para:', nombre, 'Data:', attributes.imagen); // Debug
    }

    const stockStatus = stock > 0 && activo ? 'En Stock' : 'Agotado';
    const stockBadgeClass = stock > 0 && activo ? '' : 'out-stock';

    return `
        <div class="product-card" data-id="${product.id}">
            <div class="product-badge ${stockBadgeClass}">${stockStatus}</div>
            <img src="${imagenUrl}" alt="${nombre}" class="product-image" loading="lazy" onerror="this.src='https://via.placeholder.com/300x300?text=Sin+Imagen'">
            <div class="product-info">
                <h3 class="product-name">${nombre}</h3>
                <p class="product-description">${descripcion}</p>
                <p class="product-price">$${formatPrice(precio)}</p>
                <p class="product-stock">Stock: ${stock} unidades</p>
            </div>
        </div>
    `;
}

// Formatear precio
function formatPrice(price) {
    return new Intl.NumberFormat('es-ES', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(price);
}

// Abrir modal de producto
function openProductModal(product) {
    const modal = document.getElementById('productModal');
    const attributes = product;

    // Actualizar información del modal
    document.getElementById('modalTitle').textContent = attributes.nombre || 'Sin nombre';
    document.getElementById('modalPrice').textContent = `$${formatPrice(attributes.precio || 0)}`;
    document.getElementById('modalDescription').textContent = attributes.descripcion || 'Sin descripción disponible';
    document.getElementById('modalStock').textContent = `Stock disponible: ${attributes.stock || 0} unidades`;

    // Actualizar imágenes
    updateModalImages(attributes.imagen);

    // Actualizar tallas
    updateModalSizes(attributes.tallas);

    // Configurar botón de WhatsApp
    const btnWhatsapp = document.getElementById('btnWhatsapp');
    btnWhatsapp.onclick = () => {
        const mensaje = `Hola! Estoy interesado en el producto: ${attributes.nombre} - $${formatPrice(attributes.precio)}`;
        const url = `https://wa.me/573232312340?text=${encodeURIComponent(mensaje)}`;
        window.open(url, '_blank');
    };

    // Configurar botón de agregar al carrito
    const btnAddCart = modal.querySelector('.btn-add-cart');
    btnAddCart.onclick = () => {
        addToCart(product);
    };

    modal.style.display = 'block';
}

// Actualizar imágenes del modal
function updateModalImages(imageData) {
    const mainImage = document.getElementById('modalMainImage');
    const thumbnailsContainer = document.getElementById('modalThumbnails');

    let images = [];

    // En Strapi 5, las imágenes vienen directamente como array
    if (imageData && Array.isArray(imageData) && imageData.length > 0) {
        images = imageData.map(img => {
            const url = img.url || '';
            return url.startsWith('http') ? url : `${UPLOADS_URL}${url}`;
        });
    }

    if (images.length === 0) {
        images = ['https://via.placeholder.com/400x400?text=Sin+Imagen'];
    }

    // Establecer imagen principal
    mainImage.src = images[0];
    mainImage.alt = 'Producto';
    mainImage.onerror = () => {
        mainImage.src = 'https://via.placeholder.com/400x400?text=Sin+Imagen';
    };

    // Crear miniaturas
    thumbnailsContainer.innerHTML = images.map((img, index) => `
        <img src="${img}" alt="Miniatura ${index + 1}" class="thumbnail ${index === 0 ? 'active' : ''}" 
             data-index="${index}" onerror="this.src='https://via.placeholder.com/80x80?text=Img'">
    `).join('');

    // Agregar event listeners a las miniaturas
    thumbnailsContainer.querySelectorAll('.thumbnail').forEach(thumb => {
        thumb.addEventListener('click', function() {
            const index = this.getAttribute('data-index');
            mainImage.src = images[index];
            
            thumbnailsContainer.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Actualizar tallas del modal
function updateModalSizes(tallasData) {
    const sizesContainer = document.querySelector('.sizes-container');
    
    // En Strapi 5, las tallas vienen directamente como array
    if (!tallasData || !Array.isArray(tallasData) || tallasData.length === 0) {
        sizesContainer.innerHTML = '<p style="color: #7f8c8d;">No hay tallas especificadas</p>';
        return;
    }
    
    sizesContainer.innerHTML = tallasData.map(talla => {
        const label = talla.label || 'N/A';
        return `<span class="size-badge">${label}</span>`;
    }).join('');
}

// Inicializar event listeners
function initializeEventListeners() {
    // Cerrar modal
    const modal = document.getElementById('productModal');
    const closeBtn = modal.querySelector('.close');
    
    closeBtn.onclick = () => {
        modal.style.display = 'none';
    };

    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };

    // Búsqueda
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');

    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // Filtros
    document.getElementById('sortFilter').addEventListener('change', applyFilters);
    document.getElementById('stockFilter').addEventListener('change', applyFilters);

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

// Realizar búsqueda
function performSearch() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    const filteredProducts = allProducts.filter(product => {
        const nombre = (product.nombre || '').toLowerCase();
        const descripcion = (product.descripcion || '').toLowerCase();
        
        return nombre.includes(searchTerm) || descripcion.includes(searchTerm);
    });

    displayProducts(filteredProducts);
}

// Aplicar filtros
function applyFilters() {
    const sortValue = document.getElementById('sortFilter').value;
    const stockValue = document.getElementById('stockFilter').value;

    let filteredProducts = [...allProducts];

    // Filtrar por stock
    if (stockValue === 'available') {
        filteredProducts = filteredProducts.filter(product => {
            return product.stock > 0 && product.activo !== false;
        });
    }

    // Ordenar
    if (sortValue === 'price-asc') {
        filteredProducts.sort((a, b) => {
            const priceA = parseFloat(a.precio) || 0;
            const priceB = parseFloat(b.precio) || 0;
            return priceA - priceB;
        });
    } else if (sortValue === 'price-desc') {
        filteredProducts.sort((a, b) => {
            const priceA = parseFloat(a.precio) || 0;
            const priceB = parseFloat(b.precio) || 0;
            return priceB - priceA;
        });
    } else if (sortValue === 'name') {
        filteredProducts.sort((a, b) => {
            const nameA = (a.nombre || '').toLowerCase();
            const nameB = (b.nombre || '').toLowerCase();
            return nameA.localeCompare(nameB);
        });
    }

    displayProducts(filteredProducts);
}

// Funciones del carrito
function addToCart(product) {
    const attributes = product;
    
    const cartItem = {
        id: product.id,
        nombre: attributes.nombre,
        precio: attributes.precio,
        cantidad: 1
    };

    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.cantidad++;
    } else {
        cart.push(cartItem);
    }

    updateCartCount();
    saveCartToStorage();
    
    // Mostrar mensaje de confirmación
    showNotification('Producto agregado al carrito ✓');
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.cantidad, 0);
    document.querySelector('.cart-count').textContent = totalItems;
}

function saveCartToStorage() {
    localStorage.setItem('shoesLuluCart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const savedCart = localStorage.getItem('shoesLuluCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
}

// Mostrar notificación
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #4ECDC4;
        color: white;
        padding: 1rem 2rem;
        border-radius: 12px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        z-index: 3000;
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 2000);
}

// Agregar animaciones CSS para las notificaciones
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
`;
document.head.appendChild(style);
