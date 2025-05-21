let cart = [];

// Scroll to Products Section
function scrollToProducts() {
  document.getElementById("products").scrollIntoView({ behavior: "smooth" });
}

// Fetch Products from Backend
async function loadProducts() {
  const container = document.getElementById('product-container');
  try {
    const res = await fetch('http://localhost:5000/api/products');
    const products = await res.json();

    products.forEach(product => {
      const card = document.createElement('div');
      card.className = 'product-card';

      card.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <div class="info">
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <div class="price">$${product.price.toFixed(2)}</div>
          <button onclick='addToCart(${JSON.stringify(product)})'>Add to Cart</button>
        </div>
      `;

      container.appendChild(card);
    });
  } catch (err) {
    container.innerHTML = "<p>Unable to load products.</p>";
    console.error("Error loading products:", err);
  }
}

// Add to Cart
function addToCart(product) {
  const index = cart.findIndex(item => item._id === product._id);
  if (index > -1) {
    cart[index].quantity += 1;
  } else {
    product.quantity = 1;
    cart.push(product);
  }
  renderCart();
}

// Remove from Cart
function removeFromCart(productId) {
  cart = cart.filter(item => item._id !== productId);
  renderCart();
}

// Update Cart Display
function renderCart() {
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");

  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML = "<p>Your cart is empty.</p>";
    cartTotal.textContent = "";
    return;
  }

  let total = 0;

  cart.forEach(item => {
    const div = document.createElement("div");
    div.className = "cart-item";

    total += item.price * item.quantity;

    div.innerHTML = `
      <div>
        <h4>${item.name}</h4>
        <p>$${item.price.toFixed(2)} × ${item.quantity}</p>
      </div>
      <div>
        <button onclick="removeFromCart('${item._id}')" style="background-color:#ff4d4d; color:white; border:none; padding:5px 10px; border-radius:4px;">Remove</button>
      </div>
    `;

    cartItems.appendChild(div);
  });

  cartTotal.textContent = `Total: $${total.toFixed(2)}`;
}

// Checkout Placeholder
function checkout() {
  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  alert("Thank you for your purchase! Your order has been placed.");
  cart = [];
  renderCart();
}

// Initialize
window.onload = () => {
  loadProducts();
  renderCart();
};
