// eslint-disable-next-line @typescript-eslint/no-unused-vars
import axios, { AxiosError } from "axios";
import { api } from "./api.service";

export interface IPaginatedResponse<T> {
  payload: Array<T>;
  success: boolean;
  message: string;
  total: number;
  page: number;
  per_page: number;
  last_page: number;
}

export interface IResponse<T> {
  payload?: T | null;
  success: boolean;
  message: string;
  errors?: Array<any>;
}

export interface ICategoryList {
  id: string;
  image: string;
  name: string;
  description: string;
  active: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
}

export interface IInputLablesCategoryList {
  id: string;
  name: string;
}

export interface ICategoryPost {
  id?: string;
  image?: string;
  name: string;
  description?: string;
  active?: boolean;
}

export async function getCategoryList(
  search?: string,
  page?: number,
  perPage?: number,
  sort?: string
): Promise<IPaginatedResponse<ICategoryList> | null> {
  const params = {
    search,
    page,
    per_page: perPage,
    sort,
  };

  try {
    const { data } = await api.get("admin/categories", { params });
    return data as IPaginatedResponse<ICategoryList>;
  } catch (error) {
    return null;
  }
}

export async function getCategory(
  id: string
): Promise<IResponse<ICategoryList> | null> {
  try {
    const { data } = await api.get("admin/categories/" + id);
    return data as IResponse<ICategoryList>;
  } catch (error) {
    return null;
  }
}

export async function createCategory(
  data: ICategoryPost
): Promise<IResponse<ICategoryList> | null> {
  const { image, name, description, active } = data;
  const postData = {
    image,
    description,
    name,
    active,
  };

  try {
    const { data } = await api.post("admin/categories", postData);
    return data as IResponse<ICategoryList>;
  } catch (error: any | AxiosError<IResponse<ICategoryList>>) {
    if (axios.isAxiosError(error)) {
      return error?.response?.data;
    }

    return null;
  }
}

export async function updateCategory(
  data: ICategoryPost
): Promise<IResponse<ICategoryList> | null> {
  const { image, name, active, description, id } = data;
  const postData = {
    image,
    name,
    active,
    description,
  };

  if (!id) {
    return null;
  }

  try {
    const { data } = await api.put("admin/categories/" + id, postData);
    return data as IResponse<ICategoryList>;
  } catch (error: any | AxiosError<IResponse<ICategoryList>>) {
    if (axios.isAxiosError(error)) {
      return error?.response?.data;
    }
    return null;
  }
}

export async function deleteCategory(
  id: string
): Promise<IResponse<ICategoryList> | null> {
  try {
    const { data } = await api.delete("admin/categories/" + id);
    return data as IResponse<ICategoryList>;
  } catch (error: any | AxiosError<IResponse<ICategoryList>>) {
    if (axios.isAxiosError(error)) {
      return error?.response?.data;
    }

    return null;
  }
}

export async function addProductsToCategory(
  categoryId: string,
  productsIds: string[]
): Promise<IResponse<ICategoryList> | null> {
  const postData = {
    category_id: categoryId,
    products_ids: productsIds,
  };
  try {
    const { data } = await api.put("admin/categories/add-products", postData);
    return data as IResponse<ICategoryList>;
  } catch (error: any | AxiosError<IResponse<ICategoryList>>) {
    if (axios.isAxiosError(error)) {
      return error?.response?.data;
    }

    return null;
  }
}

export async function removeProductsFromCategory(
  categoryId: string,
  productsIds: string[]
): Promise<IResponse<ICategoryList> | null> {
  const postData = {
    category_id: categoryId,
    products_ids: productsIds,
  };
  try {
    const { data } = await api.put(
      "admin/categories/remove-products",
      postData
    );
    return data as IResponse<ICategoryList>;
  } catch (error: any | AxiosError<IResponse<ICategoryList>>) {
    if (axios.isAxiosError(error)) {
      return error?.response?.data;
    }

    return null;
  }
}

export async function getInputLabelsCategoryList(): Promise<IResponse<
  IInputLablesCategoryList[]
> | null> {
  try {
    const { data } = await api.get("admin/categories/input-labels");
    return data as IResponse<IInputLablesCategoryList[]>;
  } catch (error) {
    return null;
  }
}
