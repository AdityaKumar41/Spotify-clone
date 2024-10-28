const JWT = require("jsonwebtoken");
require("dotenv").config();

// Use JWT secret from environment variables or a fallback
const SECRET = process.env.JWT_SECRET || "secret"; // Changed to JWT_SECRET for clarity

class JWTServices {
  // Fixed typo from 'GenereateJWT' to 'GenerateJWT'
  static GenerateJWT(user) {
    const payload = {
      id: user.id,
      email: user.email,
    };

    // Sign the JWT token
    const token = JWT.sign(payload, SECRET);
    return token;
  }

  static VerifyJWT(token) {
    try {
      // Verify the JWT token
      const user = JWT.verify(token, SECRET);
      return user;
    } catch (error) {
      console.error("JWT verification error:", error);
      return null; // Return null if verification fails
    }
  }
}

module.exports = JWTServices;
