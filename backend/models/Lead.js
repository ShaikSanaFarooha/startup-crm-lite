import mongoose from 'mongoose';

const { Schema } = mongoose;

/**
 * Lead Schema Definition
 */
const leadSchema = new Schema(
  {
    /**
     * The full name of the lead contact.
     * Must be a trimmed string between 2 and 100 characters long.
     * @type {String}
     */
    name: {
      type: String,
      required: [true, 'Lead name is required'],
      trim: true,
      minlength: [2, 'Lead name must be at least 2 characters long'],
      maxlength: [100, 'Lead name cannot exceed 100 characters'],
    },

    /**
     * The company/organization the lead belongs to.
     * Required and trimmed.
     * @type {String}
     */
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },

    /**
     * The contact email address of the lead.
     * Required, trimmed, and validated for proper email format.
     * @type {String}
     */
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      validate: {
        validator: function (v) {
          // Standard RFC 5322 email regex validator
          return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
        },
        message: 'Email must be a valid email address',
      },
    },

    /**
     * The contact phone number of the lead.
     * Optional and trimmed.
     * @type {String}
     */
    phone: {
      type: String,
      trim: true,
    },

    /**
     * Current status of the lead in the pipeline.
     * Must match exactly one of the predefined lifecycle states.
     * @type {String}
     */
    status: {
      type: String,
      enum: {
        values: ['New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost'],
        message: '{VALUE} is not a valid lead status',
      },
      default: 'New',
    },

    /**
     * Acquisition channel source of the lead.
     * Must match exactly one of the predefined channels.
     * @type {String}
     */
    source: {
      type: String,
      enum: {
        values: ['Website', 'Referral', 'LinkedIn', 'Cold Call', 'Email Campaign', 'Other'],
        message: '{VALUE} is not a valid lead source',
      },
      default: 'Website',
    },

    /**
     * Additional notes or description details for the lead.
     * Maximum length of 1000 characters. Optional.
     * @type {String}
     */
    notes: {
      type: String,
      maxlength: [1000, 'Notes cannot exceed 1000 characters'],
    },

    /**
     * The financial value of the lead.
     * Optional field. Defaults to 0.
     * @type {Number}
     */
    value: {
      type: Number,
      default: 0,
    },

    /**
     * The reference ID of the User who owns/created the lead.
     * Required field referencing the User model.
     * @type {mongoose.Schema.Types.ObjectId}
     */
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Lead owner (User ID) is required'],
    },
  },
  {
    // Automatically manage createdAt and updatedAt timestamps
    timestamps: true,
    // Ensure virtuals are serialized in response outputs
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/**
 * Compound index on (owner, status) to optimize dashboard filtering
 * and user-specific lead views.
 */
leadSchema.index({ owner: 1, status: 1 });

/**
 * Single index on email to optimize searching and duplicates checking.
 */
leadSchema.index({ email: 1 });

/**
 * Compound index on (owner, createdAt) to optimize chronological lists
 * and date-range queries.
 */
leadSchema.index({ owner: 1, createdAt: -1 });

/**
 * Compound index on (owner, status, source) to optimize multi-filter dashboard requests.
 */
leadSchema.index({ owner: 1, status: 1, source: 1 });

/**
 * Virtual property to calculate the age of the lead in days.
 * Calculated as the floor value of the difference between current date and creation date.
 * @name age
 * @type {Number}
 */
leadSchema.virtual('age').get(function () {
  if (!this.createdAt) {
    return 0;
  }
  const diffInMs = Date.now() - this.createdAt.getTime();
  return Math.floor(diffInMs / (1000 * 60 * 60 * 24));
});

// Export the schema for potential reuse or extension
export { leadSchema };

// Create the model
const Lead = mongoose.model('Lead', leadSchema);

// Export the model as both named and default exports
export { Lead };
export default Lead;
