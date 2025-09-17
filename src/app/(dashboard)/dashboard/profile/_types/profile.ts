export interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  emailVerified: boolean | null;
  image: string | null;
  phoneNumber: string | null;
 
}
