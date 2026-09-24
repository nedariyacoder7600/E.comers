import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSave, FiImage, FiType, FiArrowLeft, FiPlus, FiTrash2, FiUploadCloud } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdminAppearance = () => {
  const [activePage, setActivePage] = useState('home');
  const [config, setConfig] = useState({
    pageName: 'home',
    title: '',
    subtitle: '',
    description: '',
    banners: [],
    categories: []
  });
  const [loading, setLoading] = useState(true);

  const pages = [
    { id: 'home', name: 'Home Hub' },
    { id: 'all', name: 'All Collection' },
    { id: 'flavors', name: 'Flavor Mesh' },
    { id: 'bestsellers', name: 'Elite Tier' }
  ];

  const fetchConfig = async (pageId) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/page-config/${pageId}`);
      if (response.data.config) {
        setConfig(response.data.config);
      } else {
        setConfig({ pageName: pageId, title: pageId.toUpperCase(), subtitle: 'SYSTEM_ACTIVE', description: '', banners: [], categories: [] });
      }
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load portal configuration.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig(activePage);
  }, [activePage]);

  const handleUpload = async (e, type, index) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      toast.info('Synchronizing visual vector...');
      const res = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (type === 'banner') {
        const newBanners = [...config.banners];
        if (typeof newBanners[index] === 'string') {
          newBanners[index] = { img: res.data.imageUrl, title: '' };
        } else {
          newBanners[index].img = res.data.imageUrl;
        }
        setConfig({ ...config, banners: newBanners });
      } else if (type === 'category') {
        const newCategories = [...config.categories];
        newCategories[index].img = res.data.imageUrl;
        setConfig({ ...config, categories: newCategories });
      }
      
      toast.success('Visual matrix updated.');
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Portal Sync Error.';
      toast.error(`Upload Failed: ${errorMsg}`);
    }
  };

  const handleSave = async () => {
    try {
      await axios.post('http://localhost:5000/api/page-config', config);
      toast.success(`${activePage.toUpperCase()} synchronized with core node.`);
    } catch (error) {
      toast.error('Synchronization failed.');
    }
  };

  const addBanner = () => {
    setConfig({ ...config, banners: [...config.banners, { img: '', title: '' }] });
  };

  const updateBanner = (index, field, val) => {
    const newBanners = [...config.banners];
    if (typeof newBanners[index] === 'string') {
       newBanners[index] = { img: newBanners[index], title: '' };
    }
    newBanners[index][field] = val;
    setConfig({ ...config, banners: newBanners });
  };

  const removeBanner = (index) => {
    const newBanners = config.banners.filter((_, i) => i !== index);
    setConfig({ ...config, banners: newBanners });
  };

  const addCategory = () => {
    setConfig({ ...config, categories: [...(config.categories || []), { name: '', img: '' }] });
  };

  const updateCategory = (index, field, val) => {
    const newCategories = [...config.categories];
    newCategories[index][field] = val;
    setConfig({ ...config, categories: newCategories });
  };

  const removeCategory = (index) => {
    const newCategories = config.categories.filter((_, i) => i !== index);
    setConfig({ ...config, categories: newCategories });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-gray-100 p-4 lg:p-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
          <div>
            <Link to="/admin/dashboard" className="flex items-center gap-2 text-gold text-xs uppercase tracking-[0.4em] mb-4"><FiArrowLeft /> Return_to_Root</Link>
            <h1 className="text-5xl font-bold font-cormorant uppercase tracking-tighter">Portal <span className="text-gold">Architecture</span></h1>
          </div>
          <button onClick={handleSave} className="bg-gold text-black px-12 py-5 rounded-2xl font-black uppercase tracking-[0.4em] text-[10px] flex items-center gap-4 shadow-2xl hover:bg-white transition-all">
            <FiSave /> Sync_All
          </button>
        </div>

        <div className="flex gap-4 mb-12 overflow-x-auto pb-4">
          {pages.map(page => (
            <button key={page.id} onClick={() => setActivePage(page.id)} className={`px-8 py-3 rounded-xl text-[9px] font-black uppercase tracking-[0.3em] transition-all border ${activePage === page.id ? 'bg-gold/10 text-gold border-gold/40' : 'bg-black/40 text-gray-600 border-white/5'}`}>{page.name}</button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {!loading && (
            <motion.div key={activePage} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-12">
              <section className="bg-black/40 backdrop-blur-3xl border border-white/5 p-12 rounded-[50px]">
                <h2 className="text-2xl font-bold font-cormorant uppercase tracking-[0.2em] text-gold mb-10 flex items-center gap-4"><FiType className="text-gray-600" /> Semantic_Layer</h2>
                <div className="grid gap-8">
                  <div className="space-y-2"><label className="text-[9px] uppercase tracking-[0.5em] text-gray-500 font-black">Primary_Header</label>
                    <input className="w-full bg-[#111] border border-white/5 rounded-2xl py-5 px-8 text-sm focus:border-gold outline-none" value={config.title} onChange={(e) => setConfig({...config, title: e.target.value})} />
                  </div>
                  <div className="space-y-2"><label className="text-[9px] uppercase tracking-[0.5em] text-gray-500 font-black">Secondary_Accent</label>
                    <input className="w-full bg-[#111] border border-white/5 rounded-2xl py-5 px-8 text-sm focus:border-gold outline-none italic text-gold" value={config.subtitle} onChange={(e) => setConfig({...config, subtitle: e.target.value})} />
                  </div>
                  <div className="space-y-2"><label className="text-[9px] uppercase tracking-[0.5em] text-gray-500 font-black">Atmospheric_Context</label>
                    <textarea className="w-full bg-[#111] border border-white/5 rounded-2xl py-5 px-8 text-sm focus:border-gold outline-none resize-none" rows="4" value={config.description} onChange={(e) => setConfig({...config, description: e.target.value})} />
                  </div>
                </div>
              </section>

              <section className="bg-black/40 backdrop-blur-3xl border border-white/5 p-12 rounded-[50px]">
                <div className="flex justify-between items-center mb-10">
                  <h2 className="text-2xl font-bold font-cormorant uppercase tracking-[0.2em] text-gold flex items-center gap-4"><FiImage className="text-gray-600" /> Visual_Matrix</h2>
                  <button onClick={addBanner} className="px-6 py-3 bg-gold/5 border border-gold/30 text-gold text-[9px] font-black uppercase rounded-xl">Add_Vector</button>
                </div>
                <div className="space-y-8">
                  {config.banners?.map((banner, index) => {
                    const bannerImg = typeof banner === 'string' ? banner : (banner?.img || '');
                    const bannerTitle = typeof banner === 'string' ? '' : (banner?.title || '');
                    return (
                    <div key={index} className="flex flex-col md:flex-row gap-4 items-center bg-[#0a0a0a] p-6 rounded-3xl border border-white/5">
                      <div className="w-full md:w-1/3 space-y-2">
                         <label className="text-[8px] uppercase tracking-widest text-gray-600">Banner Title</label>
                         <input className="w-full bg-[#111] border border-white/5 rounded-xl py-3 px-4 text-xs focus:border-gold outline-none" value={bannerTitle} onChange={(e) => updateBanner(index, 'title', e.target.value)} placeholder="Banner Title" />
                      </div>
                      <div className="flex-grow flex gap-4 items-center w-full">
                         <div className="relative flex-grow">
                           <input className="w-full bg-[#111] border border-white/5 rounded-xl py-3 pl-4 pr-16 text-[10px] focus:border-gold outline-none" value={bannerImg} onChange={(e) => updateBanner(index, 'img', e.target.value)} placeholder="Image URL" />
                           {bannerImg && <img src={bannerImg} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full object-cover border border-white/10" />}
                         </div>
                         <label className="p-3 bg-gold/10 text-gold border border-gold/20 rounded-xl hover:bg-gold hover:text-black cursor-pointer">
                           <FiUploadCloud size={18} /><input type="file" className="hidden" onChange={(e) => handleUpload(e, 'banner', index)} accept="image/*" />
                         </label>
                         <button onClick={() => removeBanner(index)} className="p-3 bg-red-500/10 text-red-500 rounded-xl border border-red-500/10"><FiTrash2 size={18} /></button>
                      </div>
                    </div>
                  )})}
                </div>
              </section>

              {(activePage === 'home' || activePage === 'all') && (
                <section className="bg-black/40 backdrop-blur-3xl border border-white/5 p-12 rounded-[50px]">
                  <div className="flex justify-between items-center mb-10">
                    <h2 className="text-2xl font-bold font-cormorant uppercase tracking-[0.2em] text-gold flex items-center gap-4"><FiImage className="text-gray-600" /> {activePage === 'home' ? 'Home Round Images' : 'All Page Arches'}</h2>
                    <button onClick={addCategory} className="px-6 py-3 bg-gold/5 border border-gold/30 text-gold text-[9px] font-black uppercase rounded-xl">Add_Category</button>
                  </div>
                  <div className="space-y-8">
                    {config.categories?.map((cat, index) => (
                      <div key={index} className="flex flex-col md:flex-row gap-4 items-center bg-[#0a0a0a] p-6 rounded-3xl border border-white/5">
                        <div className="w-full md:w-1/3 space-y-2">
                           <label className="text-[8px] uppercase tracking-widest text-gray-600">Name</label>
                           <input className="w-full bg-[#111] border border-white/5 rounded-xl py-3 px-4 text-xs focus:border-gold outline-none" value={cat.name} onChange={(e) => updateCategory(index, 'name', e.target.value)} placeholder="Category Name" />
                        </div>
                        <div className="flex-grow flex gap-4 items-center w-full">
                           <div className="relative flex-grow">
                             <input className="w-full bg-[#111] border border-white/5 rounded-xl py-3 pl-4 pr-16 text-[10px] focus:border-gold outline-none" value={cat.img} onChange={(e) => updateCategory(index, 'img', e.target.value)} placeholder="Image URL" />
                             {cat.img && <img src={cat.img} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full object-cover border border-white/10" />}
                           </div>
                           <label className="p-3 bg-gold/10 text-gold border border-gold/20 rounded-xl hover:bg-gold hover:text-black cursor-pointer">
                             <FiUploadCloud size={18} /><input type="file" className="hidden" onChange={(e) => handleUpload(e, 'category', index)} accept="image/*" />
                           </label>
                           <button onClick={() => removeCategory(index)} className="p-3 bg-red-500/10 text-red-500 rounded-xl border border-red-500/10"><FiTrash2 size={18} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
export default AdminAppearance;
