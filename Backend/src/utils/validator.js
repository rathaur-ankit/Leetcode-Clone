const validator = require("validator");

const validate = (data) => {
  const { firstName, emailId, password } = data;
  if (!firstName || !emailId || !password)
    throw new Error("Some fields missing");
  if (!validator.isEmail(emailId)) throw new Error("invalid email address");
  if (!validator.isStrongPassword(password)) throw new Error("weak password");
};

module.exports = { validate };
