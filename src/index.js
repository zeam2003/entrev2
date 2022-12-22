import  express from "express";
import session from "express-session";
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from "url";
import sessionConfig from "./config/session.js";
import * as dotenv from 'dotenv';
import userRoutes from "./routes/index.js";
import handlebars from 'express-handlebars';
import ParseArgs from 'minimist';
import productRoutes from "./routes/product.js";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
    alias: {
        m: 'modo',
        p: 'port'
    },
    default: {
        modo: 'prod',
        port: 8080
    }
}

const argv = process.argv.slice(2);
const { modo, port, debug, otros:  _ } = ParseArgs(argv, options);

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
app.use('products',productRoutes);
// Handlebars
app.set('views', path.join( __dirname, 'views' ));
app.engine('.hbs', handlebars.create({
    defaultLayout: 'main',
    extname: '.hbs'
}).engine);
app.set('view engine', '.hbs')
// Carpeta Public
app.use(express.static(path.join(__dirname + '/public')));
// Iniciar Servidor
app.listen( port || process.env.PORT , () => console.log('Server inicalizado'))
