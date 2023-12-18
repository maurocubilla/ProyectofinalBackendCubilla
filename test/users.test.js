import mongoose from "mongoose";
import usersModel from "../src/dao/users.model.js";
import Assert from "assert";
import usersModel from "../src/dao/models/users.model.js";

const assert = Assert.strict;

const testDB = "url mongo db test";

await mongoose.connect(testDB);
console.log("base de datos de prueba conectada");

describe("Pruebas para manager de usuarios (users DAO)", async()=>{

    before(function(){
        this.usersManager = new Users();
    });

    beforeEach(async function(){
        await usersModel.deleteMany({});
    });
    // after(function(){
    //     console.log("after");
    // });

    // afterEach(function(){
    //     console.log("afterEach");
    // });

    it("El metodo get debe retornar un arreglo de usuarios",async function(){
        const response = await this.usersManager.get();
        assert.strictEqual(Array.isArray(response),true);
    });

    it("El metodo save debe guardar un usuario en la base de datos",async function(){
        const mockUser = {
            first_name:"pedro",
            last_name:"mandela",
            email:"pedro@gmail.com",
            password:"coder"
        };
        const response = await this.usersManager.save(mockUser);
        assert.ok(response._id);
    });

    it("Al agregar un nuevo usuario, éste debe crearse con un arreglo de producto vacío por defecto.", async function(){
        const mockUser = {
            first_name:"pedro",
            last_name:"mandela",
            email:"pedro@gmail.com",
            password:"coder"
        };
        const response = await this.usersManager.save(mockUser);
        console.log(response);
        assert.deepStrictEqual(response.products,[]);
    });

    it("El Dao puede obtener  a un usuario por email", async function(){
        const mockUser = {
            first_name:"pedro",
            last_name:"mandela",
            email:"pedro@gmail.com",
            password:"coder"
        };
        const response = await this.usersManager.save(mockUser);
        const userEmail = response.email;
        const responseUser = await this.usersManager.getBy({email:userEmail});
        assert.strictEqual(responseUser.first_name,"pedro");
    });
});