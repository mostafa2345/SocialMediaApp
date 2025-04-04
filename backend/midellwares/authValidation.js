import{ body} from "express-validator";

const passwordValidation = body("password")
  .isLength({ min: 8 })
  .withMessage("Password must be at least 8 characters long");

const emailValidation = body("email")
  .isEmail()
  .withMessage("Valid email is required");

const validateLogin = [passwordValidation, emailValidation];

const validateRegister = [
  body("username").stripLow().notEmpty().withMessage("Username is required"),
  passwordValidation,
  emailValidation,
];

export { validateLogin, validateRegister };
