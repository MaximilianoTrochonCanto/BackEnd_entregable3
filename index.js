const path = require("path");
const express = require("express");
const PORT = 7500;
const app = express();
const ProductManager = require('./productManager');
const pathBase = path.join(__dirname,"dbProducts.json");
const manager = new ProductManager(pathBase);

app.get("/",(request,response) =>{            
    response.send("<h1>Hola, bienvenidos!</h1>")
})

app.use(express.urlencoded({extends:true}));

const getProducts = async() =>{              
    try{
        let productos = await manager.getProducts()
        let resultado;        
        app.get("/products/",(request,response) =>{                       
            (request.query.limit > 0)?resultado = productos.products.slice(0,request.query.limit):resultado = productos.products            
            return response.status(200).json({message:"Mostrando mis productos",resultado})
        })
                       
    }catch(error){
        console.log(error)
    }
        
}

getProducts()

app.listen(PORT,()=>{
    console.log("SERVER UP AND ROUTING");
})

