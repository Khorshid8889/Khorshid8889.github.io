/* =========================
KHORSHID PRODUCTS
========================= */

const products = [

{
    id: 1,
    name: "گلدان سفالی آفتاب",
    price: 850000
},

{
    id: 2,
    name: "ظرف دکوری پارسی",
    price: 650000
},

{
    id: 3,
    name: "اثر هنری خورشید",
    price: 520000
},

{
    id: 4,
    name: "کاسه سرامیکی ماه",
    price: 480000
}

];

/* =========================
TELEGRAM INFORMATION
========================= */

const telegramUsername = "zizi1001";

const telegramPhone = "09044188589";

const telegramChannel = "https://t.me/suun1001";

/* =========================
HTML ELEMENTS
========================= */

const cartButton = document.getElementById("cartButton");

const closeCart = document.getElementById("closeCart");

const cartSidebar = document.getElementById("cartSidebar");

const cartOverlay = document.getElementById("cartOverlay");

const cartItems = document.getElementById("cartItems");

const cartCount = document.getElementById("cartCount");

const cartTotal = document.getElementById("cartTotal");

const checkoutButton = document.getElementById("checkoutButton");

const menuToggle = document.getElementById("menuToggle");

const navMenu = document.getElementById("navMenu");

/* =========================
CART STORAGE
========================= */

let cart = [];

try {

const savedCart = JSON.parse(
    localStorage.getItem("khorshidCart")
);

if (Array.isArray(savedCart)) {

    cart = savedCart.filter(item =>
        products.some(product =>
            product.id === item.id
        ) &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0
    );

}

} catch (error) {

cart = [];

}

/* =========================
PRICE FORMAT
========================= */

function formatPrice(price) {

return new Intl.NumberFormat("fa-IR").format(price);

}

/* =========================
SAVE CART
========================= */

function saveCart() {

localStorage.setItem(
    "khorshidCart",
    JSON.stringify(cart)
);

}

/* =========================
ADD TO CART
========================= */

document.querySelectorAll(".add-to-cart").forEach(button => {

button.addEventListener("click", () => {

    const productId = Number(button.dataset.id);

    const product = products.find(item =>
        item.id === productId
    );

    if (!product) return;

    const existingItem = cart.find(item =>
        item.id === productId
    );

    if (existingItem) {

        existingItem.quantity++;

    } else {

        cart.push({

            id: product.id,

            name: product.name,

            price: product.price,

            quantity: 1

        });

    }

    saveCart();

    renderCart();

    button.textContent = "اضافه شد ✓";

    setTimeout(() => {

        button.textContent = "افزودن به سبد +";

    }, 1200);

});

});

/* =========================
RENDER CART
========================= */

function renderCart() {

cartItems.innerHTML = "";

let total = 0;

let count = 0;


if (cart.length === 0) {

    cartItems.innerHTML =
        '<p class="empty-cart">هنوز محصولی انتخاب نکرده‌اید.</p>';

}


cart.forEach(item => {

    total += item.price * item.quantity;

    count += item.quantity;


    const cartItem = document.createElement("div");

    cartItem.className = "cart-item";


    const info = document.createElement("div");

    const title = document.createElement("h4");

    title.textContent = item.name;

    const price = document.createElement("p");

    price.textContent =
        formatPrice(item.price) + " تومان";


    info.appendChild(title);

    info.appendChild(price);


    const actions = document.createElement("div");

    actions.className = "cart-item-actions";


    const decreaseButton = document.createElement("button");

    decreaseButton.textContent = "−";

    decreaseButton.setAttribute(
        "aria-label",
        "کم کردن تعداد"
    );

    decreaseButton.addEventListener("click", () => {

        changeQuantity(item.id, -1);

    });


    const quantity = document.createElement("span");

    quantity.textContent =
        formatPrice(item.quantity);


    const increaseButton = document.createElement("button");

    increaseButton.textContent = "+";

    increaseButton.setAttribute(
        "aria-label",
        "زیاد کردن تعداد"
    );

    increaseButton.addEventListener("click", () => {

        changeQuantity(item.id, 1);

    });


    const removeButton = document.createElement("button");

    removeButton.textContent = "×";

    removeButton.className = "remove-item";

    removeButton.setAttribute(
        "aria-label",
        "حذف محصول"
    );

    removeButton.addEventListener("click", () => {

        removeItem(item.id);

    });


    actions.appendChild(decreaseButton);

    actions.appendChild(quantity);

    actions.appendChild(increaseButton);

    actions.appendChild(removeButton);


    cartItem.appendChild(info);

    cartItem.appendChild(actions);

    cartItems.appendChild(cartItem);

});


cartCount.textContent = formatPrice(count);

cartTotal.textContent =
    formatPrice(total) + " تومان";

}

