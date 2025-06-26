import { JwtPayload } from './jwt.payload';
import { JwtService } from '@nestjs/jwt';

function generateTokens(jwtService: JwtService, payload: JwtPayload) {
  const accessToken = jwtService.sign(payload, {
    secret: process.env.JWT_SECRET,
  });

  // Add a unique identifier to refresh token payload to prevent reuse
  const refreshPayload = {
    ...payload,
    countEx: 5,
  };

  const refreshToken = jwtService.sign(refreshPayload, {
    secret: process.env.JWT_REFRESH_SECRET,
    // here you can set a number of days which the refreshToken stay valid in it ,
  });

  return {
    accessToken,
    refreshToken,
  };
}

export default generateTokens;
