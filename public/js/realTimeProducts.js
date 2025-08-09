const socket = io();


socket.on('publishProducts', (products) => {
  renderProducts(products);
});

socket.on('statusError', (message) => {
  alert('Error: ' + message);
});


function renderProducts(products) {
  const container = document.getElementById('productsContainer');
  if (!container) return;

  container.innerHTML = '';

  products.forEach(product => {
    const div = document.createElement('div');
    div.classList.add('product-item');

    
    const titleEl = document.createElement('h3');
    titleEl.textContent = product.title;

    const priceEl = document.createElement('p');
    priceEl.textContent = `Precio: $${product.price}`;

    const categoryEl = document.createElement('p');
    categoryEl.textContent = `Categoría: ${product.category}`;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Eliminar';
    deleteBtn.onclick = () => deleteProduct(product._id);

    div.appendChild(titleEl);
    div.appendChild(priceEl);
    div.appendChild(categoryEl);
    div.appendChild(deleteBtn);

    container.appendChild(div);
  });
}

async function createProduct() {
  const titleInput = document.getElementById('titleInput');
  const priceInput = document.getElementById('priceInput');
  const categoryInput = document.getElementById('categoryInput');

  const title = titleInput.value.trim();
  const price = parseFloat(priceInput.value);
  const category = categoryInput.value.trim();

  if (!title || isNaN(price) || !category) {
    return alert('Por favor completa todos los campos correctamente.');
  }

  const newProduct = { title, price, category };
  socket.emit('createProduct', newProduct);


  titleInput.value = '';
  priceInput.value = '';
  categoryInput.value = '';
}

function deleteProduct(pid) {
  if (confirm('¿Estás seguro de eliminar este producto?')) {
    socket.emit('deleteProduct', { pid });
  }
}

async function loadInitialProducts() {
  try {
    const res = await fetch('/api/products');
    const data = await res.json();

    if (data.status === 'success') {
      const products = data.payload.docs || data.payload;
      renderProducts(products);
    } else {
      alert('Error cargando productos: ' + data.message);
    }
  } catch (error) {
    console.error('❌ Error cargando productos iniciales:', error);
    alert('Error cargando productos iniciales');
  }
}


loadInitialProducts();
