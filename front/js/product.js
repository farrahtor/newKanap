//Récupération de l'id via les paramètres de l'url
const productId = new URLSearchParams(window.location.search).get("id");

let pageTitle = document.title;
let productImg = document.querySelector(".item__img");
let productTitle = document.getElementById("title");
let productPrice = document.getElementById("price");
let productdescription = document.getElementById("description");
let selectColors = document.querySelector("#colors");

//Récupération du produit grace a son id
async function getProduct() {
  let response = await fetch("http://localhost:3000/api/products/" + productId);
  const productData = await response.json();

  // Repartition des data produits dans le DOM
  //Titre de la page
  document.title = productData.name;
  // img
  productImg.innerHTML = `<img src="${productData.imageUrl}" alt="${productData.altTxt}">`;
  // title
  productTitle.innerHTML = productData.name;
  //Price
  productPrice.innerHTML = productData.price;
  // description
  productdescription.innerHTML = productData.description;
  // option couleur
  productData.colors.forEach((colors) => {
    let optionColors = document.createElement("option");
    selectColors.appendChild(optionColors);
    optionColors.value = colors;
    optionColors.innerHTML = colors;
  });
}
getProduct();

//Ajout un produit au panier

document.getElementById("addToCart").onclick = (data) => {
  // recuperation et validité des valeur color et quantity
  const color = selectColors.value;
  const quantity = document.getElementById("quantity").value;
  if (color == "") {
    alert("Veuillez choisir une couleur");
    return;
  }
  if (quantity == 0 || quantity > 100) {
    alert("Veuillez choisir la quantité comprise entre 1 et 100");
    return;
  }
  let productSave = {
    _id: productId,
    color: color,
    quantity: parseInt(quantity),
  };
  function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  function getCart() {
    let cart = localStorage.getItem("cart");
    if (cart == null) {
      return [];
    } else {
      return JSON.parse(cart);
    }
  }

  function addCart(product) {
    let cart = getCart();
    let foundProduct = cart.find(
      (p) => p._id == product._id && p.color == product.color
    );
    if (foundProduct != undefined) {
      product.quantity = parseInt(quantity);
      foundProduct.quantity += parseInt(quantity);
    } else {
      cart.push(product);
    }

    saveCart(cart);
  }
  addCart(productSave);
};
