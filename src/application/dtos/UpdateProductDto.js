class UpdateProductDto {
    constructor(name, description, price, category) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.category = category;
    }

    validate() {
        const errors = [];

        if (this.name !== undefined && this.name.trim().length === 0) {
            errors.push('Name cannot be empty');
        }

        if (this.name && this.name.length > 100) {
            errors.push('Name must be less than 100 characters');
        }

        if (this.price !== undefined && this.price <= 0) {
            errors.push('Price must be greater than 0');
        }

        if (this.description && this.description.length > 500) {
            errors.push('Description must be less than 500 characters');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }
}

module.exports = UpdateProductDto;