/* =========================
CHANGE QUANTITY
========================= */

function changeQuantity(id, amount) {

const item = cart.find(product =>
    product.id === id
);

if (!item) return;

item.quantity += amount;

if (item.quantity <= 0) {

    cart = cart.filter(product =>
        product.id !== id
    );

}

saveCart();

renderCart();

}

/* =========================
REMOVE PRODUCT
========================= */

function removeItem(id) {

cart = cart.filter(item =>
    item.id !== id
);

saveCart();

renderCart();

}

/* =========================
OPEN CART
========================= */

function openCart() {

cartSidebar.classList.add("open");

cartOverlay.classList.add("show");

}

/* =========================
CLOSE CART
========================= */

function closeCartSidebar() {

cartSidebar.classList.remove("open");

cartOverlay.classList.remove("show");

}

cartButton.addEventListener(
"click",
openCart
);

closeCart.addEventListener(
"click",
closeCartSidebar
);

cartOverlay.addEventListener(
"click",
closeCartSidebar
);

/* =========================
PRODUCT FILTERS
========================= */

const filterButtons = document.querySelectorAll(".filter-btn");

const productCards = document.querySelectorAll(".product-card");

filterButtons.forEach(button => {

button.addEventListener("click", () => {

    filterButtons.forEach(btn => {

        btn.classList.remove("active");

    });

    button.classList.add("active");

    const filter = button.dataset.filter;


    productCards.forEach(card => {

        if (
            filter === "all" ||
            card.dataset.category === filter
        ) {

            card.classList.remove("hidden");

        } else {

            card.classList.add("hidden");

        }

    });

});

});

/* =========================
COLLECTION FILTERS
========================= */

document.querySelectorAll(".collection-card").forEach(card => {

card.addEventListener("click", () => {

    const category = card.dataset.category;

    const filterButton = document.querySelector(
        `.filter-btn[data-filter="${category}"]`
    );

    if (filterButton) {

        filterButton.click();

    }

});

});

/* =========================
MOBILE MENU
========================= */

menuToggle.addEventListener("click", () => {

navMenu.classList.toggle("show");

});

document.querySelectorAll(".nav-menu a").forEach(link => {

link.addEventListener("click", () => {

    navMenu.classList.remove("show");

});

});

/* =========================
TELEGRAM CHECKOUT
========================= */

checkoutButton.addEventListener("click", async () => {

if (cart.length === 0) {

    alert("سبد خرید شما خالی است!");

    return;

}


let message =
    "سلام، برای ثبت سفارش از فروشگاه خورشید پیام می‌دهم.\n\n";

let total = 0;


cart.forEach(item => {

    const itemTotal =
        item.price * item.quantity;

    total += itemTotal;


    message +=
        `محصول: ${item.name}\n` +
        `تعداد: ${formatPrice(item.quantity)}\n` +
        `قیمت: ${formatPrice(itemTotal)} تومان\n\n`;

});


message +=
    "----------------------\n" +
    `مجموع سفارش: ${formatPrice(total)} تومان\n\n` +
    "لطفاً برای تکمیل سفارش راهنمایی‌ام کنید.";


const telegramURL =
    `https://t.me/${telegramUsername}`;


try {

    if (!navigator.clipboard) {

        throw new Error("Clipboard is unavailable");

    }

    await navigator.clipboard.writeText(message);

    alert(
        "متن سفارش کپی شد!\n\n" +
        "حالا وارد گفت‌وگوی تلگرام خورشید شوید " +
        "و متن سفارش را ارسال کنید."
    );

} catch (error) {

    alert(
        "گفت‌وگوی تلگرام باز می‌شود.\n\n" +
        "لطفاً محصولات انتخاب‌شده و تعداد آن‌ها را " +
        "برای ما ارسال کنید."
    );

}


window.open(
    telegramURL,
    "_blank",
    "noopener,noreferrer"
);

});

/* =========================
INITIALIZE
========================= */

renderCart();
