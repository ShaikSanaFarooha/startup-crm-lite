import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const { Schema } = mongoose;

/**
 * User Schema Definition
 */
const userSchema = new Schema(
  {
    /**
     * The user's full name.
     * Must be a trimmed string between 2 and 50 characters long.
     * @type {String}
     */
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },

    /**
     * The user's unique email address.
     * Converted to lowercase, trimmed, and validated against a standard RFC 5322 regex.
     * @type {String}
     */
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (v) {
          // Standard RFC 5322 email validation regex
          return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
        },
        message: 'Email must be a valid email address',
      },
    },

    /**
     * The user's hashed password.
     * Must be at least 6 characters long before hashing. Never stored as plain text.
     * @type {String}
     */
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
    },

    /**
     * The user's role in the system.
     * Restricted to either 'admin' or 'user'. Defaults to 'user'.
     * @type {String}
     */
    role: {
      type: String,
      enum: {
        values: ['admin', 'user'],
        message: '{VALUE} is not a valid role',
      },
      default: 'user',
    },

    /**
     * Flag indicating if the user's account is currently active.
     * Defaults to true.
     * @type {Boolean}
     */
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    // Automatically manage createdAt and updatedAt timestamps
    timestamps: true,
  }
);

/**
 * Pre-save middleware to hash the password before saving to the database.
 * Only hashes the password if it has been modified or is new.
 */
userSchema.pre('save', async function () {
  // If the password has not been modified, skip hashing
  if (!this.isModified('password')) {
    return;
  }

  // Generate salt with 10 rounds and hash the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

/**
 * Compares a candidate plain text password with the stored hashed password.
 * @param {string} candidatePassword - The plain text password to compare.
 * @returns {Promise<boolean>} Resolves to true if passwords match, false otherwise.
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    return false;
  }
};

/**
 * Overrides the default toJSON method to ensure that sensitive fields
 * like password are not leaked in responses.
 * @returns {Object} User document object without the password field.
 */
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

// Export the schema for potential reuse or extension
export { userSchema };

// Create the model
const User = mongoose.model('User', userSchema);

// Export the model as both named and default exports
export { User };
export default User;
