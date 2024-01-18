const fs = require("fs/promises")

class ProductManager{
    constructor(path){
        this.pathDB = path;
    }

    async createProduct(product){
        try{
        const {titulo,descripcion,precio,thumbnail,stock,codigo} = product;
        const allProducts = await this.getProducts();
        const lastId = allProducts.length === 0? 1: allProducts.products[allProducts.products.length - 1].id + 1;        
        const newProduct = {id:lastId, ...product};        
        allProducts.products.push(newProduct);
        await fs.writeFile(this.pathDB,JSON.stringify(allProducts))
        return newProduct
        }catch(error){
            console.log(error)
        }     
    }

    async getProducts(){
        try{
            const allProducts = await fs.readFile(this.pathDB);    
            return JSON.parse(allProducts);
        }catch(error){
            console.log(error);
        }
    }

    async getProductById(id){
        try{
            const allProducts = await this.getProducts();    
            // for(let i = 0;i<allProducts.products.length;i++) if(i+1 === id)return allProducts.products[i]
            const productoBuscado = await allProducts.products.find(p => p.id === id);
            if(productoBuscado!==undefined) return productoBuscado;
            else throw new Error("No existe el producto")                    
        }catch(error){
            console.log(error);
        }
    }

    async updateProduct(id,campo,nuevoValor){
        try{
            const productoBuscado = await this.getProductById(id);
                                   
            switch(campo.toLowerCase()){
                case "titulo" : productoBuscado.titulo = nuevoValor;
                break;
                case "descripcion": productoBuscado.descripcion = nuevoValor;
                break;
                case "precio": productoBuscado.precio = nuevoValor;
                break;
                case "thumbnail": productoBuscado.thumbnail = nuevoValor;                    
                case "stock": productoBuscado.stock = nuevoValor;   
                break;
                case "codigo" : productoBuscado.codigo = nuevoValor                
                break;
                default: throw new Error("El campo buscado no eexiste")                                   
            }
            const arrayNuevo = {"products" : [] }
            const copiaDeLosProductos = await this.getProducts();
            for(let i = 0; i < copiaDeLosProductos.products.length;i++) arrayNuevo.products.push((i+1 !== id)?copiaDeLosProductos.products[i]:productoBuscado)
            await fs.writeFile(this.pathDB,JSON.stringify(arrayNuevo))
        }catch(error){
            console.log(error);
        }
    }

    async deleteProduct(id){
        try{
        const todosLosProductos = await this.getProducts();
        for(let i = 0;i<todosLosProductos.products.length;i++){
            if(todosLosProductos.products[i].id === id){
                todosLosProductos.products.splice(i,1)
            }
        }
        await fs.writeFile(this.pathDB,JSON.stringify(todosLosProductos))
        }catch(error){
            console.log(error)
        }
    }

}   

module.exports = ProductManager;