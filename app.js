import  express from "express";
import cors from 'cors';

import session from "./src/config/session.js";
import passport from "passport";
import passportConfig from "./src/config/passport.js";
import * as UserService from './src/services/user.service.js'
import * as dotenv from 'dotenv';
import corsMiddleware from "./src/middlewares/cors.middleware.js";
import path from 'path';
import { fileURLToPath } from "url";

dotenv.config();


// Manejo de File Path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Iniciar Express
const app = express();

// Data on wire - Servidor que no sirve html
app.set('trust proxy', 1);
/* app.use(cors({
    origin: '*',
    credentials: true,
    methods: 'GET, POST, PATCH, PUT, DELETE'})); */
//app.use(corsMiddleware)
app.use(cors({origin: true, credentials: true}));

// Configuración del Servidor
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Configuración de Rutas Estaticas
app.use(express.static(path.join(__dirname + '/public')));
app.use(express.static(path.join(__dirname + '/uploads')));

// Manejo de sessiones
app.use(session);

// Estrategia de validacion: passport
passportConfig(passport, UserService);
app.use(passport.initialize());
app.use(passport.session());



// exportar app
export default app;