import {
    getOneProduct,
    makeOrder
} from "./modules/api.js";
import {
    addProductToCart,
    removeProductFromCart,
    updateProductQuantityInCart,
    getCartContent
} from "./modules/cart.js";

const section = document.querySelector("#cart__items");
const template = document.querySelector('#cartItem');
const form = document.querySelector('.cart__order__form');
const order_button = form.querySelector("#order");
// content of the cart with product info at time T
let cart;

function buildItemCartHtml(cartItem) {
    //on créé un clone du template
    const clone = template.content.cloneNode(true);

    //on modifie l'article d'un item
    const article = clone.querySelector("article");
    article.setAttribute("data-id", cartItem.productId);
    article.setAttribute("data-color", cartItem.color);

    //on modifie l'image du produit
    const img = article.querySelector("img");
    img.src = cartItem.imageUrl;
    img.alt = cartItem.altTxt;

    //on modifie le h2 du produit
    const h2 = article.querySelector("h2");
    h2.innerText = cartItem.name;

    //on modifie la description du produit
    const p = article.querySelectorAll("p");
    p[0].innerText = cartItem.color;
    p[1].innerText = cartItem.price + "€";

    //on modifie le h2 du produit
    const input = article.querySelector("input");
    input.value = cartItem.quantity;

    //on attache les évènements métiers requis
    article.querySelector('.itemQuantity').addEventListener('change', onUpdateQuantity);
    article.querySelector('.deleteItem').addEventListener('click', onDeleteItem);

    //Ajout du template produit comme fils de la balise section
    section.appendChild(article);
}

function buildItemsHtml(cart) {
    for (const item of cart.items)
        buildItemCartHtml(item);
}

function buildTotalHtml(cart) {
    const totalQuantity = document.getElementById("totalQuantity");
    totalQuantity.innerText = cart.items.length === 1 ? cart.items.length + " article" : cart.items.length + " articles";

    const totalPrice = document.getElementById("totalPrice");
    totalPrice.innerText = cart.total;
}

function onUpdateQuantity(event) {

    const articleElement = event.target.closest('article');

    const productId = articleElement.dataset.id;
    const color = articleElement.dataset.color;
    const quantity = event.target.value;

    updateProductQuantityInCart(productId, color, quantity);
    rebuildTotalHtml();
}

function onDeleteItem(event) {
    const articleElement = event.target.closest('article');

    const productId = articleElement.dataset.id;
    const color = articleElement.dataset.color;

    try {
        removeProductFromCart(productId, color);
        articleElement.remove();
        rebuildTotalHtml();
    } catch (error) {
        console.error(error);
        alert(error);
    }
}

async function rebuildTotalHtml() {
    cart = await getCartContent();
    buildTotalHtml(cart);
}

function registerEventsForForm() {
    form.addEventListener('submit', sendOrder);
    order_button.addEventListener('click', sendOrder);
    form.querySelector("#firstName").addEventListener("input", evt => verifyFormInput(evt.target.name, evt.target.value));
    form.querySelector("#lastName").addEventListener("input", evt => verifyFormInput(evt.target.name, evt.target.value));
    form.querySelector("#address").addEventListener("input", evt => verifyFormInput(evt.target.name, evt.target.value));
    form.querySelector("#city").addEventListener("input", evt => verifyFormInput(evt.target.name, evt.target.value));
    form.querySelector("#email").addEventListener("input", evt => verifyFormInput(evt.target.name, evt.target.value));
}

function verifyFormInput(name, value) {
    let errorMessage = "";
    let regex;
    let isValid = false;

    switch (name) {
        case 'firstName':
            regex = /[`!@#$%^&*()_+\=\[\]{};':"\\|,.<>\/?~\d+]/;
            errorMessage = "Veuillez renseigner uniquement des lettres, espaces et -";
            isValid = !regex.test(value);
            break;
        case 'lastName':
            regex = /[`!@#$%^&*()_+\=\[\]{};':"\\|,.<>\/?~\d+]/;
            errorMessage = "Veuillez renseigner uniquement des lettres, espaces et -";
            isValid = !regex.test(value);
            break;
        case 'address':
            regex = /[`!@#$%^&*()_+\=\[\]{};':"\\|,.<>\/?~]/;
            errorMessage = "Veuillez renseigner uniquement des lettres, des chiffres, espaces et -";
            isValid = !regex.test(value);
            break;
        case 'city':
            regex = /[`!@#$%^&*()_+\=\[\]{};':"\\|,.<>\/?~\d+]/;
            errorMessage = "Veuillez renseigner uniquement des lettres, espaces et -";
            isValid = !regex.test(value);
            break;
        case 'email':
            regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            errorMessage = "Veuillez renseigner une adresse mail valide";
            isValid = regex.test(value);
            break;
        default:
            return false;
    }

    form.querySelector(`#${name}ErrorMsg`).innerText = isValid ? "" : errorMessage;

    return isValid;
}

async function sendOrder(event) {
    // On désactive le comportement de base navigateur
    event.preventDefault();

    const formData = new FormData(form);

    let isFormValid = true;

    for (const entry of formData.entries()) {
        if (!verifyFormInput(entry[0], entry[1])) {
            isFormValid = false;
        }
    }

    if (!isFormValid) {
        return;
    }

    let contact = {};

    for (const entry of formData.entries()) {
        contact[entry[0]] = entry[1];
    }

    const orderId = await makeOrder(contact, cart.items);
    
    // TODO redirect sur la page confirmation en passant l'orderId en paramètre de l'URL
    document.location.href = `./confirmation.html?orderId=${orderId}`; 
}

async function init() {
    cart = await getCartContent();

    buildItemsHtml(cart);
    buildTotalHtml(cart);
    registerEventsForForm();
}

init();