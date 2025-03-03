
import { NewAffiliateForm } from "@/components/admin/users/types";

export const validateNewAffiliate = (newAffiliate: NewAffiliateForm) => {
  const errors: {[key: string]: string} = {};
  
  if (!newAffiliate.coupon) errors.coupon = "Coupon code is required";
  else if (!/^[A-Z0-9]+$/.test(newAffiliate.coupon)) errors.coupon = "Coupon must be uppercase letters and numbers only";
  
  if (newAffiliate.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newAffiliate.email)) 
    errors.email = "Invalid email format";
  
  if (!newAffiliate.password) errors.password = "Password is required";
  else if (newAffiliate.password.length < 6) errors.password = "Password must be at least 6 characters";
  
  if (newAffiliate.password !== newAffiliate.confirmPassword) 
    errors.confirmPassword = "Passwords don't match";
  
  return { errors, isValid: Object.keys(errors).length === 0 };
};
