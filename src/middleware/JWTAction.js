import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const nonSecurePaths = [
  "/auth/logout",
  "/auth/login",
  "/auth/register",
  "/auth/refresh_token",
  "/get-all-category",
  "/get-all-banner",
  "/product/getAllProduct",
  "/product/getProductById"
];

const createJWT = (payload, JWT_SECRET, JWT_EXPIRES_IN) => {
  let key = JWT_SECRET;
  let token = null;
  try {
    token = jwt.sign(payload, key, {
      expiresIn: JWT_EXPIRES_IN,
    });
  } catch (error) {
    console.log(error);
  }
  return token;
};

const verifyToken = (token, JWT_SECRET) => {
  let key = JWT_SECRET;
  let decoded = null;
  try {
    decoded = jwt.verify(token, key);
  } catch (error) {
    console.log(error);
  }
  return decoded;
};

const extractToken = (req) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    return req.headers.authorization.split(" ")[1];
  }
  return null;
};

const checkUserJWT = (req, res, next) => {
  // 1 so trang muon cho no khong can thi config o day nhu trang home chang han
  if (nonSecurePaths.includes(req.path)) return next();
  let cookies = req.cookies;
  let tokenFromHeader = extractToken(req);

  if ((cookies && cookies.jwt) || tokenFromHeader) {
    let token = cookies && cookies.jwt ? cookies.jwt : tokenFromHeader;
    console.log(token)
    let decoded = verifyToken(token, process.env.ACCESS_TOKEN_SECRET);
    console.log(decoded)

    if (decoded) {
      req.user = decoded;
      req.token = token;
      next();
    } else {
      return res.status(401).json({
        EC: -1,
        DT: "",
        EM: "User authentication failed, please log in again",
      });
    }
  } else {
    return res.status(401).json({
      EC: -1,
      DT: "",
      EM: "User authentication failed, please log in again",
    });
  }
};

module.exports = {
  createJWT,
  verifyToken,
  checkUserJWT,
};
