const jwt = require("jsonwebtoken");
const { AuthenticationError } = require("apollo-server");

const { User } = require("./db/index");

const SECRET_KEY = process.env.SECRET_KEY;

const authenticated = (next) => (parent, args, context, info) => {
  if (!context.user) {
    throw new Error("not authorized");
  }
  return next(parent, args, context, info);
};

const authorized = (role, next) => (parent, args, context, info) => {
  if (context.user.role !== role) {
    throw new AuthenticationError(`you must have ${role} role`);
  }

  return next(parent, args, context, info);
};

async function verifyAndGetUser(token) {
  try {
    if (!token) {
      throw new Error("You are not logged in! Please log in to get access.");
    }

    const decodedToken = jwt.verify(token, SECRET_KEY);

    //check if the user exit
    const user = await User.findById(decodedToken.id);
    if (!user) {
      throw new Error("'There is no user with this id.");
    }

    //check the user is changed password after the token create
    if (user.changePasswordAt(decodedToken.iat)) {
      throw new Error("User recently changed password! Please log in again.");
    }

    return user;
  } catch (e) {
    return null;
  }
}

module.exports = {
  authenticated,
  authorized,
  verifyAndGetUser,
};
