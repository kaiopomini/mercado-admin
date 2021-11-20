import { api } from "./api";

export interface IPaginatedResponse<T> {
    payload: Array<T>;
    success: boolean;
    message: string;
    total: number;
    page: number;
    per_page: number;
    last_page: number

}

export interface IProductList {
    id: string;
    name: string;
    description: string | null;
    price: number;
    gtin_code: string;
    image: string;
    active: boolean;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;

}

export async function getProductList(search?: string, page?: number, perPage?: number, sort?: string ) : Promise<IPaginatedResponse<IProductList> | null> {

    const params = {
        search,
        page,
        per_page: perPage,
        sort
    }

    try {
        const { data } = await api.get('admin/products', { params }) ;
        return data as IPaginatedResponse<IProductList>;
    } catch (error) {
        return null
    }

}