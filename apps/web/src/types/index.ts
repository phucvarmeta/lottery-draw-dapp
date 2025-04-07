import { FC, PropsWithChildren, type SVGProps } from 'react';

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {}
}

export type ApiError = {
  code: number;
  message: any;
};

export interface IMeta {
  code: number;
  message: string;

  itemCount: number;
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export type TResponse<T> = {
  meta: IMeta;
  items: T;
};

export type TListResponse<T> = {
  meta: IPagination;
  items: T[];
};

export type FCC<P = {}> = FC<PropsWithChildren<P>>;

export interface IOption<T> {
  label: string;
  value: T;
}

export interface IPagination {
  itemCount: number;
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export interface ICountdownTimer {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export interface IPaging {
  page: number;
  limit: number;
  total?: number;
}
