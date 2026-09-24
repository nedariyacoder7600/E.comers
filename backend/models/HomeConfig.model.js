import mongoose from 'mongoose';

const homeConfigSchema = new mongoose.Schema({
  heroBanners: [{ type: String }],
  heroTitle: { type: String, default: 'SENSORY REVOLUTION' },
  heroSubtitle: { type: String, default: 'REVOLUTION' },
  heroDescription: { type: String, default: 'Step into the next generation of hookah culture. Where molecular science meets luxury lifestyle.' },
  featuredText: { type: String, default: 'Established 2030 • Digital Luxury' },
}, { timestamps: true });

const HomeConfig = mongoose.model('HomeConfig', homeConfigSchema);

export default HomeConfig;
