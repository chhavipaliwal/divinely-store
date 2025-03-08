import { Link as LinkInterface } from '@/lib/interface';
import mongoose, { Model } from 'mongoose';

const linkSchema = new mongoose.Schema<LinkInterface>(
  {
    category: String,
    title: String,
    description: String,
    tags: [String],
    url: {
      type: String,
      required: true,
      unique: true
    },
    slug: String,
    image: String,
    addedBy: String,
    modifiedBy: String,
    thumbnail: String,
    isEditorsPick: Boolean,
    isFeatured: Boolean
  },
  {
    timestamps: true
  }
);

const Link: Model<LinkInterface> =
  mongoose.models.Link || mongoose.model<LinkInterface>('Link', linkSchema);
export default Link;
