import { getListProducts } from "./modules/api.js";

const section = document.querySelector("#items");
const template = document.querySelector('#productTpl');

function buildProductHtml(product) {
    //on créé un clone du template
    const clone = template.content.cloneNode(true);

    //on modifie le lien du produit
    const a = clone.querySelector("a");
    a.setAttribute("href", `./product.html?id=${product._id}`);
    //on modifie l'image du produit
    const img = clone.querySelector("img");
    img.src = product.imageUrl;
    img.alt = product.altTxt;

    //on modifie le h3 du produit
    const h3 = clone.querySelector("h3");
    h3.innerText = product.name;

    //on modifie la description du produit
    const p = clone.querySelector("p");
    p.innerText = product.description;

    //Ajout du template produit comme fils de la balise section
    section.appendChild(clone);
}

async function init() {
    //Appel à la fonction getListProducts pour récupérer la liste des produits sur la page d'accueil
    const products = await getListProducts();

    for (const product of products) {
        buildProductHtml(product);
    }
}

init();