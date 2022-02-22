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

export interface IResponse<T> {
    payload?: T | null;
    success: boolean;
    message: string;
    errors?:Array<any>
}

export interface ICostumerList {
    id: string;
    avatar: string;
    name: string;
    surname: string;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
}

export async function getCostumersList(search?: string, page?: number, perPage?: number, sort?: string): Promise<IPaginatedResponse<ICostumerList> | null> {

    const params = {
        search,
        page,
        per_page: perPage,
        sort
    }

    try {
        const { data } = await api.get('admin/products', { params });
        return data as IPaginatedResponse<ICostumerList>;
    } catch (error) {
        return null
    }

}

export async function getCostumer(id: string): Promise<IResponse<ICostumerList> | null> {

    try {
        const { data } = await api.get('admin/products/' + id );
        return data as IResponse<ICostumerList>;
    } catch (error) {
        return null
    }

}

export async function createCostumer(barCode: string, name: string, price: number, description?: string, isActive?: boolean): Promise<IResponse<ICostumerList> | null> {

    const postData = {
        gtin_code: barCode,
        name: name,
        price: price,
        description: description,
        active: isActive
    }

    try {
        const { data } = await api.post('admin/products', postData);
        return data as IResponse<ICostumerList>;
    } catch (error: any | AxiosError<IResponse<ICostumerList>>) {
        if (axios.isAxiosError(error)) {
            return error?.response?.data
        }

        return null
    }

}

export async function updateCotumer(id: string, barCode: string, name: string, price: number, description?: string, isActive?: boolean): Promise<IResponse<ICostumerList> | null> {

    const postData = {
        gtin_code: barCode,
        name: name,
        price: price,
        description: description,
        active: isActive
    }

    try {
        const { data } = await api.put('admin/products/' + id, postData);
        return data as IResponse<ICostumerList>;
    } catch (error: any | AxiosError<IResponse<ICostumerList>>) {
        if (axios.isAxiosError(error)) {
            return error?.response?.data
        }

        return null
    }

}

export async function deleteCostumer(id: string): Promise<IResponse<ICostumerList> | null> {

   

    try {
        const { data } = await api.delete('admin/products/' + id);
        return data as IResponse<ICostumerList>;
    } catch (error: any | AxiosError<IResponse<ICostumerList>>) {
        if (axios.isAxiosError(error)) {
            return error?.response?.data
        }

        return null
    }

}