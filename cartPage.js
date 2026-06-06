// public/js/templates/cartPage.js
import { ApiClient } from '../api.js';
import { CartManager } from '../cartManager.js';

export async function renderCart() {
    const user = await ApiClient.fetchCurrentUser();
    if (!user) {
        page('/login');
        return;
    }

    const appContent = document.getElementById('app-content');
    let cart = CartManager.getCart();

    if (cart.length === 0) {
        appContent.innerHTML = `
            <div class="container my-5 py-5 text-center">
                <div class="mb-4"><i class="bi bi-cart-x text-muted fs-5rem"></i></div>
                <h3 class="fw-bold border-0">Your cart is empty</h3>
                <a href="/menu" class="btn btn-mocha px-5 py-2 mt-3" data-link>Explore the Menu</a>
            </div>
        `;
        return;
    }

    // CORREGIDO: Fusionado en un solo class
    appContent.innerHTML = `<div class="d-flex justify-content-center mt-5"><div class="spinner-border text-matcha-subtle" role="status"></div></div>`;

    let html = `
        <div class="container my-5">
            <div class="row">
                <div class="col-12 mb-3">
                    <a href="/menu" class="text-decoration-none text-muted fw-bold" data-link>
                        <i class="bi bi-arrow-left"></i> Back to Menu
                    </a>
                </div>

                <h2 class="mb-4">Your Mocher Cart</h2>
                <div class="col-lg-8">
                    <div class="card border-0 shadow-sm p-3 mb-4 rounded-15">
                        <div class="table-responsive">
                            <table class="table align-middle">
                                <thead>
                                    <tr class="text-muted small text-uppercase"><th>Product</th><th>Price</th><th>Quantity</th><th>Subtotal</th><th></th></tr>
                                </thead>
                                <tbody>
    `;

    let cartSubtotal = 0;
    for (let item of cart) {
        const product = await ApiClient.getProductById(item.id);
        if (product) {
            const subtotal = product.price * item.quantity;
            cartSubtotal += subtotal;
            html += `
                <tr>
                    <td>
                        <div class="d-flex align-items-center">
                            <img src="/images/${product.image}" class="rounded-3 me-3 img-60">
                            
                            <div><h6 class="mb-0 fw-bold border-0 text-mocha">${product.name}</h6><small class="text-muted">${product.category}</small></div>
                        </div>
                    </td>
                    <td>${product.price.toFixed(2)}€</td>
                    <td>
                        <div class="d-flex align-items-center max-w-100">
                            <button class="btn btn-sm btn-outline-secondary px-2 py-0 cart-btn" data-action="minus" data-id="${product.id}">-</button>
                            <span class="mx-3 fw-bold">${item.quantity}</span>
                            <button class="btn btn-sm btn-outline-secondary px-2 py-0 cart-btn" data-action="plus" data-id="${product.id}">+</button>
                        </div>
                    </td>
                    <td class="fw-bold text-matcha-dark">${subtotal.toFixed(2)}€</td>
                    <td>
                        <button class="btn btn-link text-danger p-0 cart-btn" data-action="remove" data-id="${product.id}"><i class="bi bi-trash"></i></button>
                    </td>
                </tr>
            `;
        }
    }

    let tax = cartSubtotal * 0.10;
    let total = cartSubtotal + tax;
    let matchaPoints = Math.floor(total);

    html += `
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                
                <div class="col-lg-4 mt-4 mt-lg-0">
                    <div class="card border-0 shadow-sm p-4 bg-white card-rounded-custom">
                        <h5 class="fw-bold mb-4 border-0">Order Summary</h5>
                        <div class="d-flex justify-content-between mb-2"><span>Subtotal</span><span>${cartSubtotal.toFixed(2)}€</span></div>
                        <div class="d-flex justify-content-between mb-2"><span>IVA (10%)</span><span>${tax.toFixed(2)}€</span></div>
                        <hr>
                        <div class="d-flex justify-content-between mb-4">
                            <span class="h5 fw-bold border-0">Total</span>
                            <span class="h5 fw-bold text-matcha-dark border-0">${total.toFixed(2)}€</span>
                        </div>
                        <button class="btn btn-mocha w-100 py-3 fw-bold mb-3" id="checkout-btn">Proceed to Checkout</button>
                    </div>
                    
                    <div class="mt-3 p-3 rounded-4 text-center bg-white shadow-sm border-matcha-light">
                        <p class="small mb-0">✨ Earn <strong class="text-matcha-subtle">${matchaPoints}</strong> Matcha Points.</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    appContent.innerHTML = html;
}

export async function processCheckout() {
    let cart = CartManager.getCart();
    const user = await ApiClient.fetchCurrentUser();

    if (cart.length === 0 || !user) {
        if (!user) page('/login');
        return;
    }

    const appContent = document.getElementById('app-content');

    // CORREGIDO: Fusionado
    appContent.innerHTML = `<div class="d-flex flex-column justify-content-center align-items-center mt-5 py-5"><div class="spinner-border text-matcha-subtle" role="status"></div><h4>Processing...</h4></div>`;

    const result = await ApiClient.submitOrder(cart, user.name, user.id);

    if (result) {
        localStorage.removeItem('mocha_cart');
        appContent.innerHTML = `
            <div class="container my-5 py-5 text-center">
                <div class="mb-4"><i class="bi bi-check2-circle text-matcha-subtle fs-5rem"></i></div>
                <h2 class="display-5 fw-bold mb-3 border-0">Order Confirmed!</h2>
                <a href="/" class="btn btn-mocha px-5 py-3 fw-bold">Return to Home</a>
            </div>
        `;
    } else {
        appContent.innerHTML = `
            <div class="container my-5 py-5 text-center">
                <div class="mb-4"><i class="bi bi-exclamation-circle text-danger fs-5rem"></i></div>
                <h2 class="display-5 fw-bold mb-3 border-0">Oops, something went wrong</h2>
                <a href="/menu" class="btn btn-outline-secondary px-5 py-3 fw-bold me-2" data-link>Back to Menu</a>
                <a href="/cart" class="btn btn-mocha px-5 py-3 fw-bold" data-link>Back to Cart</a>
            </div>
        `;
    }
}