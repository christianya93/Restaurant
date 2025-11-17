 document.addEventListener('DOMContentLoaded', () => {
  getMenuOfDayServer();
  getMenu();
});

 const btnShoppingCart = document.getElementById('cart-btn');


  const toggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');

  const urlMenuOfDay = 'https://gist.githubusercontent.com/christianya93/8a02357582693fe92012d9be87748480/raw/076257ce9f7702da57e90f32c5dc6784341e3784/menuOfDay.json';
  const urlMenu = 'https://gist.githubusercontent.com/christianya93/3342f914fe69ecda635bc93feff6c832/raw/5e8df7ccc25c33c9a3b670709fbc216a3bda127f/menuItems.json';

  // --- POPUP ELEMENTS ---
  const popup = document.getElementById("popup");
  const popImg = document.getElementById("popup-img");
  const popName = document.getElementById("popup-name");
  const popPrice = document.getElementById("popup-price");
  const btnContinue = document.getElementById("continue-btn");
  const btnCheckout = document.getElementById("checkout-btn");

  btnShoppingCart.addEventListener('click', () => {
   window.location.href = 'shoppingCart.html';
 });

  toggle.addEventListener('click', () => {
    navLinks.classList.toggle('show');
    toggle.textContent = navLinks.classList.contains('show') ? '✖' : '☰';
  });

  function renderMenuOfDay(menuOfDay) {
    const specialtiesContainer = document.querySelector('.specialtiesContainer');

    menuOfDay?.results?.forEach((menu) => {
      const menuCard = document.createElement('article');
      menuCard.classList.add('specialty');
      menuCard.innerHTML = `
        <img class="img-card" src="${menu.imageSrc}" alt="${menu.imageAlt}">
        <h3 >${menu.title}</h3>
        <p >${menu.description}</p>
        <p class="price">$${menu.price}</p>
        <button class="btn-add"
          data-name="${menu.title}"
          data-price="${menu.price}"
          data-img="${menu.imageSrc}">${menu.addToCart}
        </button>
      `;
      specialtiesContainer.appendChild(menuCard);
    });
  }

  async function getMenuOfDayServer() {
    try { 
      const response = await fetch(urlMenuOfDay);
      const menuOfDay = await response.json();
      renderMenuOfDay(menuOfDay);   
    } catch (error) {
      console.error('Error fetching menu of the day:', error);
    }
  }  




async function getMenu() {
  try {
    const response = await fetch(urlMenu);
    const data = await response.json();

    // Acceder al array real
    const menuItems = data.menuItems;

    renderMenu(menuItems);

  } catch (error) {
    console.error("Error cargando el menú:", error);
  }
}


function renderMenu(menuItems) {

  const tableBody = document.querySelector("#menu table tbody");
  tableBody.innerHTML = "";

  let currentCategory = "";

  menuItems.forEach(item => {

    // agregar título de la categoría
    if (item.category !== currentCategory) {
      currentCategory = item.category;

      tableBody.innerHTML += `
        <tr>
          <th scope="rowgroup" colspan="3">${currentCategory}</th>
        </tr>
      `;
    }

    // botón dinámico
    const buttonHTML = item.addToCart
      ? `<button class="btn-add"
          data-name="${item.name}"
          data-price="${item.price}"
          data-img="${item.img}">${item.addToCart}
        </button>`
      : `<span style="color:gray; font-size: 0.9rem;">N/A</span>`;

    // agregar fila del producto
    tableBody.innerHTML += `
      <tr>
        <td>
          <img src="${item.img}" alt="${item.name}" width="100"><br>
          ${item.name}
        </td>
        <td>${item.description}</td>
        <td>
          $${item.price.toLocaleString("es-CO")}
          <br>
          ${buttonHTML}
        </td>
      </tr>
    `;
  });
}

// Evento general para todos los botones "add-cart" o "btn-add"
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-add")) {

    const name = e.target.dataset.name;
    const price = e.target.dataset.price;
    const img = e.target.dataset.img;

    // Colocar info del producto en el popup
    popImg.src = img;
    popName.textContent = name;
    popPrice.textContent = "Precio: " + price;

    // Mostrar popup
    popup.style.display = "flex";

    addToCart({ name, price, img });

  }
});

// Botón "Seguir comprando"
btnContinue.addEventListener("click", () => {
  popup.style.display = "none";
});

// Botón "Proceder a compra"
btnCheckout.addEventListener("click", () => {
  window.location.href = "shoppingCart.html"; // Cambia por tu página del carrito
});

// Cerrar popup al hacer clic afuera
popup.addEventListener("click", (e) => {
  if (e.target === popup) {
    popup.style.display = "none";
  }
});


// --- CARRITO EN LOCALSTORAGE ---
function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Buscar si ya existe el producto
  const existing = cart.find(item => item.name === product.name);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({
      name: product.name,
      price: Number(product.price),
      img: product.img,
      quantity: 1
    });
  }

  // Guardar en localStorage
  localStorage.setItem("cart", JSON.stringify(cart));

  // Actualizar contador
  updateCartCount();
}

function updateCartCount() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const count = cart.reduce((acc, item) => acc + item.quantity, 0);
  document.getElementById("cart-count").textContent = count;
}

// Cargar contador al iniciar
document.addEventListener("DOMContentLoaded", updateCartCount);
