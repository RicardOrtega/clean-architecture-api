class GetProductsByCategoryQuery {
    constructor(productRepository) {
        this.productRepository = productRepository;
    }

    async execute(category) {
        try {
            if (!category || category.trim().length === 0) {
                throw new Error('Category is required');
            }

            const products = await this.productRepository.findByCategory(category.trim());
            return products;
        } catch (error) {
            throw new Error(`Failed to get products by category: ${error.message}`);
        }
    }
}

module.exports = GetProductsByCategoryQuery;