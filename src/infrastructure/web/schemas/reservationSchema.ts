type SelectedRoom = {
  roomTypeId: number;
  numberOfRooms: number;
  totalAmount: number;
};

export const reservationSchema = {
  firstName: {
    in: ["body"],
    trim: true,
    escape: true,
    notEmpty: {
      bail: true,
      errorMessage: "First name must not be empty",
    },
    isLength: {
      options: {
        min: 1,
        max: 255,
      },
      errorMessage: "First name maximum length is 255 characters",
    },
  },
  lastName: {
    in: ["body"],
    trim: true,
    escape: true,
    notEmpty: {
      bail: true,
      errorMessage: "Last name must not be empty",
    },
    isLength: {
      options: {
        min: 1,
        max: 255,
      },
      errorMessage: "Last name maximum length is 255 characters",
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
  phoneCode: {
    in: ["body"],
    optional: true,
    trim: true,
    matches: {
      options: [/^\+[0-9]{1,3}$/],
      errorMessage: "Invalid phone code. Must be like +61 or +549",
    },
  },
  city: {
    in: ["body"],
    optional: true,
    trim: true,
    escape: true,
    isLength: {
      options: {
        min: 1,
        max: 255,
      },
      errorMessage: "City maximum length is 255 characters",
    },
  },
  street: {
    in: ["body"],
    optional: true,
    trim: true,
    escape: true,
    isLength: {
      options: {
        min: 1,
        max: 255,
      },
      errorMessage: "Address maximum length is 255 characters",
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
  selectedRooms: {
    in: ["body"],
    exists: {
      bail: true,
      errorMessage: "Selected rooms must be provided",
    },
    isArray: {
      bail: true,
      errorMessage: "Selected rooms must be an array",
    },
    custom: {
      options: (values: SelectedRoom[]): true => {
        // Ensure values is an array
        if (!Array.isArray(values)) {
          throw new Error("Selected rooms must be an array");
        }

        // Ensure array is not empty
        if (values.length === 0) {
          throw new Error("Selected rooms array cannot be empty");
        }

        const validKeys = ["room_type_id", "number_of_rooms", "total_amount"];

        // Ensure each value of the array is an object
        for (const obj of values) {
          if (typeof obj !== "object" || obj === null) {
            throw new Error("Each item in selected room must be an object");
          }

          // Ensure object only contains valid keys
          const objKeys = Object.keys(obj);
          if (!objKeys.every((key) => validKeys.includes(key))) {
            throw new Error("Invalid key provided in SelectedRooms object");
          }

          // Ensure room_type_id is an integer.
          if (!Number.isInteger(obj.roomTypeId)) {
            throw new Error("room_type_id must be an integer");
          }

          // Ensure number_of_rooms is an integer.
          if (!Number.isInteger(obj.numberOfRooms)) {
            throw new Error("number_of_rooms must be an integer");
          }

          // Ensure total_amount is valid number.
          if (typeof obj.totalAmount !== "number" || isNaN(obj.totalAmount)) {
            throw new Error("total_amount must be a valid number");
          }

          // Ensure total amount is positive
          if (obj.totalAmount < 0) {
            throw new Error("total_amount must be a positive number");
          }

          // Ensure number of guest is positive
          if (obj.numberOfRooms <= 0) {
            throw new Error("Number of guest must be positive number");
          }
        }
        return true;
      },
    },
  },
  bookingSource: {
    in: ["body"],
    exists: {
      bail: true,
      errorMessage: "Booking source must be provided",
    },
    isIn: {
      options: [
        ["booking.com", "hostelWorld.com", "direct", "other", "book-engine"],
      ],
      errorMessage:
        "Booking source must be one of: booking.com, hostelWorld.com, direct, other or book-engine",
    },
  },
  checkIn: {
    in: ["body"],
    exists: {
      bail: true,
      errorMessage: "Check-in date must be provided",
    },
    isISO8601: {
      strict: true,
      errorMessage: "Check-in date mus be ISO8601 format",
    },
    customSanitizer: {
      options: (value: string): Date => new Date(value),
    },
  },
  checkOut: {
    in: ["body"],
    exists: {
      bail: true,
      errorMessage: "Check-out date must be provided",
    },
    isISO8601: {
      strict: true,
      errorMessage: "Check-out date mus be ISO8601 format",
    },
    customSanitizer: {
      options: (value: string): Date => new Date(value),
    },
  },
  currency: {
    in: ["body"],
    exists: {
      bail: true,
      errorMessage: "Currency must be provided",
    },
    trim: true,
    isISO4217: {
      bail: true,
      errorMessage: "currency must be ISO 4217 format",
    },
  },
  reservationStatus: {
    in: ["body"],
    exists: {
      bail: true,
      errorMessage: "Reservation status must be specified",
    },
    isIn: {
      options: [["confirmed", "provisional", "canceled", "no_show"]],
      errorMessage:
        "Reservation status must be one of confirmed, provisional, canceled, no_show",
    },
  },
  paymentStatus: {
    in: ["body"],
    exists: {
      bail: true,
      errorMessage: "payment status must be provided",
    },
    isIn: {
      options: [["pending", "refunded", "paid", "partial"]],
      errorMessage:
        "Payment status must be one of: pending, canceled, refunded, paid, partial",
    },
  },
  specialRequest: {
    in: ["body"],
    trim: true,
    escape: true,
    isLength: {
      options: {
        max: 500,
      },
      errorMessage: "Special request maximum length is 500 characters",
    },
  },
  sendEmail: {
    in: ["body"],
    exists: {
      bail: true,
      errorMessage: "Send email is required",
    },
    isBoolean: {
      bail: true,
      errorMessage: "Send email must be boolean.",
    },
  },
};

export const findReservationsByDatesAndName = {
  from: {
    in: ["body"],
    trim: true,
    optional: true,
    isISO8601: {
      strict: true,
      errorMessage: "Invalid date format",
    },
    customSanitizer: {
      options: (value: string): Date => new Date(value),
    },
  },
  until: {
    in: ["body"],
    optional: true,
    isISO8601: {
      strict: true,
      errorMessage: "Check-in date mus be ISO8601 format",
    },
    customSanitizer: {
      options: (value: string): Date => new Date(value),
    },
  },
  name: {
    in: ["body"],
    trim: true,
    escape: true,
    optional: true,
  },
};

export const changeReservationDates = {
  newCheckIn: {
    in: ["body"],
    exists: {
      bail: true,
      errorMessage: "New check-in must be provided",
    },
    isISO8601: {
      strict: true,
      errorMessage: "New Check-in date must be ISO8601 format",
    },
    customSanitizer: {
      options: (value: string): Date => new Date(value),
    },
  },
  newCheckOut: {
    in: ["body"],
    exists: {
      bail: true,
      errorMessage: "New check-out must be provided",
    },
    isISO8601: {
      strict: true,
      errorMessage: "New check-out must be ISO8601 format",
    },
    customSanitizer: {
      options: (value: string): Date => new Date(value),
    },
  },
};
