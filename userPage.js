// public/js/templates/userPage.js
import { ApiClient } from '../api.js';

export async function renderProfile() {
    const user = await ApiClient.fetchCurrentUser();
    if (!user) { page('/login'); return; }

    const safeName = user.name || 'Mocher';
    const initial = safeName.charAt(0).toUpperCase();
    const points = user.points || 0;

    let levelName = 'Mocher Seed 🌱';
    if (points >= 500 && points < 1500) {
        levelName = 'Mocher Sprout 🌿';
    } else if (points >= 1500) {
        levelName = 'Matcha Master 🍵';
    }

    document.getElementById('app-content').innerHTML = `
        <div class="container my-5">
            <div class="row justify-content-center">
                <div class="col-md-8">
                    <div class="card border-0 shadow-sm p-4 rounded-15">
                        
                        <div class="d-flex align-items-center mb-4">
                            <div class="text-white rounded-circle d-flex align-items-center justify-content-center shadow-sm avatar-circle">
                                ${initial}
                            </div>
                            <div class="ms-3">
                                <h2 class="mb-0 fw-bold border-0">Welcome, ${safeName}!</h2>
                                <small class="text-muted">${user.email}</small>
                            </div>
                        </div>

                        <hr class="text-muted my-4">

                        <div class="row text-center">
                            <div class="col-md-6 mb-3">
                                <div class="p-3 bg-light rounded-3 border">
                                    <h6 class="text-muted small fw-bold text-uppercase">Your Status</h6>
                                    <p class="h4 mb-0 fw-bold border-0 text-mocha-wood">${levelName}</p>
                                </div>
                            </div>
                            <div class="col-md-6 mb-3">
                                <div class="p-3 bg-light rounded-3 border">
                                    <h6 class="text-muted small fw-bold text-uppercase">Matcha Points</h6>
                                    <p class="h4 mb-0 fw-bold text-matcha-subtle">${points} pts</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="card mt-4 shadow-sm border-matcha-light rounded-15">
                            <div class="card-body p-4">
                                <h5 class="card-title fw-bold border-0">🎁 Your Rewards</h5>
                                <p class="card-text text-muted small mb-1"> Redeem your points for exclusive discounts and offers! </p>
                                <p class="card-text text-muted small fw-bold mb-3"> Every 1€ spent = 10 points </p>
                                <a href="/rewards" class="btn btn-mocha px-4 fw-bold" data-link>View Rewards</a>
                            </div>
                        </div>

                        <div class="mt-4 p-3 rounded-3 bg-light border border-matcha-light text-matcha-dark">
                            <p class="mb-0 small"><i class="bi bi-lightbulb-fill me-2"></i><strong>Mocher Tip: </strong>Every time you order a Matcha Latte Bruleé, you earn 60 points!</p>
                        </div>

                        <div class="mt-5 d-flex justify-content-between align-items-center">
                            <a href="/menu" class="btn btn-mocha px-4 fw-bold" data-link>
                                <i class="bi bi-book me-2"></i> Explore Menu
                            </a>
                            <button id="logout-btn" class="btn btn-outline-danger px-4 rounded-pill fw-bold">
                                <i class="bi bi-box-arrow-right me-2"></i> Logout
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    `;
}

