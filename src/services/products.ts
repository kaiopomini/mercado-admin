// eslint-disable-next-line @typescript-eslint/no-unused-vars
import axios, { AxiosError } from "axios";
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

export interface IProductPost {
    id?: string;
    barCode: string;
    active: boolean;
    name: string;
    description?: string | null;
    price: number;
    basePrice: number;
    controlledInventory: boolean,
    quantity: number;
    image: string;
}
export interface IResponse<T> {
    payload?: T | null;
    success: boolean;
    message: string;
    errors?:Array<any>
}

export interface IProductList {
    id: string;
    image: string;
    active: boolean;
    name: string;
    description: string | null ;
    price: number;
    base_price: number;
    controlled_inventory: boolean,
    quantity: number;
    gtin_code: string;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null ;
}

export async function getProductList(search?: string, page?: number, perPage?: number, sort?: string): Promise<IPaginatedResponse<IProductList> | null> {

    const params = {
        search,
        page,
        per_page: perPage,
        sort,
    }

    try {
        const { data } = await api.get('admin/products', { params });
        return data as IPaginatedResponse<IProductList>;
    } catch (error) {
        return null
    }

}

export async function getProduct(id: string): Promise<IResponse<IProductList> | null> {

    try {
        const { data } = await api.get('admin/products/' + id );
        return data as IResponse<IProductList>;
    } catch (error) {
        return null
    }

}

export async function createProduct( {barCode, name, price, description, active, basePrice, controlledInventory, quantity = 0, image = 'default'} : IProductPost ): Promise<IResponse<IProductList> | null> {

    const postData = {
        gtin_code: barCode,
        name: name,
        price: price,
        base_price: basePrice,
        description: description,
        active: active,
        controlled_inventory: controlledInventory,
        quantity: quantity,
        image: image,
    }

    try {
        const { data } = await api.post('admin/products', postData);
        return data as IResponse<IProductList>;
    } catch (error: any | AxiosError<IResponse<IProductList>>) {
        if (axios.isAxiosError(error)) {
            return error?.response?.data
        }

        return null
    }

}

export async function updateProduct({id, barCode, name, price, description, active, basePrice, controlledInventory, quantity = 0, image = 'default'} : IProductPost): Promise<IResponse<IProductList> | null> {

    const postData = {
        gtin_code: barCode,
        name: name,
        price: price,
        base_price: basePrice,
        description: description,
        active: active,
        controlled_inventory: controlledInventory,
        quantity: quantity,
        image: image,
    }

    try {
        const { data } = await api.put('admin/products/' + id, postData);
        return data as IResponse<IProductList>;
    } catch (error: any | AxiosError<IResponse<IProductList>>) {
        if (axios.isAxiosError(error)) {
            return error?.response?.data
        }

        return null
    }

}

export async function deleteProduct(id: string): Promise<IResponse<IProductList> | null> {

   

    try {
        const { data } = await api.delete('admin/products/' + id);
        return data as IResponse<IProductList>;
    } catch (error: any | AxiosError<IResponse<IProductList>>) {
        if (axios.isAxiosError(error)) {
            return error?.response?.data
        }

        return null
    }

}