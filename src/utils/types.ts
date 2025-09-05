import type { TICons } from '@ya.praktikum/react-developer-burger-ui-components/dist/ui/icons';
import type { ChangeEvent } from 'react';

export type TOrderStatus = 'done' | 'pending' | 'created';

export type TOrder = {
  _id: string;
  status: TOrderStatus;
  name: string;
  number: number;
  createdAt: string;
  updatedAt: string;
  ingredients: string[];
};

export type TOrdersResponse = {
  success: boolean;
  orders: TOrder[];
  total: number;
  totalToday: number;
};

export type TIngredient = {
  _id: string;
  name: string;
  type: string;
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_large: string;
  image_mobile: string;
  __v: number;
};

export type TIngredientWithUUID = TIngredient & {
  uuid: string;
};

export type TUser = {
  email: string;
  name: string;
};

export type TModalData =
  | TIngredient
  | {
      idNumber: number;
    }
  | null;

export type TModalType = string | null;

export type TAuthResponse = {
  success: boolean;
  user: TUser;
  accessToken: string;
  refreshToken: string;
};

export type TFormInputField = {
  type: 'password' | 'text' | 'email' | undefined;
  placeholder?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  name: string;
  value: string;
  icon?: keyof TICons | undefined;
  onIconClick?: () => void;
};

export type TFormLink = {
  text: string;
  label: string;
  href: string;
};

export const statusMap: Record<string, string> = {
  done: 'Выполнен',
  pending: 'Готовится',
  created: 'Создан',
};
