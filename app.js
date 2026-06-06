// public/js/app.js
import { ApiClient } from './api.js';
import { CartManager } from './cartManager.js';

// IMPORTAMOS NUESTRAS VISTAS (TEMPLATES)
import { renderHome } from './templates/homePage.js';
import { renderMenu, renderSearchResults, renderProductDetails } from './templates/menuPage.js';
import { renderLogin, renderRegister } from './templates/authPage.js';
import { renderCart, processCheckout } from './templates/cartPage.js';
import { renderProfile, renderRewards, renderAdmin } from './templates/userPage.js';

// ==========================================
// 1. FUNCIONES AUXILIARES GLOBALES
// ==========================================

async function updateNavbar() {
    const navContainer = document.getElementById('nav-user-container');
    if (!navContainer) return;

    const user = await ApiClient.fetchCurrentUser();

    if (user) {
        const firstName = user.name.split(' ')[0];
        const isAdmin = user.role === 'admin';

        let dropdownHtml = `
            <li class="nav-item dropdown list-unstyled">
                <a class="nav-link dropdown-toggle fw-bold text-mocha-wood" href="#" id="userDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    ${isAdmin ? 'Admin: ' : 'Hi, '}${firstName}
                </a>
                <ul class="dropdown-menu dropdown-menu-dark border-0 shadow" aria-labelledby="userDropdown">
        `;

        if (isAdmin) {
            dropdownHtml += `<li><a class="dropdown-item fw-bold text-mocha-wood" href="/admin" data-link><i class="bi bi-speedometer2 me-2"></i>Admin Dashboard</a></li>`;
        } else {
            dropdownHtml += `
                    <li><a class="dropdown-item" href="/profile" data-link>My Profile</a></li>
                    <li><a class="dropdown-item" href="/rewards" data-link>Rewards</a></li>
            `;
        }

        dropdownHtml += `
                    <li><hr class="dropdown-divider"></li>
                    <li><button class="dropdown-item text-danger w-100 text-start bg-transparent border-0" id="logout-btn">Logout</button></li>
                </ul>
            </li>
        `;
        navContainer.innerHTML = dropdownHtml;
    } else {
        navContainer.innerHTML = `
            <li class="nav-item list-unstyled">
                <a class="nav-link fw-bold text-mocha-wood" href="/login" data-link>Mochers</a>
            </li>
        `;
    }
}

// ==========================================
// 2. SISTEMA DE RUTAS (PAGE.JS)
// ==========================================
page('/', renderHome);
page('/menu', renderMenu);
page('/search', (ctx) => {
    const query = new URLSearchParams(ctx.querystring).get('q');
    query ? renderSearchResults(query) : renderMenu();
});
page('/product/:id', (ctx) => renderProductDetails(ctx.params.id));
page('/cart', renderCart);
page('/login', renderLogin);
page('/register', renderRegister);
page('/profile', renderProfile);
page('/rewards', renderRewards);
page('/admin', renderAdmin);
page('*', renderHome);

// ==========================================
// 3. INICIALIZACIÓN Y DELEGACIÓN DE EVENTOS
// ==========================================

