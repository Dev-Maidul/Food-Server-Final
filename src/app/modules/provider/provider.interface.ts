export interface IProviderProfile {
  userId: string;
  shopName: string;
  description?: string;
  address: string;
  phone: string;
  isOpen?: boolean;
}

export interface IProviderProfileUpdate {
  shopName?: string;
  description?: string;
  address?: string;
  phone?: string;
  isOpen?: boolean;
}
