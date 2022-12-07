import mongoose from "mongoose";

export function DBConnect(cb) {
    mongoose.connect('mongodb+srv://zeam2003:LyAPqsqgF98XbmL7@coderhousedb.8pcmeas.mongodb.net/coder', 
    {useNewUrlParser: true},
     (err) => {
        console.log('conectado')
        if(err) {
            console.log(err)
        }
        cb(err);
    
    });
}


export const Users = mongoose.model('users', {
    username: String,
    password: String,
    email: String
});