// public/js/realTimeProducts.js

const socket = io();

// Escuchar la lista actualizada de productos desde el servidor
socket.on('publishProducts', (products) => {
  renderProducts(products);
});

// Mostrar error si ocurre
socket.on('statusError', (message) => {
  alert('Error: ' + message);
});

// Función para renderizar productos en el contenedor
function renderProducts(products) {
  const container = document.getElementById('productsContainer');
  if (!container) return;

  container.innerHTML = ''; // limpio el contenedor

  products.forEach(product => {
    const div = document.createElement('div');
    div.classList.add('product-item');
    div.innerHTML = `
      <h3>${product.title}</h3>
      <p>Precio: $${product.price}</p>
      <p>Categoría: ${product.category}</p>
      <button onclick="deleteProduct('${product._id}')">Eliminar</button>
    `;
    container.appendChild(div);
  });
}

// Función para crear un producto nuevo (debe llamar desde un formulario)
async function createProduct() {
  const title = document.getElementById('titleInput').value.trim();
  const price = parseFloat(document.getElementById('priceInput').value);
  const category = document.getElementById('categoryInput').value.trim();

  if (!title || !price || !category) {
    return alert('Por favor completa todos los campos.');
  }

  const newProduct = { title, price, category };

  socket.emit('createProduct', newProduct);

  // Opcional: limpiar campos
  document.getElementById('titleInput').value = '';
  document.getElementById('priceInput').value = '';
  document.getElementById('categoryInput').value = '';
}

// Función para eliminar un producto por id
function deleteProduct(pid) {
  if (confirm('¿Estás seguro de eliminar este producto?')) {
    socket.emit('deleteProduct', { pid });
  }
}

// Al cargar la página, pedir productos actuales (puede hacerse con fetch o por socket)
// Aquí hacemos un fetch para obtener la lista inicial:
async function loadInitialProducts() {
  try {
    const res = await fetch('/api/products');
    const data = await res.json();
    if (data.status === 'success') {
      renderProducts(data.payload.docs || data.payload);
    } else {
      alert('Error cargando productos: ' + data.message);
    }
  } catch (error) {
    console.error('Error cargando productos:', error);
  }
}

// Ejecutar al iniciar
loadInitialProducts();
