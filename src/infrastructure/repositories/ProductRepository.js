const { IProductRepository } = require('../../domain/interfaces');

class ProductRepository extends IProductRepository {
    constructor(databaseContext) {
        super();
        this.databaseContext = databaseContext;
    }

    async findAll() {
        try {
            const products = this.databaseContext.getProductsCollection();
            return Array.from(products.values());
        } catch (error) {
            throw new Error(`Failed to find all products: ${error.message}`);
        }
    }

    async findById(id) {
        try {
            const products = this.databaseContext.getProductsCollection();
            const product = products.get(id);
            return product || null;
        } catch (error) {
            throw new Error(`Failed to find product by id: ${error.message}`);
        }
    }

    async create(product) {
        try {
            const products = this.databaseContext.getProductsCollection();
            
            if (products.has(product.id)) {
                throw new Error('Product with this ID already exists');
            }

            products.set(product.id, product.clone());
            
            return products.get(product.id);
        } catch (error) {
            throw new Error(`Failed to create product: ${error.message}`);
        }
    }

    async update(id, product) {
        try {
            const products = this.databaseContext.getProductsCollection();
            
            if (!products.has(id)) {
                return null;
            }

            product.id = id;
            products.set(id, product.clone());
            
            return products.get(id);
        } catch (error) {
            throw new Error(`Failed to update product: ${error.message}`);
        }
    }

    async delete(id) {
        try {
            const products = this.databaseContext.getProductsCollection();
            
            if (!products.has(id)) {
                return false;
            }

            const deleted = products.delete(id);
            return deleted;
        } catch (error) {
            throw new Error(`Failed to delete product: ${error.message}`);
        }
    }

    async findByCategory(category) {
        try {
            const products = this.databaseContext.getProductsCollection();
            const filteredProducts = [];

            for (const product of products.values()) {
                if (product.category && 
                    product.category.toLowerCase().includes(category.toLowerCase())) {
                    filteredProducts.push(product);
                }
            }

            return filteredProducts;
        } catch (error) {
            throw new Error(`Failed to find products by category: ${error.message}`);
        }
    }

    async getStatistics() {
        try {
            const products = this.databaseContext.getProductsCollection();
            const allProducts = Array.from(products.values());

            const stats = {
                totalProducts: allProducts.length,
                totalValue: allProducts.reduce((sum, product) => sum + product.price, 0),
                categories: {}
            };

            allProducts.forEach(product => {
                if (product.category) {
                    stats.categories[product.category] = 
                        (stats.categories[product.category] || 0) + 1;
                }
            });

            return stats;
        } catch (error) {
            throw new Error(`Failed to get statistics: ${error.message}`);
        }
    }
}

module.exports = ProductRepository;