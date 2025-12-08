// Toggle Active Class for Hamburger Menu
const navbarNav = document.querySelector('.navbar-nav');
document.querySelector('#hamburger-menu').onclick = (e) => {
    e.preventDefault();
    navbarNav.classList.toggle('active');
};

// Toggle Active Class for Search Form
const searchForm = document.querySelector('.search-form');
const searchBox = document.querySelector('#search-box');
document.querySelector('#search-button').onclick = (e) => {
    e.preventDefault();
    searchForm.classList.toggle('active');
    searchBox.focus();
};

// Toggle Active Class for Shopping Cart
const shoppingCart = document.querySelector('.shopping-cart');
document.querySelector('#shopping-cart-button').onclick = (e) => {
    e.preventDefault();
    shoppingCart.classList.toggle('active');
};

// Click outside element to close sidebar
const hm = document.querySelector('#hamburger-menu');
const sb = document.querySelector('#search-button');
const sc = document.querySelector('#shopping-cart-button');

document.addEventListener('click', function(e) {
    if (!hm.contains(e.target) && !navbarNav.contains(e.target)) {
        navbarNav.classList.remove('active');
    }
    if (!sb.contains(e.target) && !searchForm.contains(e.target)) {
        searchForm.classList.remove('active');
    }
    if (!sc.contains(e.target) && !shoppingCart.contains(e.target)) {
        shoppingCart.classList.remove('active');
    }
});

// --- SHOPPING CART LOGIC ---

let cart = [];

// 1. Currency Formatter (Indonesian Rupiah)
const rupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(number);
};

// 2. Event Listener for "Add to Cart" Buttons
const addToCartButtons = document.querySelectorAll('.add-to-cart');
addToCartButtons.forEach((btn) => {
    btn.onclick = (e) => {
        e.preventDefault();
        const name = btn.getAttribute('data-name');
        const price = parseInt(btn.getAttribute('data-price'));
        const img = btn.getAttribute('data-img');
        
        addToCart(name, price, img);
        // Open sidebar so user can see the item added
        shoppingCart.classList.add('active');
    };
});

// 3. Add Item Function
function addToCart(name, price, img) {
    // Check if item already exists
    const existingItem = cart.find((item) => item.name === name);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            name: name,
            price: price,
            img: img,
            quantity: 1
        });
    }
    renderCart();
}

// 4. Render Cart View
function renderCart() {
    const cartContainer = document.querySelector('.cart-items-container');
    const totalElement = document.querySelector('#total-price');
    const cartTotalDiv = document.querySelector('.cart-total');

    cartContainer.innerHTML = '';
    let totalPrice = 0;

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p style="text-align:center; margin-top:2rem; color: #333;">Your cart is empty.</p>';
        cartTotalDiv.style.display = 'none';
        return;
    }

    cartTotalDiv.style.display = 'block';

    cart.forEach((item, index) => {
        totalPrice += item.price * item.quantity;
        
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <img src="${item.img}" alt="${item.name}">
            <div class="item-detail">
                <h3>${item.name}</h3>
                <div class="item-price">${rupiah(item.price)} x ${item.quantity}</div>
            </div>
            <i data-feather="trash-2" class="remove-item" onclick="removeItem(${index})"></i>
        `;
        cartContainer.appendChild(cartItem);
    });

    totalElement.innerText = rupiah(totalPrice);
    feather.replace(); // Refresh icons
}

// 5. Remove Item Function (Global scope)
window.removeItem = function(index) {
    if(cart[index].quantity > 1){
        cart[index].quantity--;
    } else {
        cart.splice(index, 1);
    }
    renderCart();
};

// --- CHECKOUT & RECEIPT LOGIC ---

const checkoutBtn = document.querySelector('#checkout-button');
const receiptModal = document.querySelector('#receipt-modal');
const receiptContent = document.querySelector('#receipt-print-area');
const closeReceiptBtn = document.querySelector('.close-receipt');
const printBtn = document.querySelector('#print-btn');

checkoutBtn.onclick = (e) => {
    e.preventDefault();
    if(cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    generateReceipt();
    shoppingCart.classList.remove('active'); // Close sidebar
    receiptModal.style.display = 'flex'; // Open receipt modal
};

closeReceiptBtn.onclick = (e) => {
    e.preventDefault();
    receiptModal.style.display = 'none';
};

function generateReceipt() {
    let total = 0;
    // Using English locale for date
    const date = new Date().toLocaleString('en-US');
    const randomOrderNum = Math.floor(Math.random() * 100000);

    let itemsHtml = '';
    cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        total += subtotal;
        itemsHtml += `
            <div class="receipt-item">
                <span>${item.name} (x${item.quantity})</span>
                <span>${rupiah(subtotal)}</span>
            </div>
        `;
    });

    receiptContent.innerHTML = `
        <div class="receipt-header">
            <h2 style="margin-bottom:0.5rem; color:black;">GlucoFreezz</h2>
            <p>Guilt-free Scoop</p>
            <p style="font-size:0.8rem;">123 Healthy Street, City Center</p>
            <p style="font-size:0.8rem;">${date}</p>
            <p style="font-size:0.8rem;">Order #${randomOrderNum}</p>
        </div>
        <div class="receipt-body">
            ${itemsHtml}
        </div>
        <div class="receipt-footer">
            <span>Total: ${rupiah(total)}</span>
        </div>
        <p style="text-align:center; margin-top:1rem; font-size:0.8rem;">Thank You & Stay Healthy!</p>
    `;
}

// Print Function
printBtn.onclick = (e) => {
    e.preventDefault();
    window.print();
};

// Modal Box Item Detail
const itemDetailModal = document.querySelector('#item-detail-modal');
const itemDetailButtons = document.querySelectorAll('.item-detail-button');

itemDetailButtons.forEach((btn) => {
    btn.onclick = (e) => {
        itemDetailModal.style.display ='flex';
        e.preventDefault();
    };
});

document.querySelector('#item-detail-modal .close-icon').onclick = (e) =>{
    itemDetailModal.style.display = 'none';
    e.preventDefault();
};

// Click outside modal to close
window.onclick = (e) => {
    if (e.target === itemDetailModal){
        itemDetailModal.style.display = 'none';
    }
    if (e.target === receiptModal){
        receiptModal.style.display = 'none';
    }
}