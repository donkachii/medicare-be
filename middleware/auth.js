import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }
  
    const token = authHeader.split(" ")[1];
   
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      console.log("decoded", decoded);
      req.user = decoded; // { id, role, email }
      next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  }
  
  export const adminMiddleware = async (req, res, next) => {
    const { role } = req.user;
    if (role !== "admin") {
      return res.status(401).json({ message: "Unauthorized" });
    } else {
      next();
    }
  };
  
  