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
        console.log(connection.mongoDB.uri);
        await mongoose.connect(connection.mongoDB.uri, connection.mongoDB.options,{strictQuery: true})
        
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


passport.use('dashboard', new Strategy({}, (username, password, done) => {
    console.log(username, password)
    Users.findOne({username}, (err, user) => {
        try {
            
            if(!user) {
                console.log('no se econtro el usuario')
                return done(null, false);
            } if (!validatePass(password, user.password)) {
                return done(null, false);
            } else {
                return done(null, user)
            }
            
            
        } catch (error) {
            console.log(error)
            return done(error)
        }
        
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
    req.isAuthenticated() ? next() : res.redirect('/noauth')
}

userRoutes.get('/', (req, res) => {
    try {
        res.render('index')
    } catch (error) {
        console.log(error)
    }
})

// Ingreso
userRoutes.post('/dashboard', passport.authenticate('dashboard', {failureRedirect: '/error'}), (req, res ) => {
    try {
        const { username, password } = req.body;
        console.log('hola')
        console.log('usuario',req.user)
        res.render('list', {username} )
    } catch (error) {
        console.log(error)
    }
});

userRoutes.get('/dashboard', authMW,(req, res) => {
    if(!req.user) {
        res.redirect('/')
    }else{
        const { username } = req.user;
        res.render('list', {username})
    }
    
})


// Lista o vista principal despues del login
userRoutes.get('/list', authMW,(req, res) => {
    const { username } = req.user;
    res.render('list',{username})
})

// Vista de Error
userRoutes.get('/error', (req, res) => {
    res.render('error');
})


// signin
userRoutes.post('/signup', passport.authenticate('signup', {failureRedirect: '/error'}) , ( req, res ) => {
    res.send({error: false, msg: 'usuario creado'})
});

userRoutes.get('/signin', (req, res) => {
    res.render('signin')
})


// datos
userRoutes.get('/datos', authMW, (req, res) => {
    res.send({hola: 'mundo', data: req.user})
})

userRoutes.get('/prueba', (req, res) => {
    console.log('hola')
})

// logout
userRoutes.get('/logout', (req, res) => {
    req.logout(req.user, err => {
        if(err) return next(res.redirect('/error'));
        res.redirect('/')
    });
    
})

// authorizations
userRoutes.get('/noauth', (req, res) => {
    res.render('noauth');
})



export default userRoutes;