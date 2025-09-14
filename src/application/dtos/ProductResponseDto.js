class ProductResponseDto {
    constructor(product) {
        this.id = product.id;
        this.name = product.name;
        this.description = product.description;
        this.price = product.price;
        this.category = product.category;
        this.createdAt = product.createdAt;
        this.updatedAt = product.updatedAt;
    }

    static fromProduct(product) {
        return new ProductResponseDto(product);
    }

    static fromProducts(products) {
        return products.map(product => new ProductResponseDto(product));
    }
}

module.exports = ProductResponseDto;