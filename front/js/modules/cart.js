import {
    getOneProduct
} from "./api.js";

const loadCart = function() {
    const arrayCart = JSON.parse(localStorage.getItem("cartLS"));

    return arrayCart ?? [];
}

const saveCart = function() {
    localStorage.setItem("cartLS", JSON.stringify(cart)); 
}

const findProductInCart = function(id, color) {
    return cart.find(item => item.productId === id && item.color === color);
}

const checkCartRules = function (productId, color, quantity) {
    if (!productId) {
        throw new Error("L'identifiant produit n'est pas valide");
    }

    if (!color) {
        throw new Error("Pas de couleur sélectionnée");
    }

    if (!quantity || parseInt(quantity, 10) <= 0) {
        throw new Error("La quantité n'est pas valide");
    }
}

const addProductToCart = function(productId, color, quantity) {
    checkCartRules(productId, color, quantity);

    const cartItem = findProductInCart(productId, color);

    if (!cartItem) {
        cart.push({
            productId,
            color,
            quantity: parseInt(quantity, 10)
        });
    } else {
        cartItem.quantity += Number(quantity);
    }

    saveCart();
}

const updateProductQuantityInCart = function(productId, color, quantity) {
    
    checkCartRules(productId, color, quantity);

    const cartItem = findProductInCart(productId, color);

    if (!cartItem) {
        throw new Error('Il faut que le produit existe dans le panier pour pouvoir changer sa quantité');
    }

    cartItem.quantity = Number(quantity);

    saveCart();
}

const removeProductFromCart = function(id, color) {
    const indexOfItemToDelete = cart.findIndex((element) => {
        return (
            element.productId === id &&
            element.color === color
        );
    });

    if (indexOfItemToDelete === -1) {
        throw new Error("Le produit ne peut pas être supprimé car il n'existe pas dans le panier");
    }

    cart.splice(indexOfItemToDelete, 1); 
    saveCart();
}

const getCartContent = async function() {
    const items = Array.from(cart);
    let total = Number(0);

    for(const index in items){
        const item = items[index];
        const { name, price, imageUrl, altTxt } = await getOneProduct(item.productId);

        items[index] = {
            ...item,
            name,
            price,
            imageUrl,
            altTxt,
        };

        total += Number(item.quantity) * price;
    }

    return { items, total };
}

const cart = loadCart();

export  { addProductToCart, updateProductQuantityInCart, removeProductFromCart, getCartContent }