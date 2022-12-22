import * as dotenv from 'dotenv';
dotenv.config();

const configConnection = {
    mongoDB: {
        uri: process.env.MONGO,
        options: {
            serverSelectionTimeoutMS: 5000,
        }
    }
}

export default configConnection;