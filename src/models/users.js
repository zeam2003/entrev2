import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';


const usuarioSchema = new Schema({
    username: {
        type: String,
        required: [ true, `Es nombre de usuario es obligatorio`]
    },
    password: {
        type: String,
        required: [ true, `La contraseña es obligatoria`]
    },
    email: {
        type: String,
        required: [ true, `El email es obligatorio`]
    }
});

usuarioSchema.method('compararPassword', function(password = '')  {
    if (bcrypt.compareSync( password, this.password)) {
        return true;
    } else {
        return false
    }
});



export const Usuario = model('Usuario', usuarioSchema);