export async function renderRewards() {
    const user = await ApiClient.fetchCurrentUser();

    if (!user) {
        page('/login');
        return;
    }

    const points = user.points || 0;

    const levels = [
        { name: 'Bronze', min: 0, benefit: 'Access to standard menu and points accumulation.' },
        { name: 'Silver', min: 500, benefit: 'Free upsize on all your Matcha drinks.' },
        { name: 'Gold', min: 1500, benefit: 'Free pastry with every order over 15€.' },
        { name: 'Diamond', min: 3000, benefit: 'VIP tastings, exclusive merch & birthday gifts.' }
    ];

    let levelsHtml = '';

    levels.forEach(level => {
        const isUnlocked = points >= level.min;

        // CORREGIDO: Lógica de texto en negrita si está desbloqueado, o gris si está bloqueado
        const textClass = isUnlocked ? 'text-mocha fw-bold' : 'text-muted fw-normal';

        let icon = '💎';
        if (level.name === 'Bronze') icon = '🥉';
        else if (level.name === 'Silver') icon = '🥈';
        else if (level.name === 'Gold') icon = '🥇';

        levelsHtml += `
            <div class="list-group-item border-0 d-flex align-items-center py-3 mb-2 rounded-4 ${isUnlocked ? 'level-unlocked' : 'level-locked'}">
                <div class="me-3 fs-3">${icon}</div>
                <div class="flex-grow-1">
                    <h6 class="mb-0 border-0 ${textClass}">${level.name}</h6>
                    <p class="small text-muted mb-0">${level.benefit}</p>
                </div>
                <div class="text-end">
                    <span class="badge rounded-pill text-matcha-subtle">${level.min} pts</span>
                </div>
            </div>
        `;
    });

    document.getElementById('app-content').innerHTML = `
        <div class="container my-5">
            <div class="text-center mb-5">
                <h1 class="display-5 fw-bold text-mocha">Mocher Rewards</h1>
                <p class="text-muted">Discover your exclusive benefits for being part of the community</p>
            </div>

            <div class="row g-4 justify-content-center">
                
                <div class="col-md-4">
                    <div class="card border-0 shadow-sm p-4 text-center h-100 card-mocha">
                        <h6 class="text-uppercase small fw-bold text-muted">Your Balance</h6>
                        <div class="display-1 fw-bold my-2 text-mocha">${points}</div>
                        <p class="mb-0 fw-bold text-uppercase text-matcha-subtle">Matcha Points</p>
                    </div>
                </div>

                <div class="col-md-7">
                    <div class="card border-0 shadow-sm p-4 h-100 card-mocha">
                        <h5 class="fw-bold mb-4 border-bottom pb-2 border-0 text-mocha">Mocher Levels</h5>
                        <div class="list-group list-group-flush">
                            ${levelsHtml}
                        </div>
                    </div>
                </div>
            </div>

            <div class="text-center mt-5">
                <a href="/profile" class="btn btn-mocha px-4" data-link>
                    Back to Profile
                </a>
            </div>
        </div>
    `;
}

