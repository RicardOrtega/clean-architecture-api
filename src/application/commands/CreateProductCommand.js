const { v4: uuidv4 } = require('uuid');
const { Product } = require('../../domain/models');

class CreateProductCommand {
    constructor(productRepository) {
        this.productRepository = productRepository;
    }

    async execute(createProductDto) {
        try {
            const validation = createProductDto.validate();
            if (!validation.isValid) {
                throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
            }

            const product = new Product(
                uuidv4(),
                createProductDto.name.trim(),
                createProductDto.description,
                createProductDto.price,
                createProductDto.category
            );

            if (!product.isValid()) {
                throw new Error('Product data is not valid');
            }

            const savedProduct = await this.productRepository.create(product);
            
            return savedProduct;
        } catch (error) {
            throw new Error(`Failed to create product: ${error.message}`);
        }
    }
}

module.exports = CreateProductCommand;