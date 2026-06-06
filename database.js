"use strict";

import sqlite from 'sqlite3';
const sqlite3 = sqlite.verbose();

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite.Database(dbPath);

db.serialize(() => {
    // 1. Limpiamos las estanterías viejas para no duplicar datos al reiniciar
    db.run(`DROP TABLE IF EXISTS order_items`); 
    db.run(`DROP TABLE IF EXISTS products`); 
    db.run(`DROP TABLE IF EXISTS users`); 

    // 2. Creamos las tablas limpias
    db.run(`CREATE TABLE products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        category TEXT,
        image TEXT,
        stock INTEGER DEFAULT 0,
        is_top_seller INTEGER DEFAULT 0
    )`);

    db.run(`CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        birthday DATE,
        role TEXT NOT NULL,      -- 'admin' o 'mocher'
        points INTEGER DEFAULT 0
    )`);

    db.run(`CREATE TABLE order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_name TEXT, 
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        status TEXT DEFAULT 'pending',  -- 'pending', 'completed', 'cancelled'
        FOREIGN KEY (product_id) REFERENCES products(id)
    )`);

    // 3. Insertamos Usuarios
    const insertUser = db.prepare(`INSERT INTO users (name, birthday, email, password, role, points) VALUES (?, ?, ?, ?, ?, ?)`);
    insertUser.run("Cristina Hu", "2002-11-21", "cristina.hu@example.com", "password123", "admin", 0);
    insertUser.run("John Doe", "1990-05-15", "john.doe@example.com", "password456", "mocher", 2000);
    insertUser.finalize();

    // 4. Insertamos Productos
    const insertProduct = db.prepare(`INSERT INTO products (name, description, price, category, image, stock, is_top_seller) VALUES (?, ?, ?, ?, ?, ?, ?)`);

    insertProduct.run("Espresso", "A classic espresso made with our signature blend of coffee beans, delivering a rich and intense flavor.", 2.50, "Coffee", "espresso.jpg", 999, 0);
    insertProduct.run("Cappuccino", "A perfect balance of espresso, steamed milk, and frothy milk foam, topped with a sprinkle of cocoa powder.", 2.80, "Coffee", "cappuccino.jpg", 999, 0);
    insertProduct.run("Latte", "A creamy and smooth latte made with our premium espresso and steamed milk, topped with a light layer of foam.", 3.80, "Coffee", "latte.jpg", 999, 0);
    insertProduct.run("Americano", "A bold and robust Americano made by diluting our rich espresso with hot water, perfect for those who prefer a lighter coffee.", 2.60, "Coffee", "americano.jpg", 999, 0);
    insertProduct.run("Flat White", "A velvety smooth flat white made with our signature espresso and steamed milk, topped with a thin layer of microfoam.", 3.20, "Coffee", "flat_white.jpg", 999, 0);
    insertProduct.run("Mocha", "A decadent mocha made with our signature espresso, steamed milk, and rich chocolate syrup.", 4.50, "Coffee", "mocha.jpg", 999, 0);
    insertProduct.run("Iced Mocha", "A refreshing iced mocha made with our signature espresso, cold milk, and chocolate syrup, served over ice.", 5.00, "Coffee", "iced_mocha.jpg", 999, 0);
    insertProduct.run("Iced Latte", "A cool and creamy iced latte made with our premium espresso and cold milk, served over ice.", 4.00, "Coffee", "iced_latte.jpg", 999, 0);
    insertProduct.run("Iced Americano", "A crisp and invigorating iced Americano made by diluting our rich espresso with cold water, served over ice.", 4.00, "Coffee", "iced_americano.jpg", 999, 0);

    insertProduct.run("Coffee Einspanner", "A Viennese classic, the Einspänner is a strong espresso topped with a generous dollop of whipped cream.", 6.00, "Coffee", "einspanner.jpg", 999, 0);
    insertProduct.run("Coffee Tiramisu", "A delightful twist on the classic Italian dessert, our Coffee Tiramisu features layers of espresso-soaked ladyfingers and mascarpone cream.", 6.00, "Coffee", "coffee_tiramisu.jpg", 999, 1);
    insertProduct.run("Coffee Latte Bruleé", "A luxurious dessert that combines the rich flavors of coffee with the creamy texture of a latte, topped with a caramelized sugar crust.", 6.00, "Coffee", "latte_brulee.jpg", 999, 1);
    insertProduct.run("Americano Cocowater", "A refreshing blend of our bold Americano and the natural sweetness of coconut water, perfect for a hot day.", 5.50, "Coffee", "americano_cocowater.jpg", 999, 0);

    insertProduct.run("Ceramonial Matcha", "A premium ceremonial grade matcha, perfect for traditional tea ceremonies or enjoying a high-quality matcha experience at home.", 3.50, "Matcha", "ceremonial_matcha.jpg", 999, 0);
    insertProduct.run("Matcha Latte", "Our signature matcha latte made with premium matcha powder and steamed milk.", 4.50, "Matcha", "matcha_latte.jpg", 999, 0);
    insertProduct.run("Iced Matcha Latte", "A refreshing iced matcha latte made with our signature matcha powder and cold milk, served over ice.", 5.50, "Matcha", "iced_matcha_latte.jpg", 999, 0);
    insertProduct.run("Matcha Strawberry Tiramisu", "A tasty twist on the classic tiramisu, matcha with matcha cream and fresh strawberries.", 6.90, "Matcha", "matcha_strawberry_tiramisu.jpg", 999, 1);
    insertProduct.run("Matcha Einspanner", "A unique take on the Viennese classic, our Matcha Einspänner features a strong matcha topped with a generous dollop of whipped cream.", 6.00, "Matcha", "matcha_einspanner.jpg", 999, 0);
    insertProduct.run("Matcha Latte Bruleé", "A luxurious dessert that combines the rich flavors of matcha with the creamy texture of a latte, topped with a caramelized sugar crust.", 6.00, "Matcha", "matcha_latte_brulee.jpg", 999, 1);
    insertProduct.run("Matcha Top Cocowater", "A refreshing blend of matcha and coconut water, perfect for a hot day.", 6.00, "Matcha", "matcha_top_cocowater.jpg", 999, 1);

    insertProduct.run("Classic 'Mocha' Crepes", "Delicious crepes filled with our signature mocha cream and topped with chocolate drizzle.", 6.00, "Desserts", "mocha_crepes.jpg", 100, 0);
    insertProduct.run("Matcha Crepes", "Delicious crepes filled with matcha cream and topped with fresh fruits.", 7.50, "Desserts", "matcha_crepes.jpg",100, 1);
    insertProduct.run("Classic Cheesecake", "A rich and creamy cheesecake made with our signature blend of cream cheese and a buttery graham cracker crust.", 4.50, "Desserts", "cheesecake.jpg", 0, 0);
    insertProduct.run("Matcha Cheesecake", "A rich and creamy cheesecake infused with the unique flavor of matcha.", 5.00, "Desserts", "matcha_cheesecake.jpg", 100, 1);
    insertProduct.run("Red Velvet Cake", "A decadent red velvet cake made with our signature blend of cocoa and a hint of vanilla, topped with cream cheese frosting.", 4.50, "Desserts", "red_velvet_cake.jpg", 5, 0);
    insertProduct.run("Carrot Cake", "A moist and flavorful carrot cake made with fresh carrots, warm spices, and a creamy cream cheese frosting.", 4.50, "Desserts", "carrot_cake.jpg", 50, 0);
    insertProduct.run("Matcha Mochi", "A delightful Japanese dessert made with glutinous rice flour and filled with sweet matcha-flavored filling.", 4.00, "Desserts", "matcha_mochi.jpg", 100, 0);
    insertProduct.run("Matcha Croissant", "A flaky and buttery croissant infused with the unique flavor of matcha, perfect for a morning treat.", 3.00, "Desserts", "matcha_croissant.jpg", 70, 0);

    insertProduct.run("Pack Ceremonial Matcha 30g", "A premium ceremonial grade matcha, perfect for traditional tea ceremonies or enjoying a high-quality matcha experience at home.", 15.00, "Shop", "matcha01.jpg", 50, 0);
    insertProduct.run("Pack Ceremonial Matcha 60g", "A premium ceremonial grade matcha, perfect for traditional tea ceremonies or enjoying a high-quality matcha experience at home.", 28.00, "Shop", "matcha02.jpg", 50, 0);

    insertProduct.finalize();

    console.log('Database initialized correctly');
});

// 5. IMPORTANTE: Exportamos la base de datos abierta para que la use el DAO
export default db;