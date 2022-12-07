import  express from "express";
import session from "express-session";
import passport from "passport";
import {Strategy} from 'passport-local';
import { DBConnect, Users } from "./controller/controller.js";
import bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
dotenv.config();



const app = express();
// midleware para utilizar json
app.use(express.json());
// midleware para utilizar formularios
app.use(express.urlencoded({extended: true}));

// signup
passport.use('signup', new Strategy(
    {
        passReqToCallback: true
    }, 
    (req, username, password, done) => {
        const { email } = req.body;
        Users.findOne({username}, (err, user) => {
            if(user) return done(null, false);
            Users.create({username, password: hasPassword(password), email}, (err, user) => {
                if(err) return done(err);

                return done(null, user)
            });
        });
}));


passport.use('login', new Strategy({}, (username, password, done) => {
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

app.use(session({
    secret: 'holamundo',
    cookie: {
         maxAge: 60000
    },
    saveUninitialized: false,
    resave: true
 }));

app.use(passport.initialize());
app.use(passport.session());


const authMW = (req, res, next) => {
    req.isAuthenticated() ? next() : res.send({ error: 'error'})
}

app.post('/login', passport.authenticate('login', {failureRedirect: '/error'}), (req, res ) => {
    res.send({error: false});
    //res.redirect('/home');
});

// signin
app.post('/signup', passport.authenticate('signup', {failureRedirect: '/error'}) , ( req, res ) => {
    res.send({error: false})
});


// datos
app.get('/datos', authMW, (req, res) => {
    
    res.send({hola: 'mundo', data: req.user})
})


DBConnect(() => {
    app.listen(process.env.PORT, () => console.log(`Server Conectado`));
});
