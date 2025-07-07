// Create /pages/PastEventsPage.tsx
import { useRef } from "react";
import type { ReactNode } from "react";
import { motion, useInView } from "framer-motion";
import { Calendar, Users, Trophy, Lightbulb } from "lucide-react";

const PastEventsPage = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const events = [
    {
      date: "19 September 2024",
      title: "Induction Program",
      description:
        "Empowering first-year students with entrepreneurial insights, fostering innovation, and setting the stage for future startup leaders.",
      icon: Users,
      color: "from-purple-500 to-blue-500",
      highlights: [
        "First-year orientation",
        "Entrepreneurial insights",
        "Innovation focus",
        "Future leaders",
      ],
    },
    {
      date: "4 October 2024",
      title: "Pitching Contest",
      description:
        "Organized a pitching competition to promote entrepreneurship at IPS Academy, providing early-stage startups with a platform to gain exposure and network with mentors.",
      icon: Trophy,
      color: "from-blue-500 to-cyan-500",
      highlights: [
        "Startup pitches",
        "Networking",
        "Mentor connections",
        "Early-stage focus",
      ],
    },
    {
      date: "3 December 2024",
      title: "IgniteX",
      description: "IgniteX 2024: Let's Talk Entrepreneurship!",
      icon: Lightbulb,
      color: "from-orange-500 to-red-500",
      highlights: [
        "💡 Speaker sessions",
        "🗣️ Open discussions",
        "🎁 Surprises & rewards",
      ],
    },
  ];

  // 3D Floating Elements
  interface FloatingElementProps {
    delay?: number;
    children: ReactNode;
  }

  const FloatingElement = ({ delay = 0, children }: FloatingElementProps) => {
    return (
      <motion.div
        className="absolute opacity-20"
        animate={{
          y: [-20, 20, -20],
          x: [-10, 10, -10],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          delay: delay,
          ease: "easeInOut",
        }}
      >
        {children}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-black pt-20">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <FloatingElement delay={0}>
          <div className="w-16 h-16 bg-purple-500/10 rounded-full top-20 left-10" />
        </FloatingElement>
        <FloatingElement delay={2}>
          <div className="w-12 h-12 bg-blue-500/10 rounded-lg top-40 right-20" />
        </FloatingElement>
        <FloatingElement delay={4}>
          <div className="w-20 h-20 bg-orange-500/10 rounded-full bottom-20 left-1/4" />
        </FloatingElement>
      </div>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-sm text-purple-400 tracking-[0.3em] uppercase font-light mb-8"
            >
              OUR JOURNEY
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-4xl md:text-5xl lg:text-7xl font-thin text-white leading-tight mb-8"
            >
              Past
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                Events
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-xl text-gray-300 leading-relaxed"
            >
              Discover the milestones of innovation and entrepreneurship that
              have shaped our community
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Events Timeline */}
      <section ref={sectionRef} className="relative py-20">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {events.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }
                }
                transition={{ delay: index * 0.3, duration: 0.8 }}
                className="relative mb-16 last:mb-0"
              >
                {/* Timeline Line */}
                {index !== events.length - 1 && (
                  <motion.div
                    className="absolute left-8 lg:left-1/2 top-24 w-0.5 h-32 bg-gradient-to-b from-white/20 to-transparent"
                    initial={{ height: 0 }}
                    animate={isInView ? { height: 128 } : { height: 0 }}
                    transition={{ delay: index * 0.3 + 0.5, duration: 1 }}
                  />
                )}

                <div
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${
                    index % 2 === 0 ? "" : "lg:grid-flow-col-dense"
                  }`}
                >
                  {/* Event Content */}
                  <motion.div
                    className={`space-y-6 ${
                      index % 2 === 0 ? "" : "lg:col-start-2"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-500">
                      {/* Date */}
                      <motion.div
                        className="flex items-center gap-2 text-sm text-gray-400 mb-4"
                        whileHover={{ x: 5 }}
                      >
                        <Calendar className="w-4 h-4" />
                        {event.date}
                      </motion.div>

                      {/* Title */}
                      <motion.h3
                        className="text-3xl md:text-4xl font-bold text-white mb-4"
                        whileHover={{ x: 10 }}
                      >
                        {event.title}
                      </motion.h3>

                      {/* Description */}
                      <motion.p
                        className="text-lg text-gray-300 leading-relaxed mb-6"
                        whileHover={{ x: 5 }}
                      >
                        {event.description}
                      </motion.p>

                      {/* Highlights */}
                      <motion.div className="space-y-3" whileHover={{ x: 5 }}>
                        {event.highlights.map((highlight, highlightIndex) => (
                          <motion.div
                            key={highlightIndex}
                            className="flex items-center gap-3 text-gray-400"
                            whileHover={{ x: 10, color: "#ffffff" }}
                            transition={{ duration: 0.2 }}
                          >
                            <div
                              className={`w-2 h-2 rounded-full bg-gradient-to-r ${event.color}`}
                            />
                            <span>{highlight}</span>
                          </motion.div>
                        ))}
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* Event Visual */}
                  <motion.div
                    className={`relative ${
                      index % 2 === 0 ? "" : "lg:col-start-1"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div
                      className={`relative w-full h-80 bg-gradient-to-br ${event.color}/20 rounded-3xl border border-white/10 flex items-center justify-center overflow-hidden`}
                    >
                      {/* Icon */}
                      <motion.div
                        className={`w-24 h-24 bg-gradient-to-r ${event.color} rounded-full flex items-center justify-center mb-4`}
                        animate={{
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, -5, 0],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <event.icon className="w-12 h-12 text-white" />
                      </motion.div>

                      {/* Floating particles */}
                      {[...Array(6)].map((_, i) => (
                        <motion.div
                          key={i}
                          className={`absolute w-2 h-2 bg-gradient-to-r ${event.color} rounded-full`}
                          style={{
                            left: `${20 + i * 15}%`,
                            top: `${30 + (i % 2) * 40}%`,
                          }}
                          animate={{
                            y: [-10, 10, -10],
                            opacity: [0.3, 1, 0.3],
                            scale: [0.8, 1.2, 0.8],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            delay: i * 0.5,
                            ease: "easeInOut",
                          }}
                        />
                      ))}

                      {/* Corner decorations */}
                      <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-white/20" />
                      <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-white/20" />
                      <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-white/20" />
                      <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-white/20" />
                    </div>

                    {/* Timeline dot */}
                    <motion.div
                      className={`absolute top-1/2 ${
                        index % 2 === 0 ? "-right-4" : "-left-4"
                      } lg:left-1/2 lg:-translate-x-1/2 w-8 h-8 bg-gradient-to-r ${
                        event.color
                      } rounded-full border-4 border-black flex items-center justify-center z-10`}
                      initial={{ scale: 0 }}
                      animate={isInView ? { scale: 1 } : { scale: 0 }}
                      transition={{ delay: index * 0.3 + 0.8, duration: 0.5 }}
                    >
                      <motion.div
                        className="w-2 h-2 bg-white rounded-full"
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [1, 0.5, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PastEventsPage;
