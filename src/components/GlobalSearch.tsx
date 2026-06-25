import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SearchItem {
  title: string;
  path: string;
  category: string;
}

const searchItems: SearchItem[] = [
  { title: "Home", path: "/", category: "Pages" },
  { title: "About", path: "/about", category: "Pages" },
  { title: "Team", path: "/team", category: "Pages" },
  { title: "Contact", path: "/contact", category: "Pages" },
  { title: "Gallery", path: "/gallery", category: "Pages" },
  { title: "Blog", path: "/blog", category: "Pages" },
  { title: "Past Events", path: "/past-events", category: "Events" },
  { title: "Startup of the Week", path: "/startup", category: "Pages" },
  { title: "Incubation Program", path: "/incubation", category: "Programs" },
  { title: "Mentorship", path: "/mentorship", category: "Programs" },
  { title: "Workshops", path: "/workshops", category: "Programs" },
  { title: "Competitions", path: "/competitions", category: "Programs" },
  { title: "Funding", path: "/funding", category: "Programs" },
  { title: "Resources", path: "/resources", category: "Resources" },
  { title: "FAQ", path: "/faq", category: "Resources" },
  { title: "Alumni", path: "/alumni", category: "Resources" },
  { title: "Privacy Policy", path: "/privacy", category: "Legal" },
  { title: "Terms of Service", path: "/terms", category: "Legal" },
  { title: "Code of Conduct", path: "/conduct", category: "Legal" },
];

const GlobalSearch: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const filtered = searchItems.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
    if (!isOpen) setQuery("");
  }, [isOpen]);

  const handleSelect = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-20 z-50 p-2.5 rounded-xl bg-[var(--bg-secondary)] border border-purple-500/20 hover:border-purple-500/50 transition-all group"
        aria-label="Search"
      >
        <Search
          size={18}
          className="text-[var(--text-secondary)] group-hover:text-purple-400 transition-colors"
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-[15vh]"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-lg mx-4 bg-[var(--bg-primary)] border border-purple-500/20 rounded-2xl shadow-2xl shadow-purple-500/10 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 px-4 py-3 border-b border-purple-500/10">
                <Search size={18} className="text-purple-400 shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search pages..."
                  className="flex-1 bg-transparent text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] outline-none text-sm"
                />
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg hover:bg-purple-500/10 transition-colors"
                >
                  <X size={16} className="text-[var(--text-secondary)]" />
                </button>
              </div>

              <div className="max-h-72 overflow-y-auto py-2">
                {filtered.length === 0 ? (
                  <p className="text-center text-[var(--text-secondary)] py-8 text-sm">
                    No results found
                  </p>
                ) : (
                  filtered.map((item) => (
                    <button
                      key={item.path}
                      onClick={() => handleSelect(item.path)}
                      className="w-full text-left px-4 py-2.5 hover:bg-purple-500/10 transition-colors flex items-center justify-between group"
                    >
                      <span className="text-sm text-[var(--text-primary)] group-hover:text-purple-400 transition-colors">
                        {item.title}
                      </span>
                      <span className="text-xs text-[var(--text-secondary)] px-2 py-0.5 rounded-full bg-purple-500/10">
                        {item.category}
                      </span>
                    </button>
                  ))
                )}
              </div>

              <div className="px-4 py-2 border-t border-purple-500/10 flex items-center justify-end gap-2">
                <kbd className="text-[10px] text-[var(--text-secondary)] px-1.5 py-0.5 rounded border border-purple-500/20 bg-purple-500/5">
                  ESC
                </kbd>
                <span className="text-[10px] text-[var(--text-secondary)]">
                  to close
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GlobalSearch;
