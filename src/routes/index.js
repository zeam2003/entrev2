import { Router } from "express";
import passport from "passport";
import mongoose from "mongoose";
import {Strategy} from 'passport-local';
import bcrypt from 'bcrypt';
import connection from '../config/connection.js'
import { Usuario as Users } from "../models/users.js";

const userRoutes = Router();

(async () => {
    try {
        await mongoose.connect(connection.mongoDB.uri, connection.mongoDB.options)
    } catch (error) {
        throw new Error(error);
    }
})();

// signup
passport.use('signup', new Strategy(
    {
        passReqToCallback: true
    }, 
    (req, username, password, done) => {
        
        const { email } = req.body;
        Users.findOne({username}, (err, user) => {
            if(user) {
                console.log('ya existe')

                return done(null, false);
            }
            Users.create({username, password: hasPassword(password), email}, (err, user) => {
                if(err) return done(err);

                return done(null, user)
            });
        });
}));


passport.use('login', new Strategy({}, (username, password, done) => {
    console.log(username)
    Users.findOne({username}, (err, user) => {
        if(err) return done(err);
        if(!user) return done(null, false);
        if(!validatePass(password, user.password)) return done(null, false);
            return done(null, user)
    });
}));

const hasPassword = (pass) => {
    let nuevoPass = pass.toString();
    return bcrypt.hashSync(nuevoPass, bcrypt.genSaltSync(10), null)
}

const validatePass = (pass,hashedPass) => {
    let nuevoPass = pass.toString();
    return bcrypt.compareSync(nuevoPass, hashedPass);
}

passport.serializeUser((user, done) => {
    done(null, user._id)
});

passport.deserializeUser((id, done) => {
    Users.findById(id, done);

});


userRoutes.use(passport.initialize());
userRoutes.use(passport.session());


const authMW = (req, res, next) => {
    req.isAuthenticated() ? next() : res.send({ error: 'error'})
}

userRoutes.post('/login', passport.authenticate('login', {failureRedirect: '/error'}), (req, res ) => {
    
    res.send({error: false});
    //res.redirect('/home');
});

// signin
userRoutes.post('/signup', passport.authenticate('signup', {failureRedirect: '/error'}) , ( req, res ) => {
    console.log('estoy aca')
   // const { user } = req.body
    // console.log(user)
    res.send({error: false, msg: 'usuario creado'})
});


// datos
userRoutes.get('/datos', authMW, (req, res) => {
    
    res.send({hola: 'mundo', data: req.user})
})

userRoutes.get('/prueba', (req, res) => {
    console.log('hola')
})


export default userRoutes;