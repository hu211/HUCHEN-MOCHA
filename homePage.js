// public/js/templates/homePage.js
import { ApiClient } from '../api.js';

export async function renderHome() {
    const appContent = document.getElementById('app-content');
    appContent.innerHTML = `<div class="d-flex justify-content-center align-items-center h-100 mt-5"><div class="spinner-border" class="spinner-border text-matcha-subtle" role="status"></div></div>`;

    const products = await ApiClient.getTopSellers();
    let html = `
        <header class="hero-section text-center py-5" class="bg-white border-bottom">
            <div class="container py-5">
                <h1 class="display-3 fw-bold">Welcome to <span class="text-mocha-wood">Mocha</span></h1>
                <a href="/menu" class="btn btn-mocha btn-lg mt-3 px-5 py-2">View Full Menu</a>
            </div>
        </header>
        <div class="container my-5">
            <h2 class="mb-5">Top Sellers</h2>
            <div class="row row-cols-1 row-cols-md-3 g-4">`;

    products.forEach(product => {
        html += `
            <div class="col">
                <div class="card h-100 card-mocha">
                    <img src="/images/${product.image}" class="product-img" alt="${product.name}">
                    <div class="card-body p-4">
                        <h5 class="card-title fw-bold" class="card-title fw-bold">${product.name}</h5>
                        <div class="d-flex justify-content-between align-items-center mt-4">
                            <span class="fw-bold fs-5" class="spinner-border text-matcha-subtle" role="status"></span>
                            <a href="/product/${product.id}" class="btn btn-mocha btn-sm px-4">Details</a>
                        </div>
                    </div>
                </div>
            </div>`;
    });
    html += `</div></div>`;
    appContent.innerHTML = html;
}