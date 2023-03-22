const apiUrl = "http://localhost:3000/api/products/"

async function fetchApi(fullUrl) {
    const response = await fetch(fullUrl);
    return response.json();
}

async function fetchApiPost(fullUrl, object) {
    const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(object)
    });
    return response.json();
}

async function getListProducts() {
    return fetchApi(apiUrl);
}

async function getOneProduct(productId) {
    return fetchApi(apiUrl + productId);
}

async function makeOrder(contact, arrayProduct) {
    const products = arrayProduct.map(({ productId }) => productId);
    const content = await fetchApiPost('http://localhost:3000/api/products/order', {contact, products});

    return content.orderId;
}

export { getListProducts, getOneProduct, makeOrder };