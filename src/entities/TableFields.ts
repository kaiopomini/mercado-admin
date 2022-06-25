import { ReactNode } from "react";

export type TypesIds = {
  products:
    | "actions"
    | "product"
    | "price"
    | "active"
    | "code"
    | "inventoryControl"
    | "quantity";
  customers:
    | "actions"
    | "customerField"
    | "emailField"
    | "cpfField"
    | "phoneField"
    | "updatedAtField";
  categories: "actions" | "category" | "active";
};

export interface Column<T> {
  id: T;
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: any) => string;
  action?: () => void;
  icon?: ReactNode;
}
