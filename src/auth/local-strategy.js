import  express from "express";
import session from "express-session";
import passport from "passport";
import {Strategy as localStrategy } from 'passport-local';
//import { DBConnect, Users } from "./controller/controller.js";
import bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
dotenv.config();

const usuarios = [];


// regsitro
passport.use('register', new localStrategy({
    passReqToCallback: true
}, (req, username, password, done) => {
    const { email } = req.body;
    const user = usuarios.find((u) => u.username = username);

    if (user) return done('Usuario registrado');
    try {
        usuarios.push({username, password, email});
        const usrObj = {username, password, email};
        return done(null, usrObj)
    } catch (error) {
        return done(null, error)   
    }
    
}));

// Login
passport.use('login', new localStrategy({
    passReqToCallback: true
}, (req, username, password, done ) => {
    const user = usuarios.find( (user) => user.username == username && user.password == password);
    try {
        if (!user) return done(null, false, {message: 'Verifique los datos ingresados'});
        return done(null, user)
    } catch (error) {
        return done(error)
    }
    
}));

passport.serializeUser((user,done) => {
    done(null, user.username)
});

passport.deserializeUser((username, done) => {
    const user = usuarios.find((u) => u.username = username);
    try {
        done(null, user);
    } catch (error) {
        done(null, error)
    }
});

const app = express();
app.use(
    session({
        secret: 'soyunomasdelmonton',
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 60000
        },
    })
);

app.use(passport.initialize());
app.use(passport.session());

// midleware para utilizar json
app.use(express.json());
// midleware para utilizar formularios
app.use(express.urlencoded({extended: true}));

const authMW = (req, res, next) => {
    req.isAuthenticated() ? next() : res.send({ error: true, msg: 'sin sesion iniciada'});
}

app.get('/login', passport.authenticate('login', { failureMessage: 'error inesperado'}), (req, res) => {
    res.send(req.user);
});

app.post('/register', passport.authenticate('register', { failureMessage: 'error inesperado'}), (req, res) => {
    try {
        res.send(req.user);
    } catch (error) {
        console.log(error)
    }
    
});

app.get('/', (req, res) => {
    console.log('esto es un mensaje');
    res.send({ msg: 'Check is completed'}) 
})

app.get('/logout', (req, res) => {
    req.logOut();
    res.send('Sesion finalizada');
});

app.get('/datos', authMW, (req, res) => {
    res.send({erro: false, data: req.user});
})

// DBConnect(() => {
//     app.listen(process.env.PORT, () => console.log(`Server Conectado`));
// });
app.listen(8080, () => console.log('conectado'));