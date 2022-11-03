// recupérer le panier ds localstorage

// recupérer le panier depuis le local storage
async function getCartInLocalStorage() {
  let cartInLocalStorage = await JSON.parse(localStorage.getItem("cart"));
  if (cartInLocalStorage == null) {
    cartInLocalStorage = [];
    document.querySelector("h1").innerHTML = `Votre Panier est vide`;
  }
  return cartInLocalStorage;
}
// Récuperer les produits depuis l'APi
async function getDataProduct() {
  let response = await fetch("http://localhost:3000/api/products/");
  const productData = await response.json();
  return productData;
}

// Récuprer les details du produit présent dans le panier depuis l'api
// les mettre dans un nouveau tableau
async function getCartProduct() {
  let data = await getDataProduct();
  let cartInLocalStorage = await getCartInLocalStorage();
  let productDisplay = [];

  for (let product of cartInLocalStorage) {
    let foundProduct = data.find((p) => p._id == product._id);

    if (foundProduct) {
      product.name = foundProduct.name;
      product.imageUrl = foundProduct.imageUrl;
      product.altTxt = foundProduct.altTxt;
      product.price = foundProduct.price;
      productDisplay.push(product);
    }
  }
  return productDisplay;
}
// afficher les produits + total
async function cartDisplay() {
  const productDisplay = await getCartProduct();

  // //afficher les produit
  const cartItems = document.getElementById("cart__items");
  for (let product of productDisplay) {
    cartItems.innerHTML += `<article class="cart__item" data-id="${
      product._id
    }" data-color="${product.color}">
    <div class="cart__item__img">
      <img src="${product.imageUrl}" alt="${product.altTxt}">
    </div>
    <div class="cart__item__content">
      <div class="cart__item__content__description">
        <h2>${product.name}</h2>
        <p>${product.color}</p>
        <p>${product.price * product.quantity}</p>
      </div>
      <div class="cart__item__content__settings">
        <div class="cart__item__content__settings__quantity">
          <p>Qté : </p>
          <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${
            product.quantity
          }">
        </div>
        <div class="cart__item__content__settings__delete">
          <p class="deleteItem">Supprimer</p>
        </div>
      </div>
    </div>
  </article>`;
  }

  // //afficher quantité et prix total
  let sumQuantity = 0;
  let sumPrice = 0;
  function cartTotal() {
    for (let product of productDisplay) {
      sumQuantity += parseInt(product.quantity);
      sumPrice += product.price * product.quantity;
    }
    document.getElementById("totalQuantity").innerText = sumQuantity;
    document.getElementById("totalPrice").innerText = sumPrice;
  }

  cartTotal();
  changeQuantity();
}
console.log();
cartDisplay();

//Modifier la quantité de produit
async function changeQuantity() {
  let cartInLocalStorage = await getCartInLocalStorage();
  // let productDisplay = await getCartProduct();
  const inputQuantity = document.querySelectorAll(".itemQuantity");
  for (let input of inputQuantity) {
    input.addEventListener("change", (e) => {
      const productData = input.closest("article");
      const priceDisplay = document.querySelectorAll(
        ".cart__item__content__description p:last-child"
      );
      let newValue = parseInt(e.target.value);
      input.innerText = newValue;

      // enregistré la nouvelle quantité dans le localStorage
      for (let product of cartInLocalStorage) {
        if (
          product._id == productData.dataset.id &&
          product.color == productData.dataset.color
        ) {
          product.quantity = newValue;
          localStorage.setItem("cart", JSON.stringify(cartInLocalStorage));
        }
      }
      // changer le prix
      newPrice(newValue, productData);
      console.log();
      // document.querySelector(
      //   ".cart__item__content__description p:last-child"
      // ).innerText = price.response;
      // window.location.href = "cart.html";
      // location.reload();
      //modifier le prix du produit
    });
  }
}
console.log();
async function newPrice(newValue, productData) {
  let productDisplay = await getCartProduct();
  const priceDisplay = document.querySelectorAll(
    ".cart__item__content__description p:last-child"
  );

  for (let product of productDisplay) {
    if (product._id == productData.dataset.id) {
      console.log(product.price);
      let productPrice = product.price * newValue;
      console.log();
      for (let price of priceDisplay) {
        const pPrice = price.closest("article");
        console.log(pPrice.dataset.id);
        price.innerText = productPrice;
      }
    }
  }

  console.log();
}
