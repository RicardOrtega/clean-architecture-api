class GetAllProductsQuery {
    constructor(productRepository) {
        this.productRepository = productRepository;
    }

    async execute() {
        try {
            const products = await this.productRepository.findAll();
            return products;
        } catch (error) {
            throw new Error(`Failed to get products: ${error.message}`);
        }
    }
}

module.exports = GetAllProductsQuery;