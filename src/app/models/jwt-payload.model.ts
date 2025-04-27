

export interface JwtPayload {
  sub: string;
  username: string;
  email: string;
  roles: string[];
  exp: number;
  iat: number;
}
