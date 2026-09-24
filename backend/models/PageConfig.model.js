import mongoose from 'mongoose';

const pageConfigSchema = new mongoose.Schema({
  pageName: { type: String, required: true, unique: true }, // 'home', 'all', 'flavors', 'bestsellers'
  title: { type: String },
  subtitle: { type: String },
  description: { type: String },
  banners: [{ type: mongoose.Schema.Types.Mixed }],
  categories: [{ 
    name: { type: String },
    img: { type: String }
  }],
  extraData: { type: mongoose.Schema.Types.Mixed } 
}, { timestamps: true });

const PageConfig = mongoose.model('PageConfig', pageConfigSchema);

export default PageConfig;
