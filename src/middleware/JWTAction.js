import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config();

const createJWT = (payload, JWT_SECRET, JWT_EXPIRES_IN) => {
    let key = JWT_SECRET;
    let token = null;
    try {
        token = jwt.sign(payload, key, {
            expiresIn: JWT_EXPIRES_IN,
        })
    } catch (error) {
        console.log(error)
    }
    return token;
}

const verifyToken = (token) => {
    let key = JWT_SECRET;
    let decoded = null;
    try {
        decoded = jwt.verify(token, key);
      } catch (error) {
        console.log(error);
      }
      return decoded;
}

// const 

module.exports = {
    createJWT, verifyToken
}