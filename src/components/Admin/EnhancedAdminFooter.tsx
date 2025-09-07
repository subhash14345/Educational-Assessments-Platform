import React, { useState } from 'react';
import { Send, Mail, Phone, MapPin, CheckCircle, AlertCircle, Loader, Twitter, Linkedin, Github, MessageCircle } from 'lucide-react';

const EnhancedAdminFooter: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Placeholder submit logic
      console.log('Form submitted:', formData);
      
      setSubmitStatus('success');
      
      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          message: '',
        });
        setSubmitStatus('idle');
      }, 3000);
      
    } catch (err) {
      console.error('Error submitting form:', err);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 mt-12 py-12 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_rgba(255,255,255,0.1)_1px,_transparent_0)] bg-[length:20px_20px]"></div>
      
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Get In Touch
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-4 group">
                <div className="p-3 bg-blue-600/20 rounded-lg group-hover:bg-blue-600/30 transition-all duration-300 group-hover:scale-110">
                  <Mail className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-gray-300 text-sm">Email</p>
                  <p className="text-white font-medium">support@adminportal.com</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 group">
                <div className="p-3 bg-green-600/20 rounded-lg group-hover:bg-green-600/30 transition-all duration-300 group-hover:scale-110">
                  <Phone className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <p className="text-gray-300 text-sm">Phone</p>
                  <p className="text-white font-medium">+1234567890</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 group">
                <div className="p-3 bg-purple-600/20 rounded-lg group-hover:bg-purple-600/30 transition-all duration-300 group-hover:scale-110">
                  <MapPin className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-gray-300 text-sm">Address</p>
                  <p className="text-white font-medium">123 Admin Street, Tech City</p>
                </div>
              </div>
            </div>
            
            {/* Social Links */}
            <div className="pt-6">
              <p className="text-gray-400 mb-4">Follow us on</p>
              <div className="flex space-x-4">
                <div
                  className="p-3 bg-white/10 rounded-lg hover:bg-blue-500/30 transition-all duration-300 hover:scale-110 cursor-pointer"
                  title="Twitter"
                >
                  <Twitter className="h-5 w-5 text-gray-300 hover:text-blue-400" />
                </div>
                <div
                  className="p-3 bg-white/10 rounded-lg hover:bg-blue-600/30 transition-all duration-300 hover:scale-110 cursor-pointer"
                  title="LinkedIn"
                >
                  <Linkedin className="h-5 w-5 text-gray-300 hover:text-blue-600" />
                </div>
                <div
                  className="p-3 bg-white/10 rounded-lg hover:bg-gray-700/30 transition-all duration-300 hover:scale-110 cursor-pointer"
                  title="GitHub"
                >
                  <Github className="h-5 w-5 text-gray-300 hover:text-white" />
                </div>
                <div
                  className="p-3 bg-white/10 rounded-lg hover:bg-purple-500/30 transition-all duration-300 hover:scale-110 cursor-pointer"
                  title="Discord"
                >
                  <MessageCircle className="h-5 w-5 text-gray-300 hover:text-purple-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Send className="h-6 w-6 mr-3 text-blue-400" />
              Send us a Message
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-gray-300 font-medium mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full bg-white/5 border ${
                    errors.name ? 'border-red-400' : 'border-gray-600'
                  } rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                  placeholder="Enter your name"
                />
                {errors.name && (
                  <p className="text-red-400 text-sm mt-1 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-gray-300 font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full bg-white/5 border ${
                    errors.email ? 'border-red-400' : 'border-gray-600'
                  } rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="text-red-400 text-sm mt-1 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="message" className="block text-gray-300 font-medium mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className={`w-full bg-white/5 border ${
                    errors.message ? 'border-red-400' : 'border-gray-600'
                  } rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none`}
                  placeholder="Type your message here..."
                />
                {errors.message && (
                  <p className="text-red-400 text-sm mt-1 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader className="h-5 w-5 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : submitStatus === 'success' ? (
                  <>
                    <CheckCircle className="h-5 w-5" />
                    <span>Message Sent!</span>
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    <span>Send Message</span>
                  </>
                )}
              </button>

              {submitStatus === 'error' && (
                <div className="bg-red-400/20 border border-red-400/30 rounded-lg p-4 text-red-200 flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5" />
                  <span>Failed to send message. Please try again.</span>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-white/20 mt-12 pt-8 text-center">
          <p className="text-gray-400">
            © 2025 Admin Portal. Built with ❤️ for better education management.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default EnhancedAdminFooter;
