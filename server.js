import express from 'express';
import session from 'express-session';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import path from 'path';
import { fileURLToPath } from 'url';

// Importar rutas y DAO
import authRoutes from './routes/authRoutes.js';
import apiRoutes from './routes/apiRoutes.js';
import { UserDAO } from './data/dao.js';

// Configuración de rutas para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Inicializar base de datos
const userDAO = new UserDAO(path.join(__dirname, 'data', 'database.sqlite'));

// Configuración de EJS (El motor de plantillas exigido)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares globales
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// 1. Configuración de Sesión
app.use(session({
    secret: 'mocha_secret_2026',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Localhost no requiere HTTPS
}));

// 2. Inicializar Passport
app.use(passport.initialize());
app.use(passport.session());

// 3. Estrategia de Autenticación Local con Passport
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const user = await userDAO.authenticateUser(email, password);
        if (!user) {
            return done(null, false, { message: 'Incorrect credentials' });
        }
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        // Obtenemos todos los datos del usuario para tenerlos disponibles en req.user
        const user = await userDAO.getUserById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

// 4. Rutas de la API (Tus controladores modulares)
app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes);

// 5. Fallback para SPA (Single Page Application con EJS)
// Usamos app.use sin ruta para evitar los errores de RegExp de Express 5
app.use((req, res, next) => {
    // Si la petición es GET y NO va dirigida a la API (/api/...)
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
        // Renderizamos nuestra página principal (SPA)
        return res.render('index', { user: req.user || null });
    }

    // Si es una ruta de API o un POST, dejamos que siga su camino
    next();
});

// 6. Manejo de Errores Globales de la API
app.use('/api', (req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Arrancar Servidor
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});