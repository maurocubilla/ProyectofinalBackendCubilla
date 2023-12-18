import app from "../src/app.js";
import supertest from "supertest";
import chai from "chai";
import { productsModel } from "../src/dao/models/products.model.js";

const expect = chai.expect;
const requester = supertest(app);//elemento para hacer peticiones al servidor

describe("Pruebas app ecomerce", function(){
    describe("Pruebas del modulo producto", function(){

        this.timeout(10000);

        beforeEach(async()=>{
            await productsModel.deleteMany({});
        });

        it("El endpoint POST /api/products debe crear un producto correctamente en la db", async()=>{
            const productMock = {
                name:"Faro Auxiliar",
                category:"Iluminacion",
                price:"120000"
            };
            const response = await requester.post("/api/products").send(productMock);
             //console.log(response);
            expect(response.body.status).to.be.equal("success"); 
            expect(response.body.payload).to.have.property("_id");
            expect(response.body.payload.name).to.be.equal(productMock.name);
        });

        it("Al crear un producto sólo con los datos elementales. Se debe corroborar que el producto creado cuente con una propiedad stock:false", async()=>{
            const productMock = {
                name:"faro auxiliar",
                category:"Iluminacion",
                price:"120000"
            };
            const response = await requester.post("/api/products").send(productMock);
            expect(response.body.payload).to.have.property("stock");
            expect(response.body.payload.stock).to.be.equal(false);
        });

        it("Si se desea crear un producto sin el campo nombre, el módulo debe responder con un status 400." , async ()=>{
            const productMock = {
                category:"Iluminacion",
                price:"12000"
            };
            const response = await requester.post("/api/products").send(productMock);
             //console.log(response);
            expect(response.statusCode).to.be.equal(400);
        });

        it("Al obtener los productos con el método GET, la respuesta debe tener los campos status y payload. Además, payload debe ser de tipo arreglo.", async()=>{
            const response = await requester.get("/api/products");
             //console.log(response);
            expect(response.body).to.have.property("status");
            expect(response.body).to.have.property("payload");
            // expect(response.body.payload).to.be.ok();
            expect(response.body.payload).to.be.deep.equal([]);
        });
    });
});