// public/js/templates/authPage.js
import { ApiClient } from '../api.js';

export async function renderLogin() {
    const user = await ApiClient.fetchCurrentUser();
    if (user) {
        if (user.role === 'admin') {
            page('/admin');
        } else {
            page('/profile');
        }
        page();
        return;
    }

    document.getElementById('app-content').innerHTML = `
        <div class="container my-5">
            <div class="row justify-content-center">
                <div class="col-md-5">
                    <div class="card shadow-sm border-0 p-4" class="bg-white rounded-12">
                        <h2 class="text-center mb-2" class="text-mocha-text">Welcome back Mocher!</h2>
                        <p class="text-center text-muted small mb-4">Introduce your credentials to login</p>

                        <div id="login-error" class="alert alert-danger border-0 small py-2 text-center mb-4 d-none" role="alert" class="bg-danger text-danger rounded-8"></div>

                        <form id="login-form">
                            <div class="mb-3">
                                <label class="form-label small fw-bold">Email</label>
                                <input type="email" id="login-email" class="form-control bg-light border-0" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label small fw-bold">Password</label>
                                <input type="password" id="login-password" class="form-control bg-light border-0" required>
                            </div>
                            <button type="submit" class="btn btn-mocha w-100 mt-3 py-2 fw-bold">Login</button>
                        </form>

                        <div class="text-center mt-4">
                            <p class="small text-muted">Don't have an account? <a href="/register" class="text-matcha-subtle" data-link>Sign up</a></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

export async function renderRegister() {
    const user = await ApiClient.fetchCurrentUser();
    if (user) {
        if (user.role === 'admin') {
            page('/admin');
        } else {
            page('/profile');
        }
        page();
        return;
    }

    document.getElementById('app-content').innerHTML = `
        <div class="container my-5">
            <div class="row justify-content-center">
                <div class="col-md-5">
                    <div class="card shadow-sm border-0 p-4" class="bg-white rounded-12">
                        <h2 class="text-center mb-2" class="text-mocha-text">Join the Mochers</h2>
                        <p class="text-center text-muted small mb-4">Create your account to enjoy exclusive benefits</p>
                        
                        <div id="register-error" class="alert alert-danger border-0 small py-2 text-center mb-4 d-none" role="alert" class="bg-danger text-danger rounded-8"></div>

                        <form id="register-form">
                            <div class="mb-3">
                                <label class="form-label small fw-bold text-muted">Complete Name</label>
                                <input type="text" id="reg-name" class="form-control bg-light border-0" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label small fw-bold text-muted">Birthday</label>
                                <input type="date" id="reg-birthday" class="form-control bg-light border-0" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label small fw-bold text-muted">Email</label>
                                <input type="email" id="reg-email" class="form-control bg-light border-0" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label small fw-bold text-muted">Password</label>
                                <input type="password" id="reg-password" class="form-control bg-light border-0" required>
                            </div>
                            <button type="submit" class="btn btn-mocha w-100 mt-3 py-2 fw-bold">Register</button>
                        </form>
                        
                        <div class="text-center mt-4">
                            <p class="small text-muted">Already a Mocher? <a href="/login" class="text-matcha-subtle" data-link>Sign in here</a></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}