import * as userConfig from '../config/user.js';
import bcrypt from 'bcrypt';
import MongoDBContainer from '../containers/mongo.containers.js';
// configuraciones propias
const userContainer = new MongoDBContainer(
    userConfig.userCollection,
    userConfig.usuarioSchema
);

export const login = async (email, password, done) => {
    try {
        // se busca si el usuario existe
        const usuario = await userContainer.getByField('email', email);
        if(user) {
            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) return done(null, false);
            return done(null, user);
        } else {
            return done(null, false);
        }
    } catch (error) {
        return done(error);
    }
}

export const signup = async (req, email, password, done) => {
    const { name } = req.body;
    try {
        // se busca si el usuario existe
        const usuario = await userContainer.getByField('email', email);
        if(user) {
            // se encontro al usuario
            return done(null, false);
        } else {
            const hashedPassord =  await bcrypt.hash(password, 10);
            // se arma el cuerpo del doc que se grabara
            const userData = {
                email,
                password: hashedPassord,
                name,
                avatar: req.file.filename,
            };
            const newUser = await userContainer.save(userData);

            return done (null, newUser);
        }
    } catch (error) {
        
    }
}