import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Lightbulb,
  Target,
  Globe,
  Users,
  Rocket,
  Brain,
  Award,
  Building,
  BookOpen,
} from "lucide-react";

// 3D Animation Components for Center Section
const FloatingCube = ({
  delay = 0,
  size = "w-16 h-16",
  color = "from-purple-500 to-blue-500",
}) => {
  return (
    <motion.div
      className={`${size} bg-gradient-to-br ${color} rounded-lg shadow-2xl`}
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
      animate={{
        rotateX: [0, 360],
        rotateY: [0, 360],
        z: [0, 50, 0],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        delay: delay,
        ease: "linear",
      }}
    />
  );
};

const FloatingSphere = ({ delay = 0, size = 60, color = "purple" }) => {
  return (
    <motion.div
      className="rounded-full shadow-2xl"
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3), ${
          color === "purple"
            ? "#8b5cf6"
            : color === "blue"
            ? "#3b82f6"
            : color === "green"
            ? "#10b981"
            : "#f59e0b"
        })`,
        boxShadow: `0 20px 40px rgba(${
          color === "purple"
            ? "139, 92, 246"
            : color === "blue"
            ? "59, 130, 246"
            : color === "green"
            ? "16, 185, 129"
            : "245, 158, 11"
        }, 0.3)`,
      }}
      animate={{
        y: [-20, 20, -20],
        x: [-10, 10, -10],
        rotateY: [0, 360],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        delay: delay,
        ease: "easeInOut",
      }}
    />
  );
};

const OrbitingElements = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <motion.div
        className="relative w-80 h-80"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        {/* Orbiting elements */}
        {[0, 72, 144, 216, 288].map((angle, i) => (
          <motion.div
            key={i}
            className="absolute w-6 h-6"
            style={{
              top: "50%",
              left: "50%",
              transformOrigin: "0 0",
              transform: `rotate(${angle}deg) translate(120px, -12px)`,
            }}
            animate={{
              scale: [0.8, 1.2, 0.8],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          >
            <div
              className={`w-full h-full rounded-full ${
                i === 0
                  ? "bg-purple-500"
                  : i === 1
                  ? "bg-blue-500"
                  : i === 2
                  ? "bg-green-500"
                  : i === 3
                  ? "bg-orange-500"
                  : "bg-pink-500"
              } shadow-lg`}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

// About Us Section (Left - with image placeholder)
const AboutSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  return (
    <section
      ref={sectionRef}
      className="relative py-20 bg-black overflow-hidden"
    >
      <div className="container mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 1 }}
            className="space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.2 }}
              className="text-sm text-purple-400 tracking-[0.3em] uppercase font-light"
            >
              ABOUT US
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-4xl md:text-5xl lg:text-6xl font-thin text-white leading-tight"
            >
              Nurturing
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                Innovation
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.5 }}
              className="text-lg text-gray-300 leading-relaxed"
            >
              Entrepreneurship Cell (E-Cell) is a non-profit organisation run by
              students of IPS Academy, Indore. We create awareness among the
              students about Entrepreneurship through our various programs like
              workshops, speaker sessions and other such events.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.6 }}
              className="text-lg text-gray-300 leading-relaxed"
            >
              To create a thriving entrepreneurial ecosystem that nurtures
              innovation and empowers the next generation of business leaders.
              To provide comprehensive support, resources, and mentorship to
              aspiring entrepreneurs, helping them transform their ideas into
              successful ventures.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.8 }}
              className="flex flex-wrap gap-4"
            >
              {[
                { icon: Users, text: "Student-Led" },
                { icon: BookOpen, text: "Educational" },
                { icon: Building, text: "Non-Profit" },
                { icon: Award, text: "Excellence" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10"
                >
                  <item.icon className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-gray-300">{item.text}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Image Placeholder */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative"
          >
            <div className="relative w-full h-96 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-3xl border border-white/10 flex items-center justify-center">
              <div className="text-center">
                <Building className="w-16 h-16 text-white/30 mx-auto mb-4" />
                <p className="text-white/50">About Us Image</p>
                <p className="text-white/30 text-sm">Replace with your image</p>
              </div>
              {/* Decorative elements */}
              <div className="absolute top-4 right-4 w-8 h-8 bg-purple-500/20 rounded-full" />
              <div className="absolute bottom-4 left-4 w-6 h-6 bg-blue-500/20 rounded-full" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Mission Section (Center - with 3D animations)
const MissionSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  return (
    <section
      ref={sectionRef}
      className="relative py-20 bg-gradient-to-br from-gray-900 via-black to-purple-900/20 overflow-hidden"
    >
      {/* 3D Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10">
          <FloatingCube
            delay={0}
            size="w-12 h-12"
            color="from-purple-500 to-pink-500"
          />
        </div>
        <div className="absolute top-40 right-20">
          <FloatingSphere delay={1} size={40} color="blue" />
        </div>
        <div className="absolute bottom-20 left-1/4">
          <FloatingCube
            delay={2}
            size="w-8 h-8"
            color="from-green-500 to-emerald-500"
          />
        </div>
        <div className="absolute top-60 right-1/3">
          <FloatingSphere delay={1.5} size={30} color="orange" />
        </div>
        <OrbitingElements />
      </div>

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.2 }}
            className="text-sm text-blue-400 tracking-[0.3em] uppercase font-light mb-8"
          >
            OUR MISSION
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-4xl md:text-5xl lg:text-6xl font-thin text-white leading-tight mb-8"
          >
            Igniting
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Creativity
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.5 }}
            className="text-xl text-gray-300 leading-relaxed mb-12"
          >
            Our mission at the Entrepreneurship Cell is to ignite creativity and
            foster an entrepreneurial spirit by providing exceptional
            mentorship, resources, and opportunities for students to turn their
            ideas into impactful ventures.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.6 }}
            className="text-lg text-gray-400 leading-relaxed mb-16"
          >
            In our one-year tenure, we are committed to guide 100+ students and
            supporting 25+ startups to transform their ideas into reality. We
            are dedicated to organizing innovative workshops, building a
            collaborative network, and creating a thriving startup ecosystem.
          </motion.p>

          {/* Mission Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: Users,
                number: "100+",
                text: "Students Guided",
                color: "from-blue-500 to-cyan-500",
              },
              {
                icon: Rocket,
                number: "25+",
                text: "Startups Supported",
                color: "from-purple-500 to-pink-500",
              },
              {
                icon: Target,
                number: "∞",
                text: "Impact Created",
                color: "from-green-500 to-emerald-500",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={
                  isInView
                    ? { opacity: 1, scale: 1 }
                    : { opacity: 0, scale: 0.8 }
                }
                transition={{ delay: 0.9 + index * 0.1 }}
                className="relative group"
              >
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-2">
                  <div
                    className={`w-16 h-16 bg-gradient-to-r ${item.color} rounded-full flex items-center justify-center mx-auto mb-4`}
                  >
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-2">
                    {item.number}
                  </h3>
                  <p className="text-gray-400">{item.text}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Vision Section (Right - with image placeholder)
const VisionSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  const visionPoints = [
    {
      icon: Lightbulb,
      title: "Innovation Hub",
      description:
        "Nurturing creative ideas and fostering innovative solutions",
    },
    {
      icon: Brain,
      title: "Entrepreneurial Mindset",
      description:
        "Developing leaders driven by creativity and sustainable growth",
    },
    {
      icon: Globe,
      title: "Global Impact",
      description: "Making meaningful contributions to society and economy",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative py-20 bg-black overflow-hidden"
    >
      <div className="container mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Image Placeholder */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 1 }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative w-full h-96 bg-gradient-to-br from-green-500/20 to-purple-500/20 rounded-3xl border border-white/10 flex items-center justify-center">
              <div className="text-center">
                <Globe className="w-16 h-16 text-white/30 mx-auto mb-4" />
                <p className="text-white/50">Vision Image</p>
                <p className="text-white/30 text-sm">Replace with your image</p>
              </div>
              {/* Decorative elements */}
              <div className="absolute top-4 left-4 w-8 h-8 bg-green-500/20 rounded-full" />
              <div className="absolute bottom-4 right-4 w-6 h-6 bg-purple-500/20 rounded-full" />
            </div>
          </motion.div>

          {/* Right Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="space-y-8 order-1 lg:order-2"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.2 }}
              className="text-sm text-green-400 tracking-[0.3em] uppercase font-light"
            >
              OUR VISION
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-4xl md:text-5xl lg:text-6xl font-thin text-white leading-tight"
            >
              Empowering
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-purple-400">
                Leaders
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.5 }}
              className="text-lg text-gray-300 leading-relaxed"
            >
              The Entrepreneurship Cell strives to build a vibrant platform that
              nurtures innovation, fosters an entrepreneurial mindset, and
              empowers students to turn their ideas into impactful ventures.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.6 }}
              className="text-lg text-gray-300 leading-relaxed"
            >
              Through mentorship, skill development, and a collaborative
              community, we aim to develop leaders who are driven by creativity,
              social responsibility, and a commitment to sustainable growth.
            </motion.p>

            {/* Vision Points */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ delay: 0.8 }}
              className="space-y-6"
            >
              {visionPoints.map((point, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 30 }}
                  animate={
                    isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }
                  }
                  transition={{ delay: 0.9 + index * 0.1 }}
                  className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300"
                >
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      index === 0
                        ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                        : index === 1
                        ? "bg-gradient-to-r from-purple-500 to-pink-500"
                        : "bg-gradient-to-r from-green-500 to-emerald-500"
                    }`}
                  >
                    <point.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {point.title}
                    </h3>
                    <p className="text-gray-400">{point.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Main Component
const ECellSections = () => {
  return (
    <div className="min-h-screen bg-black">
      <AboutSection />
      <MissionSection />
      <VisionSection />
    </div>
  );
};

export default ECellSections;
