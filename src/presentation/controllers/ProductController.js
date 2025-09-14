const { 
    CreateProductDto, 
    UpdateProductDto, 
    ProductResponseDto 
} = require('../../application/dtos');

const {
    CreateProductCommand,
    UpdateProductCommand,
    DeleteProductCommand
} = require('../../application/commands');

const {
    GetAllProductsQuery,
    GetProductByIdQuery,
    GetProductsByCategoryQuery
} = require('../../application/queries');

class ProductController {
    constructor(productRepository) {
        this.productRepository = productRepository;
        
        this.createCommand = new CreateProductCommand(productRepository);
        this.updateCommand = new UpdateProductCommand(productRepository);
        this.deleteCommand = new DeleteProductCommand(productRepository);
        
        this.getAllQuery = new GetAllProductsQuery(productRepository);
        this.getByIdQuery = new GetProductByIdQuery(productRepository);
        this.getByCategoryQuery = new GetProductsByCategoryQuery(productRepository);
    }

    async getAllProducts(req, res) {
        try {
            const { category } = req.query;
            
            let products;
            if (category) {
                products = await this.getByCategoryQuery.execute(category);
            } else {
                products = await this.getAllQuery.execute();
            }

            const responseDto = ProductResponseDto.fromProducts(products);
            
            res.status(200).json({
                success: true,
                data: responseDto,
                message: `Found ${products.length} products`
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
                data: null
            });
        }
    }

    async getProductById(req, res) {
        try {
            const { id } = req.params;
            
            const product = await this.getByIdQuery.execute(id);
            
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found',
                    data: null
                });
            }

            const responseDto = ProductResponseDto.fromProduct(product);
            
            res.status(200).json({
                success: true,
                data: responseDto,
                message: 'Product found'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
                data: null
            });
        }
    }

    async createProduct(req, res) {
        try {
            const { name, description, price, category } = req.body;
            
            const createDto = new CreateProductDto(name, description, price, category);
            
            const createdProduct = await this.createCommand.execute(createDto);
            const responseDto = ProductResponseDto.fromProduct(createdProduct);
            
            res.status(201).json({
                success: true,
                data: responseDto,
                message: 'Product created successfully'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
                data: null
            });
        }
    }

    async updateProduct(req, res) {
        try {
            const { id } = req.params;
            const { name, description, price, category } = req.body;
            
            const updateDto = new UpdateProductDto(name, description, price, category);
            
            const updatedProduct = await this.updateCommand.execute(id, updateDto);
            const responseDto = ProductResponseDto.fromProduct(updatedProduct);
            
            res.status(200).json({
                success: true,
                data: responseDto,
                message: 'Product updated successfully'
            });
        } catch (error) {
            if (error.message.includes('not found')) {
                res.status(404).json({
                    success: false,
                    message: error.message,
                    data: null
                });
            } else {
                res.status(400).json({
                    success: false,
                    message: error.message,
                    data: null
                });
            }
        }
    }

    async deleteProduct(req, res) {
        try {
            const { id } = req.params;
            
            const deleted = await this.deleteCommand.execute(id);
            
            res.status(200).json({
                success: true,
                data: { deleted: true, id },
                message: 'Product deleted successfully'
            });
        } catch (error) {
            if (error.message.includes('not found')) {
                res.status(404).json({
                    success: false,
                    message: error.message,
                    data: null
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: error.message,
                    data: null
                });
            }
        }
    }

    async getProductStats(req, res) {
        try {
            const stats = await this.productRepository.getStatistics();
            
            res.status(200).json({
                success: true,
                data: stats,
                message: 'Statistics retrieved successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
                data: null
            });
        }
    }
}

module.exports = ProductController;