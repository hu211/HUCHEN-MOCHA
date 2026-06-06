"use strict";

import sqlite3 from 'sqlite3';

class Product {
    constructor(id, name, description, price, category, image, stock, isTopSeller) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.category = category;
        this.image = image;
        this.stock = stock;
        this.isTopSeller = isTopSeller;
    }
}

class ProductDAO {
    constructor(dbPath) {
        this.db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                console.error('Could not connect to database', err);
            }
        });
    }

    async getAllProducts() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM products';
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    return reject(err);
                }
                const products = rows.map(row => new Product(row.id, row.name, row.description, row.price, row.category, row.image, row.stock, row.is_top_seller));
                resolve(products);
            });
        });
    }

    async searchProducts(query) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM products WHERE name LIKE ? OR description LIKE ?';
            const params = [`%${query}%`, `%${query}%` ];

            this.db.all(sql, params, (err, rows) => {
                if (err) {
                    return reject(err);
                }
                const products = rows.map(row => new Product(row.id, row.name, row.description, row.price, row.category, row.image, row.stock, row.is_top_seller));
                resolve(products);
            });
        });
    }

    async getProductById(id) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM products WHERE id = ?';
            this.db.get(sql, [id], (err, row) => {
                if (err) {
                    return reject(err);
                }
                if (!row) {
                    return resolve(null);
                }
                resolve(new Product(row.id, row.name, row.description, row.price, row.category, row.image, row.stock, row.is_top_seller));
            });
        });
    }

    async getTopSellers() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM products WHERE is_top_seller = 1';
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    return reject(err);
                }
                const products = rows.map(row => new Product(row.id, row.name, row.description, row.price, row.category, row.image, row.stock, row.is_top_seller));
                resolve(products);
            });
        });
    }

    // Actualizar TODO el producto
    async updateProduct(id, productData) {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE products SET name = ?, description = ?, price = ?, category = ?, image = ?, stock = ? WHERE id = ?';
            this.db.run(sql, [
                productData.name, 
                productData.description, 
                productData.price, 
                productData.category, 
                productData.image, 
                productData.stock, 
                id
            ], function(err) {
                if (err) return reject(err);
                resolve(this.changes > 0);
            });
        });
    }

    // 2. Eliminar Producto
    async deleteProduct(id) {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM products WHERE id = ?';
            this.db.run(sql, [id], function(err) {
                if (err) return reject(err);
                resolve(this.changes > 0);
            });
        });
    }

    // 3. Añadir Producto Nuevo
    async addProduct(name, description, price, category, image, stock) {
        return new Promise((resolve, reject) => {
            // is_top_seller lo ponemos a 0 por defecto
            const sql = `INSERT INTO products (name, description, price, category, image, stock, is_top_seller) VALUES (?, ?, ?, ?, ?, ?, 0)`;
            this.db.run(sql, [name, description, price, category, image, stock], function(err) {
                if (err) return reject(err);
                resolve(this.lastID);
            });
        });
    }
}

class User {
    constructor(id, email, password, name, role, points) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.name = name;
        this.role = role;
        this.points = points;
    }
}

class UserDAO {
    constructor(dbPath) {
        this.db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                console.error('Could not connect to database', err);
            }
        });
    }

    async createUser(name, birthday, email, password) {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO users (name, birthday, email, password, role) VALUES (?, ?, ?, ?, 'mocher')`;
        this.db.run(sql, [name, birthday, email, password], function(err) {
            if (err) return reject(err);
            resolve(this.lastID);
        });
    });
}

    async authenticateUser(email, password) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';
            this.db.get(sql, [email, password], (err, row) => {
                if (err) {
                    return reject(err);
                }
                if (!row) {
                    return resolve(null);
                }
                resolve(new User(row.id, row.email, row.password, row.name, row.role, row.points));
            });
        });
    }

    async getUserById(id) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM users WHERE id = ?';
            this.db.get(sql, [id], (err, row) => {
                if (err) {
                    return reject(err);
                }
                if (!row) {
                    return resolve(null);
                }
                resolve(new User(row.id, row.email, row.password, row.name, row.role, row.points));
            });
        });
    }

    async addPoints(userId, points) {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE users SET points = points + ? WHERE id = ?';
            this.db.run(sql, [points, userId], function(err) {
                if (err) return reject(err);
                resolve(this.changes > 0);
            });
        });
    }
}

class Order {
    constructor(id, productId, quantity, status) {
        this.id = id;
        this.productId = productId;
        this.quantity = quantity;
        this.status = status;
    }
}

class OrderDAO {
    constructor(dbPath) {
        this.db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                console.error('Could not connect to database', err);
            }
        });
    }

    async createOrder(userName, cart) {
        return new Promise((resolve, reject) => {
            // Usamos serialize para ejecutar los pasos en orden
            this.db.serialize(() => {
                this.db.run("BEGIN TRANSACTION"); // Empezamos la transacción
                
                // Preparamos la consulta SQL
                const stmt = this.db.prepare(`INSERT INTO order_items (user_name, product_id, quantity, status) VALUES (?, ?, ?, 'pending')`);
                
                // Recorremos el carrito y guardamos fila por fila
                for (let item of cart) {
                    stmt.run([userName, item.id, item.quantity]);
                }
                
                stmt.finalize();
                
                // Confirmamos y guardamos los datos
                this.db.run("COMMIT", (err) => {
                    if (err) {
                        this.db.run("ROLLBACK"); // Si hay error, cancelamos
                        return reject(err);
                    }
                    resolve(true);
                });
            });
        });
    }

    // Función para obtener los pedidos en el admin
    async getAllOrders() {
        return new Promise((resolve, reject) => {
            // Unimos order_items con products para saber el nombre del producto y calcular el total
            const query = `
                SELECT 
                    order_items.id, 
                    order_items.user_name, 
                    order_items.status, 
                    order_items.quantity,
                    products.name AS product_name,
                    (order_items.quantity * products.price) AS total
                FROM order_items
                JOIN products ON order_items.product_id = products.id
                ORDER BY order_items.id ASC
            `;
            
            this.db.all(query, [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }
    

    async updateOrderStatus(orderId, status) {
        return new Promise((resolve, reject) => {
            
            // 1. Miramos qué producto es y cuántos pidieron
            const sqlSelect = "SELECT status, product_id, quantity FROM order_items WHERE id = ?";
            
            this.db.get(sqlSelect, [orderId], (err, order) => {
                if (err) return reject(err);
                
                // 🛡️ ESCUDO: Si no existe o ya está completado, paramos para no restar doble
                if (!order || order.status === status) {
                    return resolve(false); 
                }

                // 2. Marcamos el pedido como completado
                const sqlUpdateOrder = "UPDATE order_items SET status = ? WHERE id = ?";
                
                this.db.run(sqlUpdateOrder, [status, orderId], (err) => {
                    if (err) return reject(err);

                    // 3. Restamos el stock SOLO a los postres y a la tienda
                    if (status === 'completed') {
                        const sqlStock = `
                            UPDATE products 
                            SET stock = stock - ? 
                            WHERE id = ? AND category IN ('Desserts', 'Shop')
                        `;
                        
                        this.db.run(sqlStock, [order.quantity, order.product_id], (err) => {
                            if (err) return reject(err);
                            
                            resolve(true); // Todo actualizado correctamente
                        });
                    } else {
                        resolve(true);
                    }
                });
            });
        });
    }
}

export { ProductDAO, Product, UserDAO, User, OrderDAO, Order};