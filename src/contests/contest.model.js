import mongoose from "mongoose";

const { Schema } = mongoose;

const contestSchema = new Schema(
  {
    contestId: {
      type: String,
      required: true, // platform-specific ID / code / slug
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    platform: {
      type: String,
      required: true, // codeforces | codechef | leetcode
      trim: true,
    },

    startTime: {
      type: Date,
      required: true,
    },

    durationMinutes: {
      type: Number,
      default:null
    },

    contestLink: {
      type: String,
      required: true,
    },

    notified: {
      type: Boolean,
      default: false, 
    },

    reminderSent: {
      type: Boolean,
      default: false, 
    },
  },
  {
    timestamps: true,
  }
);

contestSchema.index(
  { contestId: 1, platform: 1 },
  { unique: true }
);

const Contest = mongoose.model("Contest", contestSchema);

export default Contest;
