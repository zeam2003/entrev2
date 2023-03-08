import mongoose from 'mongoose';
import * as dotenv from 'dotenv';


// Opciones para la conexion a mongo
const options =  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

dotenv.config();

// conectamos a mongo
await mongoose.connect(process.env.MONGO, options);

// Exportamos la clase de nuestro contenedor y definimos  funciones
export default class MongoDBContainer {
    constructor(collection, schema) {
        this.model = mongoose.model(collection, schema);
    }

    // Busca un item por Id
    async getById(id) {
        try {
            const data = await this.model.findOne({_id: id});
            return data;
        } catch (error) {
            throw new Error(error)
        } 
    }

    // Busca todo lo que coincida con el criterio
    async getAll(){
        try {
            const data = await this.model.find({});
            return data;
        } catch (error) {
            throw new Error(error)
        }
    }

    // Graba un nuevo documento
    async save(newDoc){
        try {
           const doc = await this.model.create(newDoc);
           return doc;
        } catch (error) {
            throw new Error(error)
        }
    }

    // Actualiza un elemenot por su ID
    async updateById(id, itemData) {
        try {
          await this.model.updateOne({ _id: id }, { $set: { ...itemData } });
        } catch (error) {
          console.error(error);
        }
    }

    // Elimina un elemento por su ID
    async deleteById(id){
        try {
            const {n,nDeleted} = await this.model.deleteOne({_id: id});
            return nDeleted > 0;
        } catch (error) {
            throw new Error(error)
        }
    }

    // Busqueda por un criterio especificio y con condiciones
    async getByField(field, criteria) {
        try {
          const data = await this.model.findOne().where(field).equals(criteria);
         return data;
        } catch (error) {
          console.error(error);
        }
    }

    // Borra todo, intentar no utilizar
    async deleteAll() {
        try {
            await this.model.deleteMany({});
        } catch (error) {
            throw new Error(error)
        }
    }
}