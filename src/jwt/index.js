import express from 'express';
import JWT from 'jsonwebtoken';

const app = express();
// midleware para utilizar json
app.use(express.json());
// midleware para utilizar formularios
app.use(express.urlencoded({extended: true}));

const usuarios = [];
const PKEY = 'soyunpastelito'

app.get('/login', (req, res) => {

});

app.post('/register', (req, res) => {
    const { username, password, email } = req.body;
    const user = usuarios.find((u) =>  u.username == username);
    if (user) return res.send({error: true, msg: 'El usuario ya esta registrado'});

    usuarios.push({username, password, email});

    const token = JWT.sign({data: {username, email}}, PKEY, {expiresIn:'48h'});
    res.send({error: false,token: token})
});

const JWTMW = (req, res, next) => {
    const auth = req.headers.authorization;
    if(!auth) return res.status(401).send({error: true});

    const token = auth.split(' ')[1];
    console.log(token)

    JWT.verify(token, PKEY, (err, decoded) => {
        if(err) return res.status(401).send({error: true, msg: 'token invalido'});

        req.user = decoded.data;
        next();
    })
} 

app.get('/datos', JWTMW, (req, res) => {
    try {
        res.send({data: req.user});
    } catch (error) {
     console.log('algo paso')   
    }
    
})

app.listen(8080, () => console.log('conectado'));