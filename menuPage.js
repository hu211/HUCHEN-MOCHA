// public/js/templates/menuPage.js
import { ApiClient } from '../api.js';

export async function renderMenu() {
    const appContent = document.getElementById('app-content');
    appContent.innerHTML = `<div class="d-flex justify-content-center mt-5"><div class="spinner-border" class="text-matcha-subtle" role="status"></div></div>`;
    const products = await ApiClient.getAllProducts();

    let html = `
        <div class="container my-5">
            <h2 class="mb-4">Our Menu</h2>
            <div class="row"><div class="col-lg-8 mx-auto">
    `;

    products.forEach(product => {
        html += `
                    <div class="d-flex align-items-center justify-content-between border-bottom py-3 item-menu">
                        <div class="pe-3">
                            <h5 class="mb-1 fw-bold" class="text-mocha-text">${product.name}</h5>
                            <p class="small text-muted mb-0">${product.description}</p>
                        </div>
                        <div class="text-end" class="text-end min-w-90">
                            <span class="fs-5 fw-bold" class="text-matcha-dark">${product.price.toFixed(2)}€</span><br>
                            <a href="/product/${product.id}" class="btn btn-mocha btn-sm mt-2 px-3" data-link>Details</a>
                        </div>
                    </div>
        `;
    });

    html += `</div></div></div>`;
    appContent.innerHTML = html;
}

export async function renderSearchResults(query) {
    const appContent = document.getElementById('app-content');
    appContent.innerHTML = `<div class="d-flex justify-content-center mt-5"><div class="spinner-border" class="text-matcha-subtle" role="status"></div></div>`;
    const products = await ApiClient.searchProducts(query);

    let html = `
        <div class="container my-5">
            <h2 class="mb-4">Search Results for "${query}"</h2>
            <div class="row"><div class="col-lg-8 mx-auto">
    `;

    if (products.length > 0) {
        products.forEach(product => {
            html += `
                    <div class="d-flex align-items-center justify-content-between border-bottom py-3 item-menu">
                        <div class="pe-3">
                            <h5 class="mb-1 fw-bold" class="text-mocha-text">${product.name}</h5>
                            <p class="small text-muted mb-0">${product.description}</p>
                        </div>
                        <div class="text-end" class="text-end min-w-90">
                            <span class="fs-5 fw-bold" class="text-matcha-dark">${product.price.toFixed(2)}€</span><br>
                            <a href="/product/${product.id}" class="btn btn-mocha btn-sm mt-2 px-3" data-link>Details</a>
                        </div>
                    </div>
            `;
        });
    } else {
        html += `<div class="col-12 text-center"><p>No results found for "${query}".</p></div>`;
    }

    html += `</div></div></div>`;
    appContent.innerHTML = html;
}

export async function renderProductDetails(id) {
    const appContent = document.getElementById('app-content');
    appContent.innerHTML = `<div class="d-flex justify-content-center mt-5"><div class="spinner-border" class="text-matcha-subtle" role="status"></div></div>`;
    const product = await ApiClient.getProductById(id);

    const user = await ApiClient.fetchCurrentUser();

    if (!product) {
        appContent.innerHTML = `<div class="container my-5 text-center"><h2>Product not found</h2><a href="/menu" class="btn btn-mocha mt-3 px-4" data-link>Back to Menu</a></div>`;
        return;
    }

    let stockHtml = '';
    let cartButtonHtml = '';

    const isDrink = ['Coffee', 'Matcha', 'drinks', 'Drinks'].includes(product.category);
    const hasStock = isDrink || product.stock > 0;

    if (isDrink) {
        stockHtml = `<span class="badge mb-3 badge-matcha-outline">Available for pickup</span>`;
    } else if (hasStock) {
        const badgeClass = product.stock < 5 ? 'badge-mocha-outline' : 'badge-matcha-outline';
        const stockText = product.stock < 5 ? 'Last units: ' : 'Stock available: ';
        stockHtml = `<span class="badge mb-3 ${badgeClass}">${stockText} ${product.stock}</span>`;
    } else {
        stockHtml = `<span class="badge bg-danger-subtle text-danger border border-danger mb-3">Out of stock</span>`;
    }

    if (!hasStock) {
        cartButtonHtml = `<button class="btn btn-secondary w-100 py-2 rounded-pill fw-bold" disabled>Ovens are rolling, back tomorrow!</button>`;
    } else if (!user) {
        cartButtonHtml = `<a href="/login" class="btn btn-mocha w-100 py-2 fw-bold" data-link><i class="bi bi-person me-2"></i> Login to Order</a>`;
    } else {
        cartButtonHtml = `<button class="btn btn-mocha w-100 py-2 fw-bold" id="add-to-cart-btn" data-id="${product.id}"><i class="bi bi-bag-plus me-2"></i> Add to Cart</button>`;
    }

    let customizationHtml = '<li><i class="bi bi-info-circle me-2"></i>Freshly made every morning in our kitchen.</li>';
    if (product.category === 'Matcha') {
        customizationHtml = `<li><i class="bi bi-check2 me-2" class="text-matcha-subtle"></i>Matcha 01 - Ceremonial Grade</li><li><i class="bi bi-check2 me-2" class="text-matcha-subtle"></i>Matcha 02 - Culinary Vibrant</li><li><i class="bi bi-info-circle me-2"></i>Choice of milk included.</li>`;
    } else if (product.category === 'Coffee') {
        customizationHtml = `<li><i class="bi bi-check2 me-2" class="text-matcha-subtle"></i>Coffee 01 - Bold Morning Blend</li><li><i class="bi bi-check2 me-2" class="text-matcha-subtle"></i>Coffee 02 - Smooth Balanced Roast</li><li><i class="bi bi-info-circle me-2"></i>Choice of milk included.</li>`;
    }

    appContent.innerHTML = `
        <div class="container my-5">
            <div class="row align-items-center">
                <div class="col-md-6 mb-4 mb-md-0">
                    <div class="card border-0 shadow-sm overflow-hidden border-15">
                        <img src="/images/${product.image}" class="img-fluid" alt="${product.name}">
                    </div>
                </div>
                <div class="col-md-6 ps-md-5">
                    <h1 class="display-4 fw-bold mb-3" class="text-mocha-text">${product.name}</h1>
                    <div class="mb-4"><span class="fs-2 fw-bold" class="text-matcha-dark">${product.price.toFixed(2)}€</span></div>
                    <div class="my-3">${stockHtml}${cartButtonHtml}</div>
                    <p class="lead text-muted text-justify mb-4">${product.description}</p>
                    <div class="border-top pt-4">
                        <h5 class="fw-bold mb-3" class="text-mocha-text">Customization</h5>
                        <ul class="list-unstyled text-muted small">${customizationHtml}</ul>
                    </div>
                    <div class="mt-4 pt-3 border-top">
                        <a href="/menu" class="btn btn-outline-secondary w-100 py-2 rounded-pill fw-bold" data-link><i class="bi bi-arrow-left me-2"></i> Back to Menu</a>
                    </div>
                </div>
            </div>
        </div>
    `;
}