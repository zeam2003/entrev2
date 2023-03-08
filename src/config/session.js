import MongoStore from "connect-mongo";
import session from "express-session";
import * as dotenv from 'dotenv';

dotenv.config();

// Conectamos a Mongo
const sessionStore = MongoStore.create({
    mongoUrl: process.env.MONGO,
});


// Configuramos los parametros de la session
export default session({
    store: sessionStore,
    secret: 'EstoEsUnSecretoNoDivulgar',
    resave: true,
    rolling: false,
    saveUninitialized: false,
    unset: 'destroy',
    cookie: {
        sameSite: 'none',
        secure: true,
        httpOnly: true,
        maxAge: 8600000
    },
});