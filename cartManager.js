// public/js/cartManager.js

export class CartManager {
    static getCart() { return JSON.parse(localStorage.getItem('mocha_cart')) || []; }
    static saveCart(cart) { localStorage.setItem('mocha_cart', JSON.stringify(cart)); }
    static addToCart(productId) {
        let cart = this.getCart();
        const item = cart.find(i => i.id == productId);
        item ? item.quantity += 1 : cart.push({ id: productId, quantity: 1 });
        this.saveCart(cart);
    }
    static changeQuantity(productId, delta) {
        let cart = this.getCart();
        const item = cart.find(i => i.id == productId);
        if (item) {
            item.quantity += delta; 
            if (item.quantity <= 0) cart = cart.filter(i => i.id != productId);
            this.saveCart(cart);
        }
    }
    static removeFromCart(productId) {
        this.saveCart(this.getCart().filter(i => i.id != productId));
    }

    static clearCart() { localStorage.removeItem('mocha_cart'); }
}