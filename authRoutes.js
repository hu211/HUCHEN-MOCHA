import express from 'express';
import passport from 'passport';
import { UserDAO } from '../data/dao.js';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const userDAO = new UserDAO(path.resolve(__dirname, '../data/database.sqlite'));

// Login
router.post('/login', passport.authenticate('local'), (req, res) => {
    res.json(req.user);
});

// Logout
router.post('/logout', (req, res) => {
    req.logout((err) => {
        if (err) return res.status(500).json({ error: "Error al cerrar sesión" });
        res.json({ message: "Sesión cerrada" });
    });
});

// Current User
router.get('/current-user', (req, res) => {
    req.isAuthenticated() ? res.json(req.user) : res.status(401).json({ error: "No logueado" });
});

// Register
router.post('/register', async (req, res) => {
    const { name, birthday, email, password } = req.body;
    try {
        await userDAO.createUser(name, birthday, email, password);
        const user = await userDAO.authenticateUser(email, password);
        req.login(user, (err) => {
            if (err) return res.status(500).json({ error: "Error en auto-login" });
            res.json(user);
        });
    } catch (err) { res.status(500).json({ error: "Error en registro" }); }
});

export default router;