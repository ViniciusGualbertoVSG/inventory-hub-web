export type Product = {
    id: string;
    name: string;
    description: string | null;
    productId: string;
    quantity: number;
    price: number;
    companyId: string;
    categoryId: string;
};

export type CreateProductDTO = {
    name: string,
    description: string | null,
    productId: string,
    quantity: number,
    price: number,
    categoryId: string
}

export type UpdateProductDTO = Partial<CreateProductDTO>

export type Category = {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    companyId: string;
};

export type CreateCategoryDIO = {
    name: string
}