const jwt = require("jsonwebtoken");

const verifyUser = (request, auth = true) => {
  const header = request.request
    ? request.request.headers.authorization
    : request.connection.context.Authorization;
  if (header) {
    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, "mysecret");
    return decoded.userId;
  }
  if (auth) throw new AuthError();

  return null;
};

class AuthError extends Error {
  constructor() {
    super("Authorization Failed! You're not allowed to access this query.");
  }
}

module.exports = verifyUser;
