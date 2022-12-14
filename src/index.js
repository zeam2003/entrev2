import  express from "express";
import session from "express-session";
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from "url";
import { DBConnect, Users } from "./controller/controller.js";
import sessionConfig from "./config/session.js";
import * as dotenv from 'dotenv';
import userRoutes from "./routes/index.js";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Iniciar Express
const app = express();
// midleware para utilizar json
app.use(express.json());
// midleware para utilizar formularios
app.use(express.urlencoded({extended: true}));
// Manejo de sessiones
app.use(session(sessionConfig))
// Cors
app.use(cors({origin: true, credentials: true}));
// Rutas
app.use(userRoutes);
// Carpeta Public
app.use(express.static(path.join(__dirname + '/public')));
// Iniciar Servidor
app.listen(process.env.PORT, () => console.log('Server inicalizado'))
