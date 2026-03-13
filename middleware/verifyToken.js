import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  const token = req.header("x-auth-token") || req.header("Authorization")?.replace("Bearer ", "");
  
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.userId, role: decoded.role }; 
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

export default verifyToken;