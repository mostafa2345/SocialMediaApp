import crypto from "crypto";
function hashPassword(pass) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(pass, salt, 1000, 65, "sha512")
    .toString("hex");
  return { salt, hash };
}
function validatePassword(password, salt, hash) {
  const newHash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");
  return hash === newHash;
}

export { hashPassword, validatePassword };
