import { getOneProduct } from './modules/api.js';
import { addProductToCart } from './modules/cart.js';

function buildProductHtml(product) {
    // Création d'une balise img manquante
    const img = document.createElement("img");

    img.src = product.imageUrl;
    img.alt = product.altTxt;

    document.getElementsByClassName("item__img")[0].appendChild(img);
    document.getElementById("title").innerText = product.name;
    document.getElementById("price").innerText = product.price + " ";
    document.getElementById("description").innerText = product.description;

    for (const color of product.colors) {
        // Création d'une balise option manquante
        const option = document.createElement("option");

        option.value = color;
        option.innerText = color;
 
        document.getElementById("colors").appendChild(option);
    }
}

function getProductIdFromUrl() {
    const url = new URL(document.URL);
    const id = url.searchParams.get("id");

    if (!id) throw new Error('No ID from URL');

    return id;
}

async function init() {
    try {
        const id = getProductIdFromUrl();
        const product = await getOneProduct(id);
        buildProductHtml(product);
    } catch (error) {
        alert('Impossible de procéder à la récupération des données produits');
        console.error(error);
    }

    //Sélection du bouton Ajouter au panier puis...Ecoute du bouton Panier pour envoyer les choix de l'utilisateur
    document.querySelector("#addToCart").addEventListener("click", addToCart);
}

function getColorSelected(){
    return document.querySelector("#colors").value;
}

function getQuantitySelected(){
    return document.querySelector("#quantity").value;
}

function addToCart() {
    //Recuperation des informations du produit
    const productId = getProductIdFromUrl();
    const color = getColorSelected();
    const quantity = getQuantitySelected();

    try {
        addProductToCart(productId, color, quantity);
        alert('Le produit a bien été ajouté au panier');
    } catch (error) {
        alert(error);
        console.error(error);
    }

}

init();