import type { StringLiteral } from "typescript";
import type { ProductDoc } from "./product.model.js";
import { getDb } from "../../database/mongo.js";



export type ProductListQuery = {
    q?: string;
    category?: string;
    tags?: string[];
    minPrice?: number;
    maxPrice?: number;
    sort?: "newest" | "price_asc" | "price_desc";
    page: number;
    limit: number;
}

export class ProductDatabase {
    private col() {
        return getDb().collection<ProductDoc>("products");
    }

    async create() {}
    async updateById() {}
    async findById() {}
    async deleteById() {}
    async list() {}
}