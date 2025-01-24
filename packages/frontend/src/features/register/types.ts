export type Handler = (e?: Event | undefined) => Promise<void | undefined>;

export interface RestaurantFormValues {
  restaurant: string;
}

export interface UserFormValues {
  email: string;
  password: string;
  confirm: string;
}
