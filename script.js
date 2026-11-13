/* ==========================================
   KHORSHID — A LITTLE WORLD OF CLAY & DREAMS
========================================== */


/* LOADER */

window.addEventListener("load", () => {
  const loader = document.getElementById("loader");

  setTimeout(() => {
    loader.classList.add("hide");
  }, 700);
});


/* MOBILE MENU */

const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");

menuToggle.addEventListener("click", () => {
  nav.classList.toggle("open");
});

document.querySelectorAll(".nav a").forEach(link => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
  });
});


/* CURSOR LIGHT */

const cursorGlow = document.querySelector(".cursor-glow");

if (window.matchMedia("(pointer: fine)").matches) {
  window.addEventListener("mousemove", (event) => {
    cursorGlow.style.left = event.clientX + "px";
    cursorGlow.style.top = event.clientY + "px";
  });
} else {
  cursorGlow.style.display = "none";
}


/* SCROLL REVEAL */

const revealElements = document.querySelectorAll(
  ".section-heading, .intro-content, .intro-bottom, .collection-card, " +
  ".color-story-text, .color-orb, .product-card, .statement, .story-image, " +
  ".story-content, .process-step, .full-image-content, .value-card, " +
  ".gallery-item, .journal-card, .faq-heading, .faq-list details, .contact-content"
);

revealElements.forEach(element => {
  element.classList.add("reveal");
});

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12
});

revealElements.forEach(element => revealObserver.observe(element));


/* PRODUCT DATA
   قیمت‌ها و عکس‌ها نمونه هستند.
   قبل از انتشار، اطلاعات واقعی محصولات را جایگزین کن.
*/

const products = [
  {
    id: 1,
    name: "گلدان آفتاب",
    price: 850000,
    category: "vase",
    image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 2,
    name: "کاسه مهتاب",
    price: 650000,
    category: "table",
    image: "https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 3,
    name: "فرم خیال",
    price: 520000,
    category: "art",
    image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 4,
    name: "گلدان باران",
    price: 480000,
    category: "vase",
    image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=700&q=85"
  }
];


/* PERSIAN NUMBER FORMAT */

function formatPrice(price) {
  return new Intl.NumberFormat("fa-IR").format(price) + " تومان";
}

function toPersianNumber(number) {
  return new Intl.NumberFormat("fa-IR").format(number);
}


/* FILTER PRODUCTS */

const filterButtons = document.querySelectorAll(".filter-btn");
const productCards = document.querySelectorAll(".product-card");

filterButtons.forEach(button => {
  button.addEventListener("click", () => {

    filterButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");

    const filter = button.dataset.filter;

    productCards.forEach(card => {
      const category = card.dataset.category;

      if (filter === "all" || category === filter) {
        card.classList.remove("hidden");
      } else {
        card.classList.add("hidden");
      }
    });

  });
});


/* CART ELEMENTS */

const cartPanel = document.getElementById("cartPanel");
const cartBackdrop = document.getElementById("cartBackdrop");
const openCartButton = document.getElementById("openCart");
const closeCartButton = document.getElementById("closeCart");

const cartItemsContainer = document.getElementById("cartItems");
const cartTotalElement = document.getElementById("cartTotal");
const cartCountElement = document.getElementById("cartCount");
const checkoutButton = document.getElementById("checkoutButton");

let cart = [];

try {
  cart = JSON.parse(localStorage.getItem("khorshidCart")) || [];
} catch {
  cart = [];
}


/* OPEN AND CLOSE CART */

function openCart() {
  cartPanel.classList.add("show");
  cartBackdrop.classList.add("show");
  document.body.style.overflow = "hidden";
}

function closeCart() {
  cartPanel.classList.remove("show");
  cartBackdrop.classList.remove("show");
  document.body.style.overflow = "";
}

openCartButton.addEventListener("click", openCart);
closeCartButton.addEventListener("click", closeCart);
cartBackdrop.addEventListener("click", closeCart);


/* ESCAPE KEY */

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeCart();
    nav.classList.remove("open");
  }
});


/* ADD PRODUCT */