export async function renderAdmin() {
    const user = await ApiClient.fetchCurrentUser();
    if (!user || user.role !== 'admin') { page('/login'); return; }

    const appContent = document.getElementById('app-content');
    appContent.innerHTML = `<div class="d-flex justify-content-center mt-5"><div class="spinner-border text-matcha-subtle" role="status"></div></div>`;

    const [products, orders] = await Promise.all([
        ApiClient.getAllProducts(),
        ApiClient.getAllOrders()
    ]);

    let productsHtml = '';
    products.forEach(product => {
        productsHtml += `
            <tr>
                <td>
                    <div class="d-flex align-items-center">
                        <img src="/images/${product.image}" class="rounded-3 me-2 img-40">
                        <span class="fw-bold small text-mocha">${product.name}</span>
                    </div>
                </td>
                <td class="text-muted small">${product.category}</td>
                <td class="fw-bold text-matcha-dark">${product.price.toFixed(2)}€</td>
                <td>
                    <span class="badge ${product.stock > 0 ? 'badge-matcha-outline' : 'bg-danger-subtle text-danger border border-danger'}">
                        ${product.stock > 0 ? product.stock + ' in stock' : 'Out of stock'}
                    </span>
                </td>
                <td>
                    <button class="btn btn-sm btn-outline-dark px-2 py-1 edit-product-btn" data-bs-toggle="modal" data-bs-target="#editProductModal" data-id="${product.id}" title="Edit Product"><i class="bi bi-pencil"></i></button>
                    <button class="btn btn-sm btn-outline-danger px-2 py-1 delete-product-btn" data-bs-toggle="modal" data-bs-target="#deleteModal" data-id="${product.id}" title="Delete"><i class="bi bi-trash"></i></button>
                </td>
            </tr>
        `;
    });

    let ordersHtml = '';
    if (orders.length === 0) {
        ordersHtml = `<tr><td colspan="5" class="text-center text-muted py-4">No orders yet. Time to promote that Matcha!</td></tr>`;
    } else {
        orders.forEach(order => {
            const statusBadge = order.status === 'completed'
                ? `<span class="badge badge-matcha-outline">Completed</span>`
                : `<span class="badge bg-warning text-dark border border-warning">Pending</span>`;

            ordersHtml += `
                <tr>
                    <td class="fw-bold text-mocha-wood">#${order.id}</td>
                    <td>
                        <div class="fw-bold small text-mocha"><i class="bi bi-person-circle me-1"></i> ${order.user_name || 'Guest'}</div>
                        <div class="text-muted small">${order.quantity}x ${order.product_name}</div>
                    </td>
                    <td class="fw-bold text-matcha-dark">${order.total ? order.total.toFixed(2) : '0.00'}€</td>
                    <td>${statusBadge}</td>
                    <td>
                        <button class="btn btn-sm px-2 py-1 complete-order-btn btn-outline-matcha">
                            <i class="bi bi-check-lg"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
    }

    const pendingOrdersCount = orders.filter(o => o.status !== 'completed').length;

    appContent.innerHTML = `
        <div class="container-fluid min-vh-100 py-4 bg-mocha-main">
            <div class="container">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 class="mb-0 border-0 text-mocha">Admin Dashboard <i class="bi bi-shield-lock text-mocha-wood"></i></h2>
                        <p class="text-muted small">Welcome back, Boss. Here's what's happening at Mocha today.</p>
                    </div>
                    <a href="/" class="btn btn-mocha px-4" data-link>Back to Store</a>
                </div>

                <div class="row g-4 mb-5">
                    <div class="col-md-4">
                        <div class="card-mocha p-4 h-100 border-bottom-wood">
                            <h6 class="text-muted fw-bold text-uppercase small">Total Products</h6>
                            <h2 class="display-5 fw-bold mb-0 border-0 text-mocha">${products.length}</h2>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="card-mocha p-4 h-100 border-bottom-matcha">
                            <h6 class="text-muted fw-bold text-uppercase small">Pending Orders</h6>
                            <h2 class="display-5 fw-bold mb-0 border-0 text-mocha">${pendingOrdersCount}</h2>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="card-mocha p-4 h-100 border-bottom-matcha-dark">
                            <h6 class="text-muted fw-bold text-uppercase small">Total Orders</h6>
                            <h2 class="display-5 fw-bold mb-0 border-0 text-mocha">${orders.length}</h2>
                        </div>
                    </div>
                </div>

                <div class="card-mocha p-4 mb-5">
                    <h5 class="fw-bold mb-4 text-mocha">Recent Orders</h5>
                    <div class="table-responsive">
                        <table class="table align-middle table-hover">
                            <thead>
                                <tr class="text-muted small text-uppercase">
                                    <th>Order #</th>
                                    <th>Customer</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${ordersHtml}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="card-mocha p-4">
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <h5 class="fw-bold mb-0 text-mocha">Manage Menu</h5>
                        <button class="btn btn-mocha px-4" data-bs-toggle="modal" data-bs-target="#addProductModal">
                            <i class="bi bi-plus-lg me-2"></i> Add Product
                        </button>
                    </div>
                    <div class="table-responsive">
                        <table class="table align-middle table-hover">
                            <thead>
                                <tr class="text-muted small text-uppercase">
                                    <th>Product</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>Stock</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${productsHtml}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="modal fade" id="addProductModal" tabindex="-1" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content bg-white rounded-12">
                            <div class="modal-header border-0">
                                <h5 class="modal-title fw-bold text-mocha">Add New Product</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <form id="add-product-form">
                                    <div class="mb-3">
                                        <label class="small fw-bold text-muted">Name</label>
                                        <input type="text" id="new-prod-name" class="form-control bg-light border-0" required>
                                    </div>
                                    <div class="row">
                                        <div class="col-6 mb-3">
                                            <label class="small fw-bold text-muted">Category</label>
                                            <select id="new-prod-category" class="form-select bg-light border-0">
                                                <option value="Coffee">Coffee</option>
                                                <option value="Matcha">Matcha</option>
                                                <option value="Desserts">Desserts</option>
                                                <option value="Shop">Shop</option>
                                            </select>
                                        </div>
                                        <div class="col-6 mb-3">
                                            <label class="small fw-bold text-muted">Image Filename</label>
                                            <input type="text" id="new-prod-image" class="form-control bg-light border-0" placeholder="e.g. matcha_cake.jpg" required>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-6 mb-3">
                                            <label class="small fw-bold text-muted">Price (€)</label>
                                            <input type="number" step="0.01" id="new-prod-price" class="form-control bg-light border-0" required>
                                        </div>
                                        <div class="col-6 mb-3">
                                            <label class="small fw-bold text-muted">Initial Stock</label>
                                            <input type="number" id="new-prod-stock" class="form-control bg-light border-0" value="100" required>
                                        </div>
                                    </div>
                                    <div class="mb-3">
                                        <label class="small fw-bold text-muted">Description</label>
                                        <textarea id="new-prod-desc" class="form-control bg-light border-0" rows="2"></textarea>
                                    </div>
                                    <button type="submit" class="btn btn-mocha w-100 mt-3 py-2 fw-bold" data-bs-dismiss="modal">Save Product</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal fade" id="editProductModal" tabindex="-1" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content bg-white rounded-12">
                            <div class="modal-header border-0">
                                <h5 class="modal-title fw-bold text-mocha">Edit Product</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <form id="edit-product-form">
                                    <input type="hidden" id="edit-prod-id">
                                    <div class="mb-3">
                                        <label class="small fw-bold text-muted">Name</label>
                                        <input type="text" id="edit-prod-name" class="form-control bg-light border-0" required>
                                    </div>
                                    <div class="row">
                                        <div class="col-6 mb-3">
                                            <label class="small fw-bold text-muted">Category</label>
                                            <select id="edit-prod-category" class="form-select bg-light border-0">
                                                <option value="Coffee">Coffee</option>
                                                <option value="Matcha">Matcha</option>
                                                <option value="Desserts">Desserts</option>
                                                <option value="Shop">Shop</option>
                                            </select>
                                        </div>
                                        <div class="col-6 mb-3">
                                            <label class="small fw-bold text-muted">Image Filename</label>
                                            <input type="text" id="edit-prod-image" class="form-control bg-light border-0" required>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-6 mb-3">
                                            <label class="small fw-bold text-muted">Price (€)</label>
                                            <input type="number" step="0.01" id="edit-prod-price" class="form-control bg-light border-0" required>
                                        </div>
                                        <div class="col-6 mb-3">
                                            <label class="small fw-bold text-muted">Stock</label>
                                            <input type="number" id="edit-prod-stock" class="form-control bg-light border-0" required>
                                        </div>
                                    </div>
                                    <div class="mb-3">
                                        <label class="small fw-bold text-muted">Description</label>
                                        <textarea id="edit-prod-desc" class="form-control bg-light border-0" rows="2"></textarea>
                                    </div>
                                    <button type="submit" class="btn btn-mocha w-100 mt-3 py-2 fw-bold" data-bs-dismiss="modal">Update Product</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal fade" id="deleteModal" tabindex="-1" aria-hidden="true">
                    <div class="modal-dialog modal-sm modal-dialog-centered">
                        <div class="modal-content bg-white rounded-15">
                            <div class="modal-body p-4 text-center">
                                <i class="bi bi-exclamation-triangle mb-3 d-block text-danger fs-1"></i>
                                <h5 class="fw-bold mb-2 border-0 text-mocha">Delete Product?</h5>
                                <p class="small text-muted mb-4">This action cannot be undone.</p>
                                <form id="delete-prod-form">
                                    <input type="hidden" id="delete-prod-id">
                                    <button type="button" class="btn btn-light w-100 mb-2 fw-bold" data-bs-dismiss="modal">Cancel</button>
                                    <button type="submit" class="btn btn-danger w-100 fw-bold" data-bs-dismiss="modal">Yes, delete</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    `;
}