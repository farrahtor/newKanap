const urlApi = "http://localhost:3000/api/products";
//récupération de tout les produits
getAllProducts();
function getAllProducts() {
  fetch(urlApi)
    .then((response) => response.json())
    .then((products) => {
      console.log(products);

      const sectionItems = document.getElementById("items");
      //repartition des produits dans le dom section items
      for (let product of products) {
        const productCard = `<a href="./product.html?id=${product._id}">
          <article>
            <img src="${product.imageUrl}" alt="${product.altTxt}">
            <h3 class="productName">${product.name}</h3>
            <p class="productDescription">${product.description}</p>
          </article>
        </a>`;
        sectionItems.innerHTML += productCard;
      }
    })
    .catch((err) => {
      console.log(err);
    });
}
