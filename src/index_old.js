import express  from "express";
import session from "express-session";
//import router from "./routes/index.js";
// memoria / DB
const usuarios = []

const app  = express();
app.use(session({
    secret: 'holasoyunsecrtosss',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60000
    }
}));

// midleware para utilizar json
app.use(express.json());
// midleware para utilizar formularios
app.use(express.urlencoded({extended: true}));

const authMW = (req, res, next ) => {
    req.session.username ? next() : res.send({error: true, msg: 'sin session'});
}

//app.use(router);

// registro de usuarios
app.get('/register', (req, res) => {
    
})

app.post('/register', (req, res) => {
    const {nombre, password, email} = req.body;
    const user = usuarios.find( u => u.nombre = nombre);
    if(user) return res.send({error: true, msg: 'el usuario ya existe'});

    usuarios.push({nombre, password, email});
    //res.redirect('/login');
    res.send({ error: false, msg:'creado'})
});

// Login de usuarios
app.get('/login', (req, res) => {

});

app.post('/login', (req, res) => {
    const { nombre, password} = req.body;
    const user = usuarios.find( (user) => user.nombre == nombre && user.password == password );
    if(!user) return res.send({error: true, msng: 'el usuario no existe'});
    req.session.username = nombre;
    // res.redirect('/datos');
    res.send({error: false, user: req.session.username})
});

// Logout
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        res.send({error: false, msg: 'Sesión finalizada'});
    })
});


// datos
app.get('/datos',authMW, (req, res) => {

    const user = usuarios.find( u => u.nombre == req.session.username);
    res.send({error: false, data: user});
})

app.listen(8080, () => console.log('conectado'));