
export interface CouponData {
  date: string;
  [key: string]: string | number;
}

export interface CouponUsage {
  code: string;
  data: { 
    date: string; 
    quantity: number; 
    earnings: number 
  }[];
}
