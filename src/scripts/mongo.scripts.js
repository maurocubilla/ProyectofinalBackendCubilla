import mongoose from "mongoose";
import {productsModel} from "../dao/models/products.model.js";
import {config} from "../config/config.js";

const updateProducts = async()=>{
    try {
        await mongoose.connect(config.mongo.url);
        console.log("base de datos conectada");
        const adminId= "653ef27e8c2f917aac003cad";
        const result = await productsModel.updateMany({},{$set:{owner:adminId}});
        console.log(result);
    } catch (error) {
        console.log(error);
    } finally{
        await mongoose.connection.close();
    }
};
updateProducts();