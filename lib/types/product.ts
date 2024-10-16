export class Product {
    id: number;
    name: string;
    description: string;
    price: number;
    discount: number;
    images: string[];

    constructor(
        id: number = 0,
        name: string = '',
        description: string = '',
        price: number = 0,
        discount: number = 0,
        images: string[] = []
    ) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.discount = discount;
        this.images = images;
    }

    static defaultProduct(): Product {
        return new Product();
    }
}