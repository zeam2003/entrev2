import { Schema } from "mongoose";

export const userCollection = 'usuario';

// Esquema para el usuario
export const usuarioSchema = new Schema({
    name: {
        type: String,
        lowecase: true,
        required: [ true, `El nombre de usuario es obligatorio`]
    },
    password: {
        type: String,
        required: [true, `La contraseña es obligatoria`]
    },
    email: {
        type: String,
        required: [true, `El email es obligatorio`]
    }
});

