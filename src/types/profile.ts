export interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  emailVerified: boolean | null;
  image: string | null;
  phoneNumber: string | null;
  gstin: string | null;
  businessName: string | null;
  businessAddress: string | null;
  businessType: string | null;
  businessCategory: string | null;
  pincode: string | null;
  state: string | null;
  businessDescription: string | null;
}

