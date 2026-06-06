// public/js/api.js
export class ApiClient {
    static async fetchCurrentUser() {
        try {
            const res = await fetch('/api/auth/current-user', { credentials: 'include' });
            return res.ok ? await res.json() : null;
        } catch (e) { return null; }
    }
    
    static async getAllProducts() {
        try {
            const response = await fetch('/api/products');
            if (!response.ok) throw new Error('Error getting products');
            return await response.json();
        } catch (error) {
            console.error("Error in API:", error);
            return [];
        }
    }

    static async getTopSellers() {
        try {
            const response = await fetch('/api/products/top');
            if (!response.ok) throw new Error('Error getting Top sellers');
            return await response.json();
        } catch (error) {
            console.error("Error in API:", error);
            return [];
        }
    }

    static async searchProducts(query) {
        try {
            const response = await fetch(`/api/products/search?q=${encodeURIComponent(query)}`);
            if (!response.ok) throw new Error('Error searching products');
            return await response.json();
        } catch (error) {
            console.error("Error in API search:", error);
            return [];
        }
    }

    static async getProductById(id) {
        try {
            const response = await fetch(`/api/products/${id}`);
            if (!response.ok) throw new Error('Error getting product details');
            return await response.json();
        } catch (error) {
            console.error("Error in API product details:", error);
            return null;
        }
    }

    static async submitOrder(cart, userName, userId) {
        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify({ cart: cart, userName: userName , userId: userId }),
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Error submitting order');
            }

            return await response.json();
        } catch (error) {
            console.error("Error in checkout API:", error);
            return null; 
        }
    }

    static async loginUser(email, password) {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
            credentials: 'include'
        });
        return res.ok ? await res.json() : null;
    }

    static async getUserProfile(id) {
        try {
            const response = await fetch(`/api/auth/user/${id}`);
            if (!response.ok) throw new Error('Error getting user profile');
            return await response.json();
        } catch (error) {
            console.error("Error in API user profile:", error);
            return null;
        }
    }

    static async registerUser(name, birthday, email, password) {
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, birthday, email, password }),
                credentials: 'include' 
            });

            if (!response.ok) {
                return null;
            }

            return await response.json();
        } catch (error) {
            console.error("Error de conexión en registro:", error);
            return null;
        }
    }

    static async getAllOrders() {
        try {
            const response = await fetch('/api/admin/orders');
            if (!response.ok) {
                return []; 
            }
            return await response.json(); 
        } catch (error) {
            console.error("Error de conexión:", error);
            return [];
        }
    }

    static async updateOrderStatus(orderId) {
        try {
            const response = await fetch(`/api/admin/orders/${orderId}/complete`, {
                method: 'PUT',
                credentials: 'include'
            });
            return response.ok; 
        } catch (error) {
            console.error("Error al actualizar el pedido:", error);
            return false;
        }
    }

    static async updateProduct(id, productData) {
        try {
            const res = await fetch(`/api/admin/products/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData),
                credentials: 'include'
            });
            return res.ok;
        } catch(e) { return false; }
    }

    static async deleteProduct(id) {
        try {
            const res = await fetch(`/api/admin/products/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            return res.ok;
        } catch(e) { return false; }
    }

    static async addProduct(productData) {
        try {
            const res = await fetch(`/api/admin/products`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData),
                credentials: 'include'
            });
            return res.ok;
        } catch(e) { return false; }
    }
}