 document.addEventListener('DOMContentLoaded', () => {
  getMenuOfDayServer();
  getMenu();
});

  const toggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');

  const urlMenuOfDay = 'https://gist.githubusercontent.com/christianya93/8a02357582693fe92012d9be87748480/raw/bfd572c728dbf8fded2b8c02a8f2cff4466a7823/menuOfDay.json';
  const urlMenu = 'https://gist.githubusercontent.com/christianya93/3342f914fe69ecda635bc93feff6c832/raw/5e8df7ccc25c33c9a3b670709fbc216a3bda127f/menuItems.json';

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
        <p class="price">${menu.price}</p>
        <button class="btn-add">${menu.addToCart}</button>
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
      ? `<button class="btn-add" data-product="${item.name}">+</button>`
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

// Eventos de click en "+"
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-add")) {
    const product = e.target.dataset.product;
    alert(`Producto añadido: ${product}`);
  }
});

