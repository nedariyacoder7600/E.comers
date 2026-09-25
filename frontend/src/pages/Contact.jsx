import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiPhone, FiUser, FiMessageSquare, FiArrowRight, FiCheck, FiMapPin, FiCopy, FiClock, FiShield } from 'react-icons/fi';
import axios from 'axios';
import { toast } from 'react-toastify';

const Contact = () => {
  const [formState, setFormState] = useState('idle');
  const [copiedField, setCopiedField] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'General Inquiry',
    message: '',
    saveInfo: false
  });

  const categories = [
    { label: 'General Inquiry', icon: '💬' },
    { label: 'Order Status', icon: '📦' },
    { label: 'VIP Concierge', icon: '👑' },
    { label: 'Press & Media', icon: '📰' }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCopy = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    toast.info(`Copied ${fieldName} to clipboard!`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormState('sending');

    try {
      const response = await axios.post('/api/contact', formData);
      if (response.data.success) {
        setFormState('sent');
        toast.success("Message sent successfully!");
      } else {
        setFormState('idle');
        toast.error("Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error('Submission error:', error);
      setFormState('idle');
      toast.error(error.response?.data?.message || "Failed to send message. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-gray-800 font-sans flex flex-col justify-center items-center py-12 px-4 relative overflow-hidden">
      
      {/* AMBIENT BACKDROP GLOW */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-teal-200/30 via-emerald-100/40 to-sky-200/30 blur-[130px] rounded-full pointer-events-none" />

      {/* CONTAINER */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-lg bg-white/95 backdrop-blur-md rounded-3xl border border-gray-100 shadow-2xl shadow-gray-200/80 p-6 md:p-8 flex flex-col max-h-[580px] relative z-10"
      >
        
        <div className="overflow-y-auto pr-2 flex-1 scrollbar-thin scrollbar-thumb-gray-200 hover:scrollbar-thumb-[#00897b]/40 scrollbar-track-transparent space-y-5">
          <AnimatePresence mode="wait">
            {formState !== 'sent' ? (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex flex-col items-center mb-4">
                  <div className="w-13 h-13 bg-gradient-to-tr from-[#00796b] to-[#00897b] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#00897b]/20 mb-3 ring-4 ring-[#00897b]/10">
                    <FiMail className="w-6 h-6" />
                  </div>
                  
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-[10px] font-semibold text-[#00897b] tracking-wider uppercase mb-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    24/7 Active Concierge
                  </span>

                  <h2 className="text-2xl font-bold text-gray-900 text-center tracking-tight">
                    Contact Us
                  </h2>
                  <p className="text-xs text-gray-500 text-center font-normal mt-0.5">
                    Send us a message and our team will get back to you shortly
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                      INQUIRY CATEGORY <span className="text-emerald-600">*</span>
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {categories.map((cat) => (
                        <button
                          key={cat.label}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, category: cat.label }))}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                            formData.category === cat.label
                              ? 'bg-[#00897b] text-white shadow-sm font-semibold'
                              : 'bg-gray-100/80 text-gray-600 hover:bg-gray-200/80'
                          }`}
                        >
                          <span>{cat.icon}</span>
                          <span>{cat.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                      FULL NAME <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        required
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter full name"
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50/70 focus:bg-white border border-gray-200/90 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#00897b] focus:ring-2 focus:ring-[#00897b]/15 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                      EMAIL ADDRESS <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        required
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="name@example.com"
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50/70 focus:bg-white border border-gray-200/90 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#00897b] focus:ring-2 focus:ring-[#00897b]/15 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                      PHONE NUMBER <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        required
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Enter 10-digit phone number"
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50/70 focus:bg-white border border-gray-200/90 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#00897b] focus:ring-2 focus:ring-[#00897b]/15 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                        YOUR MESSAGE <span className="text-red-500">*</span>
                      </label>
                      <span className="text-[10px] text-gray-400 font-mono">
                        {formData.message.length} / 500
                      </span>
                    </div>
                    <div className="relative">
                      <FiMessageSquare className="absolute left-3.5 top-3.5 text-gray-400 w-4 h-4" />
                      <textarea
                        required
                        maxLength={500}
                        name="message"
                        rows="3"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Type your message here..."
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50/70 focus:bg-white border border-gray-200/90 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#00897b] focus:ring-2 focus:ring-[#00897b]/15 transition-all resize-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1 pb-1">
                    <input
                      type="checkbox"
                      id="saveInfo"
                      name="saveInfo"
                      checked={formData.saveInfo}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-[#00897b] border-gray-300 rounded focus:ring-[#00897b] cursor-pointer"
                    />
                    <label htmlFor="saveInfo" className="text-xs text-gray-600 font-medium cursor-pointer select-none">
                      Remember my info on this browser
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={formState !== 'idle'}
                    className="w-full bg-gradient-to-r from-[#00796b] via-[#00897b] to-[#009688] hover:opacity-95 text-white font-semibold text-sm py-3.5 rounded-xl shadow-md shadow-[#00897b]/20 hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {formState === 'sending' ? (
                      <>
                        <span>Sending Message...</span>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      </>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <FiArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 pt-1">
                    <FiShield className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Your information is encrypted & secure</span>
                  </div>

                </form>
              </motion.div>
            ) : (

              /* SUCCESS STATE */
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10 px-4 flex flex-col items-center"
              >
                <div className="w-16 h-16 bg-emerald-100 text-[#00897b] rounded-full flex items-center justify-center mb-4 text-3xl shadow-inner">
                  <FiCheck className="w-8 h-8" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                <p className="text-xs text-gray-500 max-w-xs mx-auto mb-6 leading-relaxed">
                  Thank you, <span className="font-semibold text-gray-700">{formData.name}</span>. We've received your <span className="text-[#00897b] font-medium">{formData.category}</span> inquiry and will respond to <span className="font-semibold text-gray-700">{formData.email}</span> shortly.
                </p>

                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 text-xs font-medium mb-6">
                  <FiClock className="w-3.5 h-3.5 text-[#00897b]" />
                  <span>Est. response time: &lt; 2 hours</span>
                </div>

                <button
                  onClick={() => {
                    setFormState('idle');
                    setFormData({ name: '', email: '', phone: '', category: 'General Inquiry', message: '', saveInfo: false });
                  }}
                  className="text-xs font-semibold text-[#00897b] hover:text-[#00796b] hover:underline transition-all cursor-pointer flex items-center gap-1"
                >
                  <span>Send another message</span>
                  <FiArrowRight className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* QUICK CONTACT STRIP */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs z-10">
        <button
          onClick={() => handleCopy('support@luxehookah.com', 'Email')}
          className="bg-white/90 hover:bg-white border border-gray-200/80 px-3.5 py-2 rounded-xl text-gray-600 hover:text-gray-900 transition-all flex items-center gap-2 shadow-sm cursor-pointer"
        >
          <FiMail className="text-[#00897b]" />
          <span>support@luxehookah.com</span>
          <FiCopy className={`w-3.5 h-3.5 ${copiedField === 'Email' ? 'text-emerald-600' : 'text-gray-400'}`} />
        </button>

        <button
          onClick={() => handleCopy('+1 (800) 555-LUXE', 'Phone Number')}
          className="bg-white/90 hover:bg-white border border-gray-200/80 px-3.5 py-2 rounded-xl text-gray-600 hover:text-gray-900 transition-all flex items-center gap-2 shadow-sm cursor-pointer"
        >
          <FiPhone className="text-[#00897b]" />
          <span>+1 (800) 555-LUXE</span>
          <FiCopy className={`w-3.5 h-3.5 ${copiedField === 'Phone Number' ? 'text-emerald-600' : 'text-gray-400'}`} />
        </button>

        <div className="bg-white/90 border border-gray-200/80 px-3.5 py-2 rounded-xl text-gray-600 flex items-center gap-2 shadow-sm">
          <FiMapPin className="text-[#00897b]" />
          <span>Beverly Hills, CA</span>
        </div>
      </div>

    </div>
  );
};

export default Contact;
