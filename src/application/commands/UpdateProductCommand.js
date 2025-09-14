class UpdateProductCommand {
    constructor(productRepository) {
        this.productRepository = productRepository;
    }

    async execute(id, updateProductDto) {
        try {
            const validation = updateProductDto.validate();
            if (!validation.isValid) {
                throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
            }

            const existingProduct = await this.productRepository.findById(id);
            if (!existingProduct) {
                throw new Error('Product not found');
            }

            if (updateProductDto.name !== undefined) {
                existingProduct.name = updateProductDto.name.trim();
            }
            if (updateProductDto.description !== undefined) {
                existingProduct.description = updateProductDto.description;
            }
            if (updateProductDto.price !== undefined) {
                existingProduct.price = updateProductDto.price;
            }
            if (updateProductDto.category !== undefined) {
                existingProduct.category = updateProductDto.category;
            }

            existingProduct.updateTimestamp();

            if (!existingProduct.isValid()) {
                throw new Error('Updated product data is not valid');
            }

            const updatedProduct = await this.productRepository.update(id, existingProduct);
            
            return updatedProduct;
        } catch (error) {
            throw new Error(`Failed to update product: ${error.message}`);
        }
    }
}

module.exports = UpdateProductCommand;