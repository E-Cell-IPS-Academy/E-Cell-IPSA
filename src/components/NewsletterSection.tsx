import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle } from "lucide-react";

const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail("");
      setTimeout(() => setSubmitted(false), 4000);
    }
  };

  return (
    <section className="relative py-16 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent" />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative max-w-2xl mx-auto px-4 text-center"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-3">
          Stay in the Loop
        </h2>
        <p className="text-[var(--text-secondary)] mb-8">
          Subscribe to get updates on events, workshops, and startup
          opportunities.
        </p>

        <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="flex-1 px-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-purple-500/20 text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-purple-500/60 transition-colors"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold flex items-center gap-2 transition-colors"
          >
            {submitted ? (
              <>
                <CheckCircle size={18} />
                Done
              </>
            ) : (
              <>
                <Send size={18} />
                Subscribe
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </section>
  );
};

export default NewsletterSection;
