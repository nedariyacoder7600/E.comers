import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiTrash2, FiPackage, FiArrowLeft, FiImage, FiWind, FiUploadCloud, FiEdit, FiX } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category: 'Hookah Pot',
    img: '',
    img2: '',
    img3: '',
    img4: '',
    description: '',
    originalPrice: '',
    inStock: true,
    stockLabel: 'Out of Stock',
    colors: []
  });

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products');
      setProducts(response.data.products);
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error('Failed to sync with global product mesh.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleFileChange = async (e, field = 'img') => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      toast.info('Synchronizing asset to neural core...');
      const res = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setNewProduct({ ...newProduct, [field]: res.data.imageUrl });
      toast.success('Asset synced to gallery.');
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Unknown network error.';
      toast.error(`Sync Failed: ${errorMsg}`);
      console.error('Upload error details:', err);
    }
  };

  const handleColorImageUpload = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      toast.info('Synchronizing color asset...');
      const res = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const updatedColors = [...(newProduct.colors || [])];
      updatedColors[index] = { ...updatedColors[index], imageUrl: res.data.imageUrl };
      setNewProduct({ ...newProduct, colors: updatedColors });
      toast.success('Color asset synced.');
    } catch (err) {
      console.error(err);
      toast.error('Color sync failed.');
    }
  };

  const addColorVariant = () => {
    setNewProduct({ ...newProduct, colors: [...(newProduct.colors || []), { colorName: '', imageUrl: '' }] });
  };

  const removeColorVariant = (index) => {
    const updatedColors = [...(newProduct.colors || [])];
    updatedColors.splice(index, 1);
    setNewProduct({ ...newProduct, colors: updatedColors });
  };

  const handleColorChange = (index, field, value) => {
    const updatedColors = [...(newProduct.colors || [])];
    updatedColors[index] = { ...updatedColors[index], [field]: value };
    setNewProduct({ ...newProduct, colors: updatedColors });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`/api/products/${editId}`, newProduct);
        toast.success('Asset successfully modified in database.');
      } else {
        await axios.post('/api/products', newProduct);
        toast.success('Asset successfully initialized in database.');
      }
      setShowAddForm(false);
      setEditId(null);
      setNewProduct({ name: '', price: '', category: 'Hookah Pot', img: '', img2: '', img3: '', img4: '', description: '', originalPrice: '', inStock: true, stockLabel: 'Out of Stock', colors: [] });
      fetchProducts();
    } catch (error) {
      console.error(error);
      toast.error('Failed to manifest product entity.');
    }
  };

  const handleEditClick = (product) => {
    setEditId(product._id);
    setNewProduct({
      name: product.name || '',
      price: product.price || '',
      category: product.category || 'Hookah Pot',
      img: product.img || '',
      img2: product.img2 || '',
      img3: product.img3 || '',
      img4: product.img4 || '',
      description: product.description || '',
      originalPrice: product.originalPrice || '',
      inStock: product.inStock !== undefined ? product.inStock : true,
      stockLabel: product.stockLabel || 'Out of Stock',
      colors: product.colors || []
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/products/${id}`);
      toast.success('Asset terminated from system.');
      fetchProducts();
    } catch (error) {
      console.error(error);
      toast.error('Termination failed.');
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-gray-100 font-sans p-4 lg:p-12">
      
      {/* Header */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <Link to="/admin/dashboard" className="flex items-center gap-2 text-gold text-xs uppercase tracking-widest mb-4 hover:text-white transition-colors">
            <FiArrowLeft /> Return to Command Center
          </Link>
          <h1 className="text-4xl font-bold font-cormorant uppercase tracking-tighter">Inventory <span className="text-gold">Management</span></h1>
          <p className="text-gray-500 text-[10px] font-mono tracking-[0.3em] mt-2">ACCESSING GLOBAL ASSET REPOSITORY</p>
        </div>
        
        <button 
          onClick={() => { setEditId(null); setNewProduct({ name: '', price: '', category: 'Fruity', img: '', img2: '', img3: '', img4: '', description: '', originalPrice: '', inStock: true, stockLabel: 'Out of Stock', colors: [] }); setShowAddForm(true); }}
          className="bg-gold text-black px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-white transition-all shadow-[0_0_30px_rgba(212,175,55,0.2)]"
        >
          <FiPlus /> Initialize New Asset
        </button>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <motion.div 
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              key={product._id}
              className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden group hover:border-gold/20 transition-all shadow-2xl"
            >
              <div className="h-40 relative overflow-hidden bg-gray-900 flex items-center justify-center text-gray-700">
                {product.img ? (
                   <img src={product.img} className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity" alt={product.name} />
                ) : (
                  <FiPackage className="text-4xl" />
                )}
                <div className="absolute top-4 right-4 z-20 flex gap-2">
                   <button 
                     onClick={() => handleEditClick(product)}
                     className="p-2 bg-blue-500/10 text-blue-500 rounded-lg border border-blue-500/20 hover:bg-blue-500 hover:text-white transition-all"
                   >
                     <FiEdit />
                   </button>
                   <button 
                     onClick={() => handleDelete(product._id)}
                     className="p-2 bg-red-500/10 text-red-500 rounded-lg border border-red-500/20 hover:bg-red-500 hover:text-white transition-all"
                   >
                     <FiTrash2 />
                   </button>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[8px] font-bold text-gold uppercase tracking-[0.3em]">{product.category}</span>
                  <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                    product.inStock ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                  }`}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
                <h3 className="text-lg font-bold mb-1 truncate">{product.name}</h3>
                <div className="flex items-center gap-3">
                  <p className="text-xl font-mono text-white">{product.price}</p>
                  {product.originalPrice && (
                    <p className="text-xs font-mono text-gray-600 line-through">{product.originalPrice}</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {products.length === 0 && !loading && (
          <div className="text-center py-40 border-2 border-dashed border-white/5 rounded-3xl">
             <FiPackage className="text-6xl text-white/5 mx-auto mb-6" />
             <p className="text-gray-500 font-mono text-xs uppercase tracking-widest">NO CARGO DETECTED IN LOCAL SECTOR.</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-[#050505]/95 backdrop-blur-3xl border border-white/10 p-6 md:p-10 rounded-[40px] w-full max-w-3xl shadow-[0_0_100px_rgba(212,175,55,0.15)] relative flex flex-col max-h-[95vh]"
            >
              <button 
                onClick={() => { setShowAddForm(false); setEditId(null); setNewProduct({ name: '', price: '', category: 'Hookah Pot', img: '', img2: '', img3: '', img4: '', description: '', originalPrice: '', inStock: true, colors: [] }); }} 
                className="absolute top-6 right-6 md:top-8 md:right-8 p-3 bg-white/5 border border-white/10 rounded-full text-gray-400 hover:text-rose-500 hover:bg-rose-500/10 hover:border-rose-500/30 transition-all duration-300 shadow-xl group z-50 flex-shrink-0"
              >
                <FiX size={20} className="group-hover:rotate-90 transition-transform duration-300" />
              </button>
              
              <div className="mb-8 flex-shrink-0">
                <h2 className="text-3xl font-bold font-cormorant uppercase tracking-widest text-gold">{editId ? 'Asset Modification' : 'Initialize Asset'}</h2>
                <p className="text-gray-500 text-[10px] font-mono tracking-[0.2em] mt-1">SECURE DATA ENTRY PROTOCOL</p>
              </div>

              <form onSubmit={handleAddProduct} className="flex flex-col gap-6 flex-1 min-h-0">
                <div className="flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-2 pb-4">
                  
                  {/* Core Identity Section */}
                  <div className="bg-white/[0.02] p-6 md:p-8 rounded-[30px] border border-white/5">
                    <h3 className="text-xs uppercase font-bold text-gold tracking-widest mb-6 flex items-center gap-3">
                      <FiPackage className="text-lg" /> Core Identity
                    </h3>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Asset Name</label>
                        <input required className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-5 text-sm focus:border-gold outline-none transition-all focus:bg-black/80 text-white" value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} placeholder="e.g. Quantum Hookah V2" />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Sale Price (₹)</label>
                          <input required className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-5 text-sm focus:border-gold outline-none transition-all focus:bg-black/80 text-white" value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} placeholder="e.g. ₹159" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">MRP (Original ₹)</label>
                          <input className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-5 text-sm focus:border-gold outline-none transition-all focus:bg-black/80 text-white" value={newProduct.originalPrice} onChange={(e) => setNewProduct({...newProduct, originalPrice: e.target.value})} placeholder="e.g. ₹659" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Stock Status</label>
                          <select className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-5 text-sm focus:border-gold outline-none transition-all focus:bg-black/80 text-white appearance-none" value={newProduct.inStock} onChange={(e) => setNewProduct({...newProduct, inStock: e.target.value === 'true'})}>
                            <option value="true">In Stock</option>
                            <option value="false">Out of Stock</option>
                          </select>
                        </div>
                        {!newProduct.inStock && (
                          <div className="space-y-2">
                            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Stock Label (Text on Image)</label>
                            <input className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-5 text-sm focus:border-gold outline-none transition-all focus:bg-black/80 text-white" value={newProduct.stockLabel} onChange={(e) => setNewProduct({...newProduct, stockLabel: e.target.value})} placeholder="e.g. Coming Soon" />
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Category</label>
                        <select className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-5 text-sm focus:border-gold outline-none transition-all focus:bg-black/80 text-white appearance-none" value={newProduct.category} onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}>
                          <optgroup label="Main Categories" className="bg-black text-gold">
                            <option value="Hookah Pot">Hookah Pot</option>
                            <option value="Flavor">Flavor</option>
                            <option value="Coal">Coal</option>
                            <option value="Pipe">Pipe</option>
                            <option value="Chillum">Chillum</option>
                            <option value="Mouthpiece">Mouthpiece</option>
                            <option value="Tongs">Tongs</option>
                            <option value="Foil">Foil</option>
                            <option value="Grommets">Grommets</option>
                          </optgroup>
                          <optgroup label="Flavor Types" className="bg-black text-gold">
                            <option value="Fruity">Fruity</option>
                            <option value="Mint">Mint</option>
                            <option value="Creamy">Creamy</option>
                            <option value="Classic">Classic</option>
                            <option value="Tangy">Tangy</option>
                            <option value="Afzal">Afzal</option>
                            <option value="Maya">Maya</option>
                            <option value="Al Fakher">Al Fakher</option>
                            <option value="Starbuzz">Starbuzz</option>
                          </optgroup>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Description</label>
                        <textarea className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-5 text-sm focus:border-gold outline-none transition-all focus:bg-black/80 text-white h-28 resize-none" placeholder="Enter premium description..." value={newProduct.description} onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}></textarea>
                      </div>
                    </div>
                  </div>

                  {/* Visual Matrix Section */}
                  <div className="bg-white/[0.02] p-6 md:p-8 rounded-[30px] border border-white/5">
                    <h3 className="text-xs uppercase font-bold text-gold tracking-widest mb-6 flex items-center gap-3">
                      <FiImage className="text-lg" /> Visual Matrix
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { label: 'Primary Image', field: 'img', required: true },
                        { label: 'Image 2', field: 'img2', required: false },
                        { label: 'Image 3', field: 'img3', required: false },
                        { label: 'Image 4', field: 'img4', required: false },
                      ].map((imgField, idx) => (
                        <div key={idx} className="flex gap-3 items-center bg-black/40 p-3 rounded-2xl border border-white/5 hover:border-gold/30 transition-colors">
                          <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-[10px] font-bold text-gray-500">{idx+1}</div>
                          <div className="flex-grow flex flex-col">
                            <input required={imgField.required} className="bg-transparent border-none focus:ring-0 text-[11px] outline-none text-white w-full" placeholder={`URL for ${imgField.label}`} value={newProduct[imgField.field]} onChange={(e) => setNewProduct({...newProduct, [imgField.field]: e.target.value})} />
                          </div>
                          {newProduct[imgField.field] && <img src={newProduct[imgField.field]} className="w-10 h-10 rounded-xl object-cover border border-white/10 flex-shrink-0" alt="" />}
                          <label className="cursor-pointer bg-white/5 text-gray-400 p-3 rounded-xl hover:bg-gold hover:text-black transition-all flex-shrink-0">
                            <FiUploadCloud />
                            <input type="file" className="hidden" onChange={(e) => handleFileChange(e, imgField.field)} accept="image/*" />
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Color Variants Section */}
                  <div className="bg-white/[0.02] p-6 md:p-8 rounded-[30px] border border-white/5">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xs uppercase font-bold text-gold tracking-widest flex items-center gap-3">
                        <FiWind className="text-lg" /> Color Variants
                      </h3>
                      <button type="button" onClick={addColorVariant} className="text-[10px] bg-gold text-black px-4 py-2 rounded-xl hover:bg-white transition-colors font-bold tracking-widest shadow-lg shadow-gold/20">+ ADD COLOR</button>
                    </div>
                    
                    {!(newProduct.colors && newProduct.colors.length > 0) && (
                      <p className="text-gray-600 text-xs text-center py-4 italic border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">No color variants added yet.</p>
                    )}

                    <div className="space-y-4">
                      {(newProduct.colors || []).map((color, index) => (
                        <div key={index} className="flex flex-col sm:flex-row gap-3 items-center bg-black/40 p-4 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-white/20 transition-all">
                          <input 
                            className="w-full sm:w-1/3 bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:border-gold outline-none text-xs text-white transition-all" 
                            placeholder="Color Name (e.g. Cobalt Blue)" 
                            value={color.colorName} 
                            onChange={(e) => handleColorChange(index, 'colorName', e.target.value)} 
                          />
                          <div className="w-full sm:flex-grow flex gap-3 items-center">
                            <input 
                              className="flex-grow bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:border-gold outline-none text-xs text-white transition-all" 
                              placeholder="Image URL" 
                              value={color.imageUrl} 
                              onChange={(e) => handleColorChange(index, 'imageUrl', e.target.value)} 
                            />
                            <label className="cursor-pointer bg-white/5 text-gray-400 p-3 rounded-xl hover:bg-gold hover:text-black transition-all flex-shrink-0 border border-white/10 hover:border-gold">
                              <FiUploadCloud />
                              <input type="file" className="hidden" onChange={(e) => handleColorImageUpload(e, index)} accept="image/*" />
                            </label>
                            {color.imageUrl && <img src={color.imageUrl} className="w-10 h-10 rounded-xl object-cover border border-white/10 shadow-lg flex-shrink-0" alt="" />}
                          </div>
                          <button type="button" onClick={() => removeColorVariant(index)} className="absolute right-0 top-0 bottom-0 px-4 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all translate-x-full group-hover:translate-x-0 font-bold backdrop-blur-md">
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-4 border-t border-white/5 mt-auto flex-shrink-0">
                  <button type="button" onClick={() => { setShowAddForm(false); setEditId(null); setNewProduct({ name: '', price: '', category: 'Hookah Pot', img: '', img2: '', img3: '', img4: '', description: '', originalPrice: '', inStock: true, stockLabel: 'Out of Stock', colors: [] }); }} className="flex-1 bg-white/5 text-gray-300 py-4 rounded-2xl font-bold uppercase tracking-[0.2em] text-[12px] hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/30 transition-all border border-white/10">Close</button>
                  <button type="submit" className="flex-[2] bg-gold text-black py-4 rounded-2xl font-bold uppercase tracking-[0.3em] text-[12px] hover:bg-white transition-all shadow-[0_0_30px_rgba(212,175,55,0.2)] hover:shadow-[0_0_50px_rgba(255,255,255,0.4)] flex items-center justify-center gap-2">
                    <FiPackage size={18} /> {editId ? 'Save Changes' : 'Save Product'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default AdminProducts;
