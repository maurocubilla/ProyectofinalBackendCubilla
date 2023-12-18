export default class ProductDTO {
    static getProductInputFrom = (product) =>{
        return {
            name:product.name||'',
            category:product.category||'',
            image: product.image||'',
            price:product.price||'40000',
            stock:false
        }
    }
}