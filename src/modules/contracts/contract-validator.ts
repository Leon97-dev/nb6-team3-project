//다른 api 제작 전까지 인증 구현은 패스
// import jwt, { JwtPayload } from 'jsonwebtoken';
// import { ValidationError } from '../../errors/error-handler.js';
// import { RequestHandler } from 'express';
// import { expressjwt } from 'express-jwt';

// const JWT_SECRET = process.env.JWT_SECRET;
// if (!JWT_SECRET) {
//     throw new Error('JWT_SECRET is not defined in environment variables.');
// }

// const verifyAccessToken: RequestHandler = (req, res, next) => {
//     expressjwt({
//         secret: JWT_SECRET,
//         algorithms: ["HS256"],
//         requestProperty: 'user'
//     })(req, res, (err) => {
//         if (err) {
//             return res.status(401).json({ message: "로그인이 필요합니다" });
//         }
//         next();
//     });
// };

// const vertifyContractAuth: RequestHandler = (req, res, next) => {

// };

// export default {
//     verifyAccessToken,
// };