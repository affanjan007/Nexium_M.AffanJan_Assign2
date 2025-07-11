import mongoose from 'mongoose';

const BlogTextSchema = new mongoose.Schema({
  url: { type: String, required: true, unique: true },
  fullText: { type: String, required: true },
});

export default mongoose.models.BlogText || mongoose.model('BlogText', BlogTextSchema);
