import express from 'express';
import session from 'express';
import passport from 'passport';
import { Strategy as TwitterStrategy } from 'passport-twitter';


const app = express();

const CONSUMER_KEY = 'dfasf651sf3s2f1fd5as6fas31dfs6f1asf3';
const CONSUMER_SKEY = '42342343424324243242423';
passport.use(new TwitterStrategy( {
    consumerKey: CONSUMER_KEY,
    consumerSecret: CONSUMER_SKEY ,
    callbackURL: '/auth/twitter/callback'
}, (accessToken, tokenRefresh, userProfile, done) => {
    return done(null, userProfile)
}));


passport.serializeUser((user, done) => {
    done(null, user)
});

passport.deserializeUser((user, done) => {
    done(null, user)
});

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

// vista de autenticación con Twitter
app.get('/auth/twitter', passport.authenticate('twitter'));


app.get('/auth/twitter/callback', passport.authenticate('twitter', {
    successRedirect: '/admin',
    failureRedirect: '/error'
}));

app.get('/', (req, res) => {

})

app.listen(8080, () => console.log('conectado'));