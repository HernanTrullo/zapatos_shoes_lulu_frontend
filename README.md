# Página Web - Zapatos Shoes Lulu

Sitio web de visualización para el catálogo de zapatos conectado a la API de Strapi.

## 🚀 Características

- ✅ Diseño moderno y responsive
- ✅ Catálogo de productos dinámico
- ✅ Sistema de búsqueda y filtros
- ✅ Modal de detalles de producto
- ✅ Galería de imágenes
- ✅ Carrito de compras (localStorage)
- ✅ Integración con WhatsApp
- ✅ Animaciones suaves

## 📋 Tecnologías Utilizadas

- HTML5
- CSS3 (Grid, Flexbox, Animaciones)
- JavaScript ES6+ (Fetch API, async/await)
- API REST de Strapi

## 🔧 Configuración

### API Endpoint
La página está configurada para conectarse a:
```
https://zapatos-shoes-lulu.onrender.com/api
```

### Estructura de la API
- **Zapatos**: `/api/zapatoes?populate=*`
- **Tallas**: `/api/tallas`

## 📂 Estructura de Archivos

```
pagina_web/
├── index.html       # Estructura principal
├── styles.css       # Estilos y diseño
├── script.js        # Lógica y funcionalidades
└── README.md        # Este archivo
```

## 🌐 Cómo Usar

### Opción 1: Abrir directamente
1. Abre el archivo `index.html` en tu navegador web

### Opción 2: Servidor local
```bash
# Con Python 3
python -m http.server 8000

# Con Node.js (npx)
npx serve

# Con PHP
php -S localhost:8000
```

Luego abre `http://localhost:8000` en tu navegador.

## 📱 Funcionalidades

### Catálogo
- Visualización de todos los productos en tarjetas
- Imágenes, nombre, descripción, precio y stock
- Indicador de disponibilidad

### Búsqueda y Filtros
- Búsqueda por nombre o descripción
- Filtro por disponibilidad (en stock)
- Ordenar por:
  - Precio: menor a mayor
  - Precio: mayor a menor
  - Nombre alfabético

### Modal de Producto
- Galería de imágenes con miniaturas
- Descripción completa
- Información de stock
- Tallas disponibles
- Agregar al carrito
- Consulta por WhatsApp

### Carrito de Compras
- Contador en el header
- Almacenamiento local (persistente)
- Notificaciones al agregar productos

## 🎨 Personalización

### Colores
Edita las variables CSS en `styles.css`:
```css
:root {
    --primary-color: #FF6B6B;
    --secondary-color: #4ECDC4;
    --accent-color: #FFE66D;
    --dark-color: #2C3E50;
    --light-color: #ECF0F1;
}
```

### WhatsApp
Cambia el número de WhatsApp en `script.js`:
```javascript
const url = `https://wa.me/TU_NUMERO?text=${encodeURIComponent(mensaje)}`;
```

## 📱 Responsive

La página es completamente responsive y se adapta a:
- 📱 Móviles (< 480px)
- 📱 Tablets (< 768px)
- 💻 Escritorio (> 768px)

## 🔄 Actualizaciones Futuras

- [ ] Carrito de compras completo con checkout
- [ ] Sistema de favoritos
- [ ] Filtros avanzados por talla y precio
- [ ] Comparador de productos
- [ ] Sistema de reseñas
- [ ] Integración con pasarelas de pago

## 🐛 Solución de Problemas

### Los productos no cargan
1. Verifica que el servidor de Strapi esté activo
2. Abre la consola del navegador (F12) para ver errores
3. Verifica la URL del API en `script.js`

### Las imágenes no se muestran
1. Asegúrate de que los productos tengan imágenes cargadas en Strapi
2. Verifica que las URLs sean correctas
3. Revisa la configuración de CORS en Strapi

### CORS Error
Si ves errores de CORS, asegúrate de que Strapi tenga configurado el middleware de CORS correctamente en `config/middlewares.ts`

## 📄 Licencia

Este proyecto es parte de Zapatos Shoes Lulu.

## 👥 Contacto

Para más información o soporte, contacta con el equipo de Shoes Lulu.
