class DeleteProductCommand {
    constructor(productRepository) {
        this.productRepository = productRepository;
    }

    async execute(id) {
        try {
            const existingProduct = await this.productRepository.findById(id);
            if (!existingProduct) {
                throw new Error('Product not found');
            }

            const deleted = await this.productRepository.delete(id);
            
            return deleted;
        } catch (error) {
            throw new Error(`Failed to delete product: ${error.message}`);
        }
    }
}

module.exports = DeleteProductCommand;