document.addEventListener('DOMContentLoaded', async () => {
    document.addEventListener('error', function (e) {
        if(e.target.tagName && e.target.tagName.toLowerCase() === 'img') {
            if(!e.target.dataset.fallbackApplied) {
                e.target.src = 'https://placehold.co/600x600?text=Mocha';
                e.target.dataset.fallbackApplied = true;
            }
        }
    }, true);

    await updateNavbar();
    page();

    // Eventos Click
    document.body.addEventListener('click', async (e) => {
        if (e.target.matches('a[href^="/"]')) {
            e.preventDefault();
            page(e.target.getAttribute('href'));
        }

        if (e.target.closest('#logout-btn')) {
            await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
            await updateNavbar();
            page('/login');
        }

        const addToCartBtn = e.target.closest('#add-to-cart-btn');
        if (addToCartBtn) {
            const user = await ApiClient.fetchCurrentUser();
            if (!user) {
                page('/login');
                return;
            }
            CartManager.addToCart(addToCartBtn.getAttribute('data-id'));
            page('/cart');
        }

        if (e.target.closest('#checkout-btn')) processCheckout();

        const cartActionBtn = e.target.closest('.cart-btn');
        if (cartActionBtn) {
            const action = cartActionBtn.getAttribute('data-action');
            const productId = cartActionBtn.getAttribute('data-id');
            if (action === 'plus') CartManager.changeQuantity(productId, 1);
            else if (action === 'minus') CartManager.changeQuantity(productId, -1);
            else if (action === 'remove') CartManager.removeFromCart(productId);
            renderCart();
        }

        const completeBtn = e.target.closest('.complete-order-btn');
        if (completeBtn) {
            completeBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span>';
            completeBtn.disabled = true;
            await ApiClient.updateOrderStatus(completeBtn.getAttribute('data-id'));
            renderAdmin();
        }

        const editProdBtn = e.target.closest('.edit-product-btn');
        if (editProdBtn) {
            const product = await ApiClient.getProductById(editProdBtn.getAttribute('data-id'));
            if (product) {
                document.getElementById('edit-prod-id').value = product.id;
                document.getElementById('edit-prod-name').value = product.name;
                document.getElementById('edit-prod-category').value = product.category;
                document.getElementById('edit-prod-image').value = product.image;
                document.getElementById('edit-prod-price').value = product.price;
                document.getElementById('edit-prod-stock').value = product.stock;
                document.getElementById('edit-prod-desc').value = product.description;
            }
        }

        const deleteProdBtn = e.target.closest('.delete-product-btn');
        if (deleteProdBtn) document.getElementById('delete-prod-id').value = deleteProdBtn.getAttribute('data-id');
    });

    // Eventos Submit (Formularios)
    document.body.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (e.target.id === 'search-form') {
            const query = document.getElementById('search-input').value.trim();
            if (query !== "") page(`/search?q=${encodeURIComponent(query)}`);
        }

        if (e.target.id === 'login-form') {
            const errorDiv = document.getElementById('login-error');
            const user = await ApiClient.loginUser(document.getElementById('login-email').value, document.getElementById('login-password').value);
            if (user && user.id) {
                errorDiv.classList.add('d-none');
                await updateNavbar();
                page(user.role === 'admin' ? '/admin' : '/profile');
            } else {
                errorDiv.textContent = "Invalid email or password.";
                errorDiv.classList.remove('d-none');
            }
        }

        if (e.target.id === 'register-form') {
            const errorDiv = document.getElementById('register-error');
            const user = await ApiClient.registerUser(
                document.getElementById('reg-name').value,
                document.getElementById('reg-birthday').value,
                document.getElementById('reg-email').value,
                document.getElementById('reg-password').value
            );
            if (user && user.id) {
                errorDiv.classList.add('d-none');
                await updateNavbar();
                page('/profile');
            } else {
                errorDiv.textContent = "Error occurred.";
                errorDiv.classList.remove('d-none');
            }
        }

        if (e.target.id === 'add-product-form') {
            await ApiClient.addProduct({
                name: document.getElementById('new-prod-name').value,
                category: document.getElementById('new-prod-category').value,
                price: parseFloat(document.getElementById('new-prod-price').value),
                stock: parseInt(document.getElementById('new-prod-stock').value),
                description: document.getElementById('new-prod-desc').value,
                image: document.getElementById('new-prod-image').value
            });
            setTimeout(() => renderAdmin(), 300);
        }

        if (e.target.id === 'edit-product-form') {
            await ApiClient.updateProduct(document.getElementById('edit-prod-id').value, {
                name: document.getElementById('edit-prod-name').value,
                category: document.getElementById('edit-prod-category').value,
                price: parseFloat(document.getElementById('edit-prod-price').value),
                stock: parseInt(document.getElementById('edit-prod-stock').value),
                description: document.getElementById('edit-prod-desc').value,
                image: document.getElementById('edit-prod-image').value
            });
            setTimeout(() => renderAdmin(), 300);
        }

        if (e.target.id === 'delete-prod-form') {
            await ApiClient.deleteProduct(document.getElementById('delete-prod-id').value);
            setTimeout(() => renderAdmin(), 300);
        }
    });
});