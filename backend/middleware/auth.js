import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.token || req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7).trim()
    : authHeader;

  if (!token) {
    return res.json({ success: false, message: "Not Authorized Login Again" });
  }

  try {
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    req.body = req.body || {};
    req.userId = token_decode.id;
    req.body.userId = token_decode.id;
    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Invalid token, please login again" });
  }
};

export default authMiddleware;
