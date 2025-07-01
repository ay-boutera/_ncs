export interface JwtPayload {
  id: number;
  email: string;
  role: string; // Make sure this matches what you're storing in the token
  // You could also add roles as an array if needed:
  // roles?: string[];
}
