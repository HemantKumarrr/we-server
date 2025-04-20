import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const jwt = jsonwebtoken;
const JWT_SECRET = process.env.JWT_SECRET;

const jwtFn = {
  genJWT: ({ id }) => {
    try {
      return jwt.sign({ id }, JWT_SECRET, { expiresIn: "1d" });
    } catch (error) {
      return new Error(error.message);
    }
  },
  verify_Jwt: (req, res, next) => {
    const token = req.cookies.accessToken;
    if (token)
      return jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
        if (err) return res.json({ error: "Unauthorized" });
        next();
      });
    res.json({ error: "authorized token not found" });
  },
};

export default jwtFn;
