class Product {
    constructor(id, name, description, price, category, createdAt = new Date(), updatedAt = new Date()) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.category = category;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    isValid() {
        return this.name && 
               this.name.trim().length > 0 && 
               this.price && 
               this.price > 0;
    }

    updateTimestamp() {
        this.updatedAt = new Date();
    }

    clone() {
        return new Product(
            this.id,
            this.name,
            this.description,
            this.price,
            this.category,
            this.createdAt,
            this.updatedAt
        );
    }
}

module.exports = Product;