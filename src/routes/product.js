import { Router } from "express";
import passport from "passport";
import mongoose from "mongoose";
import {Strategy} from 'passport-local';
import bcrypt from 'bcrypt';
import connection from '../config/connection.js'
import { Usuario as Users } from "../models/users.js";

const productRoutes = Router();

(async () => {
    try {
        await mongoose.connect(connection.mongoDB.uri, connection.mongoDB.options,{strictQuery: true})
        
    } catch (error) {
        throw new Error(error);
    }
})();

productRoutes.get('/', (req, res ) => {
    const prueba = 'hola'
    res.render('content', {prueba})
})


export default productRoutes;