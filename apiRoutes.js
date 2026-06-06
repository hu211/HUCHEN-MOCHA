import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
// Importamos tus clases desde el DAO
import { ProductDAO, UserDAO, OrderDAO } from '../data/dao.js';

const router = express.Router();

// Configuración de rutas para importar la DB
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../data/database.sqlite');

// Instanciamos tu DAO
const productDAO = new ProductDAO(dbPath);
const userDAO = new UserDAO(dbPath);
const orderDAO = new OrderDAO(dbPath);

// --- RUTAS DE LA API ---

// 1. Obtener todos los productos (GET /api/products)
router.get('/products', async (req, res) => {
    try {
        const products = await productDAO.getAllProducts();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: "Error getting products" });
    }
});

// 2. Buscar productos (GET /api/products/search?q=matcha)
router.get('/products/search', async (req, res) => {
    const query = req.query.q;
    try {
        const products = await productDAO.searchProducts(query);
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: "Error searching products" });
    }
});

// 3. Obtener los productos Top Sellers (GET /api/products/top)
router.get('/products/top', async (req, res) => {
    try {
        const topProducts = await productDAO.getTopSellers();
        res.json(topProducts);
    } catch (err) {
        res.status(500).json({ error: "Error getting top sellers" });
    }
});

// 4. Obtener detalles de un producto por ID (GET /api/products/:id)
router.get('/products/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const product = await productDAO.getProductById(id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: "Product not found" });
        }
    } catch (err) {
        res.status(500).json({ error: "Error getting product details" });
    }
});

// POST /api/checkout - Recibir la cesta y guardarla en la Base de Datos
router.post('/checkout', async (req, res) => {
    const { cart, userName, userId } = req.body;

    if (!cart || cart.length === 0) {
        return res.status(400).json({ error: "El carrito está vacío" });
    }

    try {
        let cartSubtotal = 0;
        for (let item of cart) {
            const product = await productDAO.getProductById(item.id);
            if (product) {
                cartSubtotal += product.price * item.quantity;
            }
            await orderDAO.createOrder(userName, [item]);
        }

        let total = cartSubtotal * 1.10; // Subtotal + IVA
        let pointsToAdd = Math.floor(total) * 10;
        
        if(userId) {
            await userDAO.addPoints(userId, pointsToAdd);
        }

        res.json({ message: "Order processed successfully", pointsEarned: pointsToAdd });

    } catch (err) {
        console.error("Error saving order:", err);
        res.status(500).json({ error: "Error in the server while processing the order" });
    }
});

// GET /api/user/:id - Get user details by ID
router.get('/user/:id', async (req, res) => {
    try {
        const user = await userDAO.getUserById(req.params.id);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (err) {
        console.error("Error getting user details:", err);
        res.status(500).json({ error: "Server error getting user details" });
    }
});

// GET /api/admin/orders - Get all orders (for admin dashboard)
router.get('/admin/orders', async (req, res) => {
    try {
        const orders = await orderDAO.getAllOrders();
        res.json(orders);
    } catch (err) {
        console.error("Error getting orders for admin:", err);
        res.status(500).json({ error: "Server error getting orders" });
    }
});

// PUT /api/admin/orders/:id/complete - Update order status to completed (for admin dashboard)
router.put('/admin/orders/:id/complete', async (req, res) => {
    try {
        const orderId = req.params.id;
        await orderDAO.updateOrderStatus(orderId, 'completed');
        res.json({ message: "Order status updated successfully" });
    } catch (err) {
        console.error("Error updating order status:", err);
        res.status(500).json({ error: "Server error updating order status" });
    }
});

// PUT /api/admin/products/:id - Editar Producto Completo
router.put('/admin/products/:id', async (req, res) => {
    try {
        await productDAO.updateProduct(req.params.id, req.body);
        res.json({ success: true });
    } catch (err) {
        console.error("Error actualizando producto:", err);
        res.status(500).json({ error: "Error updating product" });
    }
});

// DELETE /api/admin/products/:id - Eliminar Producto
router.delete('/admin/products/:id', async (req, res) => {
    try {
        await productDAO.deleteProduct(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: "Error deleting product" });
    }
});

// POST /api/admin/products - Añadir Producto
router.post('/admin/products', async (req, res) => {
    try {
        const { name, description, price, category, image, stock } = req.body;
        await productDAO.addProduct(name, description, price, category, image || 'default.jpg', stock);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: "Error adding product" });
    }
});

export default router;