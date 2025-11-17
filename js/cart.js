document.addEventListener("DOMContentLoaded", loadCart);

function loadCart() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const container = document.getElementById("cart-items");
  const totalEl = document.getElementById("cart-total");

  container.innerHTML = "";

  if (cart.length === 0) {
    container.innerHTML = `<p>Your cart is empty.</p>`;
    totalEl.textContent = "Total: $0";
    return;
  }

  let total = 0;

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    container.innerHTML += `
      <div class="cart-item">
        <img src="${item.img}" alt="${item.name}">
        <div>
          <h3>${item.name}</h3>
          <p>Price: $${item.price.toLocaleString("es-CO")}</p>
          <p>Amount: 
            <button class="qty-btn" onclick="changeQty(${index}, -1)">-</button>
            ${item.quantity}
            <button class="qty-btn" onclick="changeQty(${index}, 1)">+</button>
          </p>
          <p>Total: $${itemTotal.toLocaleString("es-CO")}</p>
        </div>

        <button class="delete-btn" onclick="deleteItem(${index})">Eliminate</button>
      </div>
    `;
  });

  totalEl.textContent = `Total: $${total.toLocaleString("es-CO")}`;
}

function changeQty(i, amount) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart[i].quantity += amount;

  if (cart[i].quantity <= 0) cart.splice(i, 1);

  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
}

function deleteItem(i) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(i, 1);

  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
}

document.getElementById("finish-order").addEventListener("click", () => {
  alert("Thank you for your purchase.");
  localStorage.removeItem("cart");
  window.location.href = "index.html";
});
