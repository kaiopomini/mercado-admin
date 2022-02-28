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

export interface IPhone {
    phone_number: string;
    is_primary?: boolean;
    is_whatsapp?: boolean;
}

export interface IAddress {
    id?: string;
    name: string;
    number?: string;
    zip_code: string;
    city: string;
    federative_unity: string;
    country?: string;
    user_id?: string;
}

export interface ICustomerList {
    id: string;
    avatar: string;
    name: string;
    surname: string;
    validated_email: boolean;
    email: string;
    cpf?: string;
    birth_date?: string;
    phones: [IPhone];
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
    address: IAddress;
}

export interface ICustomerPost {
    id?: string;
    avatar?: string;
    name: string;
    surname: string;
    email: string;
    cpf?: string;
    birthDate?: string;
    phones: [IPhone];
    address: IAddress;
    password?: string;
}

export async function getCustomersList(search?: string, page?: number, perPage?: number, sort?: string): Promise<IPaginatedResponse<ICustomerList> | null> {

    const params = {
        search,
        page,
        per_page: perPage,
        sort
    }

    try {
        const { data } = await api.get('admin/customers', { params });
        return data as IPaginatedResponse<ICustomerList>;
    } catch (error) {
        return null
    }

}

export async function getCustomer(id: string): Promise<IResponse<ICustomerList> | null> {

    try {
        const { data } = await api.get('admin/customers/' + id );
        return data as IResponse<ICustomerList>;
    } catch (error) {
        return null
    }

}

export async function createCustomer(data : ICustomerPost): Promise<IResponse<ICustomerList> | null> {

    const {address, email, name, phones, surname, avatar, birthDate, cpf, password} = data;
    const postData = {
       address,
       email,
       name,
       surname,
       phones,
       avatar,
       birth_date: birthDate,
       cpf,
       password
    }

    try {
        const { data } = await api.post('admin/customers', postData);
        return data as IResponse<ICustomerList>;
    } catch (error: any | AxiosError<IResponse<ICustomerList>>) {
        if (axios.isAxiosError(error)) {
            return error?.response?.data
        }

        return null
    }

}

export async function updateCotumer(id: string, barCode: string, name: string, price: number, description?: string, isActive?: boolean): Promise<IResponse<ICustomerList> | null> {

    const postData = {
        gtin_code: barCode,
        name: name,
        price: price,
        description: description,
        active: isActive
    }

    try {
        const { data } = await api.put('admin/customers/' + id, postData);
        return data as IResponse<ICustomerList>;
    } catch (error: any | AxiosError<IResponse<ICustomerList>>) {
        if (axios.isAxiosError(error)) {
            return error?.response?.data
        }

        return null
    }

}

export async function deleteCustomer(id: string): Promise<IResponse<ICustomerList> | null> {

   

    try {
        const { data } = await api.delete('admin/customers/' + id);
        return data as IResponse<ICustomerList>;
    } catch (error: any | AxiosError<IResponse<ICustomerList>>) {
        if (axios.isAxiosError(error)) {
            return error?.response?.data
        }

        return null
    }

}