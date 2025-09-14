class IProductRepository {
    async findAll() {
        if (!this.databaseContext || typeof this.databaseContext.getProductsCollection !== 'function') {
            throw new Error('Method findAll() must be implemented');
        }

        try {
            const products = this.databaseContext.getProductsCollection();
            return Array.from(products.values());
        } catch (error) {
            throw new Error(`Failed to find all products: ${error.message}`);
        }
    }

    async findById(id) {
        if (!this.databaseContext || typeof this.databaseContext.getProductsCollection !== 'function') {
            throw new Error('Method findById() must be implemented');
        }

        try {
            const products = this.databaseContext.getProductsCollection();
            const product = products.get(id);
            return product || null;
        } catch (error) {
            throw new Error(`Failed to find product by id: ${error.message}`);
        }
    }

    async create(product) {
        if (!this.databaseContext || typeof this.databaseContext.getProductsCollection !== 'function') {
            throw new Error('Method create() must be implemented');
        }

        try {
            const products = this.databaseContext.getProductsCollection();

            if (products.has(product.id)) {
                throw new Error('Product with this ID already exists');
            }

            // Asumimos que el objeto product expone `clone()` como el modelo Product
            products.set(product.id, typeof product.clone === 'function' ? product.clone() : product);

            return products.get(product.id);
        } catch (error) {
            throw new Error(`Failed to create product: ${error.message}`);
        }
    }

    async update(id, product) {
        if (!this.databaseContext || typeof this.databaseContext.getProductsCollection !== 'function') {
            throw new Error('Method update() must be implemented');
        }

        try {
            const products = this.databaseContext.getProductsCollection();

            if (!products.has(id)) {
                return null;
            }

            product.id = id;
            products.set(id, typeof product.clone === 'function' ? product.clone() : product);

            return products.get(id);
        } catch (error) {
            throw new Error(`Failed to update product: ${error.message}`);
        }
    }

    async delete(id) {
        if (!this.databaseContext || typeof this.databaseContext.getProductsCollection !== 'function') {
            throw new Error('Method delete() must be implemented');
        }

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
        if (!this.databaseContext || typeof this.databaseContext.getProductsCollection !== 'function') {
            throw new Error('Method findByCategory() must be implemented');
        }

        try {
            const products = this.databaseContext.getProductsCollection();
            const filteredProducts = [];

            for (const product of products.values()) {
                if (product && product.category &&
                    String(product.category).toLowerCase().includes(String(category).toLowerCase())) {
                    filteredProducts.push(product);
                }
            }

            return filteredProducts;
        } catch (error) {
            throw new Error(`Failed to find products by category: ${error.message}`);
        }
    }

    async getStatistics() {
        if (!this.databaseContext || typeof this.databaseContext.getProductsCollection !== 'function') {
            throw new Error('Method getStatistics() must be implemented');
        }

        try {
            const products = this.databaseContext.getProductsCollection();
            const allProducts = Array.from(products.values());

            const stats = {
                totalProducts: allProducts.length,
                totalValue: allProducts.reduce((sum, product) => sum + (product.price || 0), 0),
                categories: {}
            };

            allProducts.forEach(product => {
                if (product && product.category) {
                    stats.categories[product.category] = (stats.categories[product.category] || 0) + 1;
                }
            });

            return stats;
        } catch (error) {
            throw new Error(`Failed to get statistics: ${error.message}`);
        }
    }
}

module.exports = IProductRepository;