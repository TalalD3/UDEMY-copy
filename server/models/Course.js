import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    small_description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    chapters: [{
      title: {
        type: String,
        required: true
      },
      videoUrl: {
        type: String,
        required: true
      }
    }],
    date: {
      type: Date,
      default: Date.now,
    },
    isPublish: {
      type: Boolean,
      default: false,
    },
  }
);

export default mongoose.model("Course", courseSchema);