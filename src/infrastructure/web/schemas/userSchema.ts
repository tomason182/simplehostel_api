const PASS_MIN_LENGTH = 8;
const PASS_MIN_LOWERCASE = 1;
const PASS_MIN_UPPERCASE = 1;
const PASS_MIN_NUMBERS = 1;
const PASS_MIN_SYMBOLS = 1;

export const userSchema = {
  username: {
    in: ["body"],
    trim: true,
    notEmpty: {
      bail: true,
      errorMessage: "username must be provided",
    },
    isEmail: {
      bail: true,
      errorMessage: "username must be an email",
    },
    normalizeEmail: true,
    isLength: {
      options: {
        max: 255,
      },
      errorMessage: "Username maximum length is 255 characters.",
    },
  },
  password: {
    in: ["body"],
    isStrongPassword: {
      options: {
        minLength: PASS_MIN_LENGTH,
        minLowercase: PASS_MIN_LOWERCASE,
        minUppercase: PASS_MIN_UPPERCASE,
        minNumbers: PASS_MIN_NUMBERS,
        minSymbols: PASS_MIN_SYMBOLS,
      },
    },
    custom: {
      options: (value: string) => {
        if (/\s/.test(value)) {
          throw new Error("Password must not contain white spaces");
        }
        return true;
      },
    },
    errorMessage:
      "Password must contain at least 8 characters, 1 lowercase, 1 uppercase, 1 number and 1 symbol",
  },
  firstName: {
    in: ["body"],
    trim: true,
    exists: {
      bail: true,
      errorMessage: "First name must be provided.",
    },
    escape: true,
    isLength: {
      options: {
        min: 1,
        max: 100,
      },
      errorMessage:
        "First name is required and maximum length is 100 characters.",
    },
  },
  lastName: {
    in: ["body"],
    trim: true,
    optional: true,
    escape: true,
    isLength: {
      options: {
        max: 100,
      },
      errorMessage: "Last name maximum length is 100 characters.",
    },
  },
};

export const userLoginSchema = {
  username: {
    in: ["body"],
    trim: true,
    isEmail: {
      bail: true,
      errorMessage: "username is not a valid email",
    },
    normalizeEmail: true,
  },
  password: {
    in: ["body"],
    trim: true,
    notEmpty: {
      bail: true,
      errorMessage: "Password is required",
    },
  },
};

export const userUpdateSchema = {
  firstName: {
    in: ["body"],
    trim: true,
    notEmpty: {
      bail: true,
      errorMessage: "First name must not be empty",
    },
    escape: true,
    isLength: {
      options: {
        min: 1,
        max: 100,
      },
      errorMessage: "First maximum length is 100 characters",
    },
  },
  lastName: {
    in: ["body"],
    optional: true,
    trim: true,
    escape: true,
    isLength: {
      options: {
        max: 100,
      },
      errorMessage: "Last name maximum length is 100 characters",
    },
  },
};

export const changePassSchema = {
  currentPassword: {
    in: ["body"],
    notEmpty: {
      bail: true,
      errorMessage: "Password is required",
    },
  },
  newPassword: {
    in: ["body"],
    isStrongPassword: {
      options: {
        minLength: PASS_MIN_LENGTH,
        minLowercase: PASS_MIN_LOWERCASE,
        minUppercase: PASS_MIN_UPPERCASE,
        minNumbers: PASS_MIN_NUMBERS,
        minSymbols: PASS_MIN_SYMBOLS,
      },
    },
    custom: {
      options: (value: string) => {
        if (/\s/.test(value)) {
          throw new Error("Password should not contain white spaces");
        }
        return true;
      },
    },
    errorMessage:
      "Password must contain at least 8 characters, 1 lowercase, 1 uppercase, 1 numbers and 1 symbols",
  },
  repeatNewPassword: {
    in: ["body"],
    isStrongPassword: {
      options: {
        minLength: PASS_MIN_LENGTH,
        minLowercase: PASS_MIN_LOWERCASE,
        minUppercase: PASS_MIN_UPPERCASE,
        minNumbers: PASS_MIN_NUMBERS,
        minSymbols: PASS_MIN_SYMBOLS,
      },
    },
    custom: {
      options: (value: string) => {
        if (/\s/.test(value)) {
          throw new Error("Password should not contain white spaces");
        }
        return true;
      },
    },
    errorMessage:
      "Password must contain at least 8 characters, 1 lowercase, 1 uppercase, 1 numbers and 1 symbols",
  },
};

export const usernameSchema = {
  username: {
    in: ["body"],
    trim: true,
    isEmail: {
      bail: true,
      errorMessage: "username is not a valid email",
    },
    normalizeEmail: true,
  },
};

export const resetPassSchema = {
  token: {
    in: ["params"],
    isJWT: true,
    errorMessage: "Invalid JWT token",
  },
  newPassword: {
    in: ["body"],
    isStrongPassword: {
      options: {
        minLength: PASS_MIN_LENGTH,
        minLowercase: PASS_MIN_LOWERCASE,
        minUppercase: PASS_MIN_UPPERCASE,
        minNumbers: PASS_MIN_NUMBERS,
        minSymbols: PASS_MIN_SYMBOLS,
      },
    },
    custom: {
      options: (value: string) => {
        if (/\s/.test(value)) {
          throw new Error("Password should not contain white spaces");
        }
        return true;
      },
    },
    errorMessage:
      "Password must contain at least 8 characters, 1 lowercase, 1 uppercase, 1 numbers and 1 symbols",
  },
  repeatNewPassword: {
    in: ["body"],
    isStrongPassword: {
      options: {
        minLength: PASS_MIN_LENGTH,
        minLowercase: PASS_MIN_LOWERCASE,
        minUppercase: PASS_MIN_UPPERCASE,
        minNumbers: PASS_MIN_NUMBERS,
        minSymbols: PASS_MIN_SYMBOLS,
      },
    },
    custom: {
      options: (value: string) => {
        if (/\s/.test(value)) {
          throw new Error("Password should not contain white spaces");
        }
        return true;
      },
    },
    errorMessage:
      "Password must contain at least 8 characters, 1 lowercase, 1 uppercase, 1 numbers and 1 symbols",
  },
};
