import React from 'react';
import { Mail, ArrowRight, Lock, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LoginPage: React.FC = () => {
  const [step, setStep] = React.useState<'email' | 'otp'>('email');
  const [email, setEmail] = React.useState('');

  return (
    <div className="relative min-h-[60vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full glass-premium rounded-[3rem] p-10 shadow-2xl space-y-8 border-white/40"
      >
        <div className="text-center space-y-3">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 bg-accent/10 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner"
          >
            <Lock className="w-10 h-10 text-accent animate-floating" />
          </motion.div>
          
          <h2 className="text-4xl font-black text-primary tracking-tight">
            {step === 'email' ? 'Welcome Back' : 'Verify Identity'}
          </h2>
          <p className="text-text-muted font-medium">
            {step === 'email' 
              ? 'Enter your email to receive a secure login code.' 
              : `Password sent successfully to ${email}`}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {step === 'email' ? (
            <motion.div 
              key="email-step"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <label className="text-xs font-black text-primary uppercase tracking-widest px-1">Email Address</label>
                <div className="relative">
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="shobi@spttraders.com" 
                    className="w-full pl-12 pr-4 py-4 bg-white/50 border border-border/50 rounded-2xl focus:ring-2 focus:ring-accent outline-none transition-all font-medium text-primary shadow-sm"
                  />
                  <Mail className="absolute left-4 top-4.5 w-5 h-5 text-text-muted" />
                </div>
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setStep('otp')}
                className="w-full bg-primary text-white py-5 rounded-[2rem] font-black flex items-center justify-center space-x-3 hover:bg-primary-light transition-all shadow-xl shadow-primary/20 text-sm uppercase tracking-widest"
              >
                <span>Request OTP</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </motion.div>
          ) : (
            <motion.div 
              key="otp-step"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <label className="text-xs font-black text-primary uppercase tracking-widest text-center block">Enter 4-Digit Code</label>
                <div className="flex justify-between gap-4">
                  {[1,2,3,4].map(i => (
                    <input 
                      key={i}
                      type="text" 
                      maxLength={1}
                      className="w-16 h-20 text-center text-3xl font-black bg-white/50 border-2 border-border/50 rounded-2xl focus:border-accent focus:ring-0 outline-none transition-all text-primary shadow-lg focus:shadow-accent/10"
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-accent text-white py-5 rounded-[2rem] font-black flex items-center justify-center space-x-3 hover:bg-accent-light transition-all shadow-xl shadow-accent/20 text-sm uppercase tracking-widest"
                >
                  <ShieldCheck className="w-5 h-5" />
                  <span>Secure Login</span>
                </motion.button>
                
                <button 
                  onClick={() => setStep('email')}
                  className="w-full text-center text-xs font-black text-text-muted hover:text-accent transition-colors uppercase tracking-[0.2em]"
                >
                  Change Email Address
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="pt-8 border-t border-border/50 text-center">
          <p className="text-xs font-medium text-text-muted">
            By continuing, you agree to our <br />
            <span className="text-primary font-bold cursor-pointer hover:underline">Terms of Service</span> & <span className="text-primary font-bold cursor-pointer hover:underline">Privacy Policy</span>
          </p>
        </div>
      </motion.div>
      
      {/* Decorative Blur */}
      <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-accent/5 rounded-full blur-[120px]" />
    </div>
  );
};

export default LoginPage;
