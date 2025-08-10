import type { TICons } from '@ya.praktikum/react-developer-burger-ui-components/dist/ui/icons';
import type React from 'react';

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
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  value: string;
  iconName?: keyof TICons | undefined;
};

export type TFormLink = {
  text: string;
  label: string;
  href: string;
};
