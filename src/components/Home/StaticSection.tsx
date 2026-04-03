import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
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
import { useTheme } from "../../context/ThemeContext";
import {
  RocketLaunchIllustration,
  IdeaBulbIllustration,
  InnovationIllustration,
} from "../illustrations/StartupIllustrations";

// 3D Animation Components
const FloatingCube = ({
  delay = 0,
  size = "w-16 h-16",
  color = "from-purple-500 to-blue-500",
}) => (
  <motion.div
    className={`${size} bg-gradient-to-br ${color} rounded-lg shadow-2xl`}
    style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
    animate={{ rotateX: [0, 360], rotateY: [0, 360], z: [0, 50, 0] }}
    transition={{ duration: 8, repeat: Infinity, delay, ease: "linear" }}
  />
);

const FloatingSphere = ({ delay = 0, size = 60, color = "purple" }) => (
  <motion.div
    className="rounded-full shadow-2xl"
    style={{
      width: size,
      height: size,
      background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3), ${
        color === "purple" ? "#8b5cf6" : color === "blue" ? "#3b82f6" : color === "green" ? "#10b981" : "#f59e0b"
      })`,
      boxShadow: `0 20px 40px rgba(${
        color === "purple" ? "139, 92, 246" : color === "blue" ? "59, 130, 246" : color === "green" ? "16, 185, 129" : "245, 158, 11"
      }, 0.3)`,
    }}
    animate={{ y: [-20, 20, -20], x: [-10, 10, -10], rotateY: [0, 360] }}
    transition={{ duration: 6, repeat: Infinity, delay, ease: "easeInOut" }}
  />
);

const OrbitingElements = () => (
  <div className="absolute inset-0 flex items-center justify-center">
    <motion.div
      className="relative w-80 h-80"
      animate={{ rotate: 360 }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
    >
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
          animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
        >
          <div
            className={`w-full h-full rounded-full shadow-lg ${
              ["bg-purple-500", "bg-blue-500", "bg-green-500", "bg-orange-500", "bg-pink-500"][i]
            }`}
          />
        </motion.div>
      ))}
    </motion.div>
  </div>
);

// About Section with Parallax and Illustration
const AboutSection = () => {
  const { isDark } = useTheme();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <section ref={sectionRef} className={`relative py-20 ${isDark ? "bg-black" : "bg-white"} overflow-hidden`}>
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
              className={`text-xs tracking-[0.3em] uppercase font-light ${isDark ? "text-purple-400" : "text-purple-600"}`}
            >
              ABOUT US
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className={`text-3xl md:text-4xl lg:text-5xl font-thin ${isDark ? "text-white" : "text-gray-900"} leading-tight`}
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
              className={`text-sm font-light ${isDark ? "text-gray-300" : "text-gray-600"} leading-relaxed`}
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
              className={`text-sm font-light ${isDark ? "text-gray-300" : "text-gray-600"} leading-relaxed`}
            >
              To create a thriving entrepreneurial ecosystem that nurtures
              innovation and empowers the next generation of business leaders.
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
                <motion.div
                  key={index}
                  className={`flex items-center gap-2 px-4 py-2 ${isDark ? "bg-white/5" : "bg-black/5"} rounded-full border ${isDark ? "border-white/10" : "border-gray-200"} ${isDark ? "hover:bg-white/10" : "hover:bg-black/10"} transition-all duration-300`}
                  whileHover={{ scale: 1.05, y: -2 }}
                >
                  <item.icon className={`w-4 h-4 ${isDark ? "text-purple-400" : "text-purple-600"}`} />
                  <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>{item.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right - Illustration with Parallax */}
          <motion.div
            style={{ y, opacity }}
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative flex items-center justify-center"
          >
            <div className="relative w-full max-w-md">
              <IdeaBulbIllustration className="w-full h-auto" />
              {/* Glow effect behind illustration */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-3xl -z-10 scale-75" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Mission Section with 3D Elements
const MissionSection = () => {
  const { isDark } = useTheme();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);

  return (
    <section
      ref={sectionRef}
      className={`relative py-20 ${isDark ? "bg-gradient-to-br from-gray-900 via-black to-purple-900/20" : "bg-gradient-to-br from-gray-50 via-white to-purple-50"} overflow-hidden`}
    >
      {/* 3D Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10">
          <FloatingCube delay={0} size="w-12 h-12" color="from-purple-500 to-pink-500" />
        </div>
        <div className="absolute top-40 right-20">
          <FloatingSphere delay={1} size={40} color="blue" />
        </div>
        <div className="absolute bottom-20 left-1/4">
          <FloatingCube delay={2} size="w-8 h-8" color="from-green-500 to-emerald-500" />
        </div>
        <div className="absolute top-60 right-1/3">
          <FloatingSphere delay={1.5} size={30} color="orange" />
        </div>
        <OrbitingElements />
      </div>

      <motion.div style={{ scale }} className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.2 }}
            className={`text-xs tracking-[0.3em] uppercase font-light mb-8 ${isDark ? "text-blue-400" : "text-blue-600"}`}
          >
            OUR MISSION
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className={`text-3xl md:text-4xl lg:text-5xl font-thin ${isDark ? "text-white" : "text-gray-900"} leading-tight mb-8`}
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
            className={`text-lg md:text-xl font-light ${isDark ? "text-gray-300" : "text-gray-600"} leading-relaxed mb-12`}
          >
            Our mission at the Entrepreneurship Cell is to ignite creativity and
            foster an entrepreneurial spirit by providing exceptional mentorship,
            resources, and opportunities for students to turn their ideas into
            impactful ventures.
          </motion.p>

          {/* Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="max-w-xs mx-auto mb-16"
          >
            <InnovationIllustration className="w-full h-auto" />
          </motion.div>

          {/* Mission Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              { icon: Users, number: "100+", text: "Students Guided", color: "from-blue-500 to-cyan-500" },
              { icon: Rocket, number: "25+", text: "Startups Supported", color: "from-purple-500 to-pink-500" },
              { icon: Target, number: "∞", text: "Impact Created", color: "from-green-500 to-emerald-500" },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                className="relative group"
                whileHover={{ y: -8 }}
              >
                <div className={`${isDark ? "bg-white/5" : "bg-black/5"} backdrop-blur-sm rounded-2xl p-8 border ${isDark ? "border-white/10" : "border-gray-200"} ${isDark ? "hover:bg-white/10" : "hover:bg-black/10"} transition-all duration-300`}>
                  <div className={`w-16 h-16 bg-gradient-to-r ${item.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className={`text-3xl font-thin ${isDark ? "text-white" : "text-gray-900"} mb-2`}>{item.number}</h3>
                  <p className={`${isDark ? "text-gray-400" : "text-gray-500"}`}>{item.text}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

// Vision Section with Parallax
const VisionSection = () => {
  const { isDark } = useTheme();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [80, -80]);

  const visionPoints = [
    { icon: Lightbulb, title: "Innovation Hub", description: "Nurturing creative ideas and fostering innovative solutions" },
    { icon: Brain, title: "Entrepreneurial Mindset", description: "Developing leaders driven by creativity and sustainable growth" },
    { icon: Globe, title: "Global Impact", description: "Making meaningful contributions to society and economy" },
  ];

  return (
    <section ref={sectionRef} className="relative py-20 bg-black overflow-hidden">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left - Illustration with Parallax */}
          <motion.div
            style={{ y }}
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 1 }}
            className="relative order-2 lg:order-1 flex items-center justify-center"
          >
            <div className="relative w-full max-w-md">
              <RocketLaunchIllustration className="w-full h-auto" />
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-purple-500/10 blur-3xl -z-10 scale-75" />
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
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300"
                  whileHover={{ x: 8, scale: 1.02 }}
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
                    <h3 className="text-xl font-semibold text-white mb-2">{point.title}</h3>
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
const ECellSections = () => (
  <div className="min-h-screen bg-black">
    <AboutSection />
    <MissionSection />
    <VisionSection />
  </div>
);

export default ECellSections;