document.querySelectorAll("[data-add]").forEach(button => {

  button.addEventListener("click", () => {

    const productId = Number(button.dataset.add);
    const product = products.find(item => item.id === productId);

    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.push({
        ...product,
        quantity: 1
      });
    }

    saveCart();
    renderCart();
    showToast();

  });

});


/* REMOVE PRODUCT */

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
  renderCart();
}


/* SAVE CART */

function saveCart() {
  localStorage.setItem("khorshidCart", JSON.stringify(cart));
}


/* RENDER CART */

function renderCart() {

  const totalQuantity = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  cartCountElement.textContent = toPersianNumber(totalQuantity);
  cartTotalElement.textContent = formatPrice(totalPrice);

  if (cart.length === 0) {

    cartItemsContainer.innerHTML = `
      <div class="empty-cart">
        <span>✿</span>
        <p>هنوز چیزی انتخاب نکرده‌ای!</p>
        <small>شاید یک اثر زیبا منتظر تو باشد.</small>
      </div>
    `;

    return;
  }

  cartItemsContainer.innerHTML = cart.map(item => `
    <div class="cart-item">

      <img src="${item.image}" alt="${item.name}">

      <div>
        <h4>${item.name}</h4>
        <p>${formatPrice(item.price)} × ${toPersianNumber(item.quantity)}</p>
      </div>

      <button
        onclick="removeFromCart(${item.id})"
        aria-label="حذف ${item.name}"
        title="حذف محصول"
      >×</button>

    </div>
  `).join("");

}


/* TOAST */

let toastTimer;

function showToast() {

  const toast = document.getElementById("toast");

  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2400);

}


/* TELEGRAM ORDER */

const TELEGRAM_USERNAME = "zizi1001";

checkoutButton.addEventListener("click", async () => {

  if (cart.length === 0) {
    showToast();
    return;
  }

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  let orderMessage = "سلام، برای سفارش از فروشگاه خورشید پیام می‌دهم 🌞\n\n";

  orderMessage += "محصولات انتخابی من:\n";

  cart.forEach((item, index) => {

    orderMessage +=
      `${index + 1}. ${item.name}\n` +
      `تعداد: ${toPersianNumber(item.quantity)}\n` +
      `قیمت: ${formatPrice(item.price * item.quantity)}\n\n`;

  });

  orderMessage += `مبلغ کل: ${formatPrice(totalPrice)}\n\n`;
  orderMessage += "لطفاً برای تکمیل سفارش راهنمایی‌ام کنید. ✿";

  try {

    await navigator.clipboard.writeText(orderMessage);

    alert(
      "متن سفارش کپی شد! 🌞\n" +
      "حالا در تلگرام پیام را برای خورشید ارسال کن."
    );

  } catch (error) {

    alert(
      "برای ارسال سفارش، فهرست محصولات را از سبد خریدت یادداشت کن و در تلگرام بفرست."
    );

  }

  window.open(
    `https://t.me/${TELEGRAM_USERNAME}`,
    "_blank",
    "noopener"
  );

});


/* INITIAL CART RENDER */

renderCart();


/* FAQ: KEEP THE OPEN ONE NEAT */

const faqDetails = document.querySelectorAll(".faq-list details");

faqDetails.forEach(detail => {

  detail.addEventListener("toggle", () => {

    if (detail.open) {

      faqDetails.forEach(other => {

        if (other !== detail) {
          other.open = false;
        }

      });

    }

  });

});


/* SMOOTH ANCHOR NAVIGATION */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {

  anchor.addEventListener("click", event => {

    const targetId = anchor.getAttribute("href");

    if (!targetId || targetId === "#") return;

    const target = document.querySelector(targetId);

    if (target) {

      event.preventDefault();

      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    }

  });

});


/* SUBTLE PARALLAX FOR HERO */

const heroImage = document.querySelector(".hero-image-frame");

if (window.matchMedia("(pointer: fine)").matches) {

  document.addEventListener("mousemove", event => {

    const x = (event.clientX / window.innerWidth - .5) * 8;
    const y = (event.clientY / window.innerHeight - .5) * 8;

    heroImage.style.transform = `translate(${x}px, ${y}px)`;

  });

}
