export const guestSchema = {
  firstName: {
    in: ["body"],
    trim: true,
    escape: true,
    isLength: {
      options: {
        min: 1,
        max: 255,
      },
      errorMessage: "First name maximum length is 255 characters",
    },
    notEmpty: {
      bail: true,
      errorMessage: "First name must not be empty",
    },
  },
  lastName: {
    in: ["body"],
    trim: true,
    escape: true,
    isLength: {
      options: {
        min: 1,
        max: 255,
      },
      errorMessage: "Last name maximum length is 255 characters",
    },
    notEmpty: {
      bail: true,
      errorMessage: "Last name must not be empty",
    },
  },
  idNumber: {
    in: ["body"],
    optional: true,
    trim: true,
    escape: true,
    isLength: {
      options: {
        min: 1,
        max: 25,
      },
      errorMessage: "Passport or ID maximum length is 25",
    },
  },
  email: {
    in: ["body"],
    isEmail: {
      bail: true,
      errorMessage: "Not a valid email address",
    },
    normalizeEmail: true,
    notEmpty: {
      bail: true,
      errorMessage: "Email address must not be empty",
    },
    isLength: {
      options: {
        max: 255,
      },
      errorMessage: "Email maximum length is 100 characters",
    },
  },
  phoneNumber: {
    in: ["body"],
    optional: true,
    trim: true,
    isMobilePhone: {
      options: "any",
      errorMessage: "invalid phone number",
    },
  },
  city: {
    in: ["body"],
    optional: true,
    trim: true,
    escape: true,
    isLength: {
      options: {
        max: 255,
      },
      errorMessage: "City maximum length is 100 characters",
    },
  },
  street: {
    in: ["body"],
    optional: true,
    trim: true,
    escape: true,
    isLength: {
      options: {
        max: 255,
      },
      errorMessage: "Address maximum length is 100 characters",
    },
  },
  postalCode: {
    in: ["body"],
    optional: true,
    trim: true,
    isPostalCode: {
      options: "any",
      errorMessage: "invalid postal code",
    },
  },
  countryCode: {
    in: ["body"],
    optional: true,
    isISO31661Alpha2: {
      errorMessage: "Invalid country code",
    },
  },
};
