
showButtonCart();

async function addToCart(pid) {
    try {
        let cartId = localStorage.getItem('cartId');

        if (!cartId) {
            const createCartResponse = await fetch('/api/carts', {
                method: 'POST'
            });

            const createCart = await createCartResponse.json();

            if (createCart.status === 'error') {
                return alert(createCart.message);
            }

            cartId = createCart.payload._id;
            localStorage.setItem('cartId', cartId);
        }

       
        const addProductResponse = await fetch(`/api/carts/${cartId}/product/${pid}`, {
            method: 'POST'
        });

        const addProduct = await addProductResponse.json();

        if (addProduct.status === 'error') {
            return alert(addProduct.message);
        }

        showButtonCart();

        alert('Producto añadido satisfactoriamente!');
    } catch (error) {
        console.error('Error en addToCart:', error);
        alert('Error inesperado al añadir producto.');
    }
}

function showButtonCart() {
    const cartId = localStorage.getItem('cartId');

    if (cartId) {
        const buttonCart = document.querySelector('#button-cart');
        if (buttonCart) {
            buttonCart.setAttribute("href", `/cart/${cartId}`);
        }
        const viewCart = document.querySelector('.view-cart');
        if (viewCart) {
            viewCart.style.display = "block";
        }
    } else {

        const viewCart = document.querySelector('.view-cart');
        if (viewCart) {
            viewCart.style.display = "none";
        }
    }
}
