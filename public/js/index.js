const socket = io();

function $(selector) {
    return document.querySelector(selector);
}


socket.on('statusError', data => {
    console.error(data);
    alert(`❌ Error: ${data}`);
});


socket.on('publishProducts', data => {
    const container = $('.products-box');
    container.innerHTML = '';

    if (!Array.isArray(data)) {
        container.innerHTML = '<p>No se pudieron cargar los productos.</p>';
        return;
    }

    let html = '';
    data.forEach(product => {
        html += `
            <div class="product-card">
                <h3>${product.title}</h3>
                <hr>
                <p><strong>Categoría:</strong> ${product.category}</p>
                <p><strong>Descripción:</strong> ${product.description}</p>
                <p><strong>Precio:</strong> $ ${product.price}</p>
                <button onclick="deleteProduct('${product._id}')">🗑 Eliminar</button>
            </div>
        `;
    });

    container.innerHTML = html;
});


function createProduct(event) {
    event.preventDefault();

    const newProduct = {
        title: $('#title').value.trim(),
        description: $('#description').value.trim(),
        code: $('#code').value.trim(),
        price: parseFloat($('#price').value),
        stock: parseInt($('#stock').value),
        category: $('#category').value.trim()
    };

   
    if (!newProduct.title || !newProduct.description || !newProduct.code || isNaN(newProduct.price) || isNaN(newProduct.stock) || !newProduct.category) {
        alert('⚠️ Todos los campos son obligatorios y deben tener valores válidos.');
        return;
    }

    cleanForm();
    socket.emit('createProduct', newProduct);
}


function deleteProduct(pid) {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
        socket.emit('deleteProduct', { pid });
    }
}


function cleanForm() {
    $('#title').value = '';
    $('#description').value = '';
    $('#code').value = '';
    $('#price').value = '';
    $('#stock').value = '';
    $('#category').value = '';
}
