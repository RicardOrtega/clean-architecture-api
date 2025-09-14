class GetProductByIdQuery {
    constructor(productRepository) {
        this.productRepository = productRepository;
    }

    async execute(id) {
        try {
            if (!id || id.trim().length === 0) {
                throw new Error('Product ID is required');
            }

            const product = await this.productRepository.findById(id);
            return product;
        } catch (error) {
            throw new Error(`Failed to get product: ${error.message}`);
        }
    }
}

module.exports = GetProductByIdQuery;