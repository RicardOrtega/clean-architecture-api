class IProductRepository {
    async findAll() {
        throw new Error('Method findAll() must be implemented');
    }

    async findById(id) {
        throw new Error('Method findById() must be implemented');
    }

    async create(product) {
        throw new Error('Method create() must be implemented');
    }

    async update(id, product) {
        throw new Error('Method update() must be implemented');
    }

    async delete(id) {
        throw new Error('Method delete() must be implemented');
    }

    async findByCategory(category) {
        throw new Error('Method findByCategory() must be implemented');
    }
}

module.exports = IProductRepository;