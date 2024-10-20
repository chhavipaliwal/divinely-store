import { Category as CategoryInterface } from '@/lib/interface';
import mongoose, { Model } from 'mongoose';
import slugify from 'slugify';

const linkSchema = new mongoose.Schema<CategoryInterface>(
  {
    name: String,
    uid: {
      type: String,
      unique: true
    },
    addedBy: String,
    modifiedBy: String
  },
  {
    timestamps: true
  }
);

linkSchema.pre('save', function (next) {
  this.uid = slugify(this.name, { lower: true });
  next();
});

const Category: Model<CategoryInterface> =
  mongoose.models.Category ||
  mongoose.model<CategoryInterface>('Category', linkSchema);

export default Category;
