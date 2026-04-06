import React, { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import {
  Calendar,
  Users,
  MapPin,
  Clock,
  Trophy,
  Lightbulb,
  User,
  Tag,
  Loader,
} from "lucide-react";

// ─── Google Fonts ─────────────────────────────────────────────
// DISPLAY → "Instrument Serif"  — page h1, event titles
// LABEL   → "DM Mono"           — "OUR JOURNEY", category badge, meta info, tags
// BODY    → "Outfit" 300        — event descriptions, speaker names/titles
function useFonts() {
  useEffect(() => {
    if (document.getElementById("events-fonts")) return;
    const link = document.createElement("link");
    link.id = "events-fonts";
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Mono:wght@400&family=Outfit:wght@300;400&display=swap";
    document.head.appendChild(link);
  }, []);
}

const F = {
  display: "'Instrument Serif', Georgia, serif",
  mono: "'DM Mono', monospace",
  body: "'Outfit', sans-serif",
};

// Static data — unchanged from original
const staticEventsData = [
  {
    id: "induction-program-2024",
    title: "Induction Program",
    description:
      "Empowering first-year students with entrepreneurial insights, fostering innovation, and setting the stage for future startup leaders.",
    date: "2024-09-19",
    time: "10:00 AM",
    location: "IPS Academy Auditorium",
    status: "completed" as const,
    attendees: 250,
    maxAttendees: 300,
    category: "Workshop",
    tags: ["first-year", "entrepreneurship", "innovation", "induction"],
    speakers: [],
    image: "/gallery/1.jpg",
  },
  {
    id: "pitching-contest-2024",
    title: "Pitching Contest",
    description:
      "Organized a pitching competition to promote entrepreneurship at IPS Academy, providing early-stage startups with a platform to gain exposure and network with mentors.",
    date: "2024-10-04",
    time: "2:00 PM",
    location: "Central Hall, IPS Academy",
    status: "completed" as const,
    attendees: 120,
    maxAttendees: 150,
    category: "Competition",
    tags: ["pitching", "startups", "mentorship", "contest"],
    speakers: [],
    image: "/gallery/7.jpg",
  },
  {
    id: "ignitex-2024",
    title: "IgniteX",
    description:
      "IgniteX 2024: Let's Talk Entrepreneurship! An exciting event with insightful speaker sessions, open discussions, and surprises & rewards for participants.",
    date: "2024-12-03",
    time: "11:00 AM",
    location: "Main Seminar Hall",
    status: "completed" as const,
    attendees: 300,
    maxAttendees: 350,
    category: "Conference",
    tags: ["IgniteX", "speakers", "discussions", "networking"],
    speakers: [
      {
        name: "Guest Speaker 1",
        title: "CEO, TechInnovate",
        bio: "An experienced entrepreneur.",
      },
      {
        name: "Guest Speaker 2",
        title: "Founder, Creative Solutions",
        bio: "A leader in creative industries.",
      },
    ],
    image: "/gallery/2.jpg",
  },
];

interface Speaker {
  name: string;
  title: string;
  bio: string;
  linkedin?: string;
  twitter?: string;
  image?: string;
}
interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  attendees: number;
  maxAttendees: number;
  category: string;
  price?: number;
  image?: string;
  imagePublicId?: string;
  tags?: string[];
  requirements?: string[];
  agenda?: string[];
  speakers?: Speaker[];
}

interface FloatingElementProps {
  delay?: number;
  children: React.ReactNode;
}
const FloatingElement: React.FC<FloatingElementProps> = ({
  delay = 0,
  children,
}) => (
  <motion.div
    className="absolute opacity-20"
    animate={{ y: [-20, 20, -20], x: [-10, 10, -10], rotate: [0, 180, 360] }}
    transition={{ duration: 8, repeat: Infinity, delay, ease: "easeInOut" }}
  >
    {children}
  </motion.div>
);

const EventCard: React.FC<{
  event: Event;
  index: number;
  isInView: boolean;
}> = ({ event, index, isInView }) => {
  const getEventIcon = (cat: string) => {
    switch (cat.toLowerCase()) {
      case "competition":
        return Trophy;
      case "workshop":
        return Lightbulb;
      case "conference":
        return Users;
      case "networking":
        return User;
      default:
        return Calendar;
    }
  };
  const tags = event.tags ?? [];
  const speakers = event.speakers ?? [];

  const getEventColor = (cat: string) => {
    switch (cat.toLowerCase()) {
      case "competition":
        return "from-yellow-500 to-orange-500";
      case "workshop":
        return "from-blue-500 to-cyan-500";
      case "conference":
        return "from-purple-500 to-pink-500";
      case "networking":
        return "from-green-500 to-teal-500";
      default:
        return "from-indigo-500 to-purple-500";
    }
  };
  const getImageShape = (i: number) => {
    const s = [
      "polygon(0 0, 85% 0, 100% 15%, 100% 100%, 0 100%)",
      "polygon(0 0, 100% 0, 100% 85%, 85% 100%, 0 100%)",
      "polygon(15% 0, 100% 0, 100% 100%, 0 100%, 0 15%)",
      "polygon(0 0, 100% 0, 100% 100%, 15% 100%, 0 85%)",
      "ellipse(80% 60% at 50% 40%)",
      "polygon(0 20%, 100% 0, 100% 80%, 0 100%)",
    ];
    return s[i % s.length];
  };

  const IconComponent = getEventIcon(event.category);
  const colorGradient = getEventColor(event.category);
  const imageShape = getImageShape(index);
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ delay: index * 0.2, duration: 0.8 }}
      className="relative mb-16 last:mb-0"
    >
      <div className="absolute left-8 lg:left-1/2 lg:-translate-x-0.5 top-24 w-0.5 h-full bg-gradient-to-b from-white/20 via-white/10 to-transparent" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Content */}
        <motion.div
          className={`lg:col-span-7 space-y-6 ${isEven ? "lg:order-1" : "lg:order-2"}`}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-500">
            {/* Category badge — DM Mono */}
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4 bg-gradient-to-r ${colorGradient} text-white`}
              style={{
                fontFamily: F.mono,
                fontSize: "8px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              <IconComponent className="w-3 h-3" /> {event.category}
            </div>

            {/* Date & time — DM Mono */}
            <motion.div
              className="flex items-center gap-4 mb-4"
              style={{
                fontFamily: F.mono,
                fontSize: "9px",
                letterSpacing: "0.1em",
                color: "rgba(255,255,255,0.32)",
              }}
              whileHover={{ x: 5 }}
            >
              <span className="flex items-center gap-2">
                <Calendar className="w-3 h-3" />
                {new Date(event.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-3 h-3" />
                {event.time}
              </span>
            </motion.div>

            {/* Title — Instrument Serif */}
            <motion.h3
              style={{
                fontFamily: F.display,
                fontWeight: 400,
                fontSize: "clamp(1.4rem, 3vw, 2rem)",
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
                color: "rgba(255,255,255,0.88)",
                marginBottom: "0.75rem",
              }}
              whileHover={{ x: 10 }}
            >
              {event.title}
            </motion.h3>

            {/* Description — Outfit 300 */}
            <motion.p
              style={{
                fontFamily: F.body,
                fontWeight: 300,
                fontSize: "clamp(0.78rem, 1.3vw, 0.9rem)",
                lineHeight: 1.75,
                color: "rgba(255,255,255,0.40)",
                marginBottom: "1.25rem",
              }}
              whileHover={{ x: 5 }}
            >
              {event.description}
            </motion.p>

            {/* Details — DM Mono */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              <motion.div
                className="flex items-center gap-2"
                style={{
                  fontFamily: F.mono,
                  fontSize: "9px",
                  letterSpacing: "0.08em",
                  color: "rgba(255,255,255,0.32)",
                }}
                whileHover={{ x: 5, color: "#fff" }}
              >
                <MapPin className="w-3 h-3" />
                {event.location}
              </motion.div>
              <motion.div
                className="flex items-center gap-2"
                style={{
                  fontFamily: F.mono,
                  fontSize: "9px",
                  letterSpacing: "0.08em",
                  color: "rgba(255,255,255,0.32)",
                }}
                whileHover={{ x: 5, color: "#fff" }}
              >
                <Users className="w-3 h-3" />
                {event.attendees} attendees
              </motion.div>
            </div>

            {/* Tags — DM Mono */}
            {tags.length > 0 && (
              <motion.div
                className="flex flex-wrap gap-2 mb-5"
                whileHover={{ x: 5 }}
              >
                {tags.slice(0, 4).map((tag, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-white/10 rounded-full"
                    style={{
                      fontFamily: F.mono,
                      fontSize: "8px",
                      letterSpacing: "0.08em",
                      color: "rgba(255,255,255,0.40)",
                    }}
                  >
                    <Tag className="w-2.5 h-2.5" />
                    {tag}
                  </span>
                ))}
              </motion.div>
            )}

            {/* Speakers — Outfit 300 */}
            {speakers.length > 0 && (
              <motion.div whileHover={{ x: 5 }}>
                <p
                  style={{
                    fontFamily: F.mono,
                    fontSize: "8px",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.28)",
                    marginBottom: "0.75rem",
                  }}
                >
                  Speakers
                </p>
                <div className="flex flex-wrap gap-3">
                  {speakers.slice(0, 3).map((sp, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-lg"
                    >
                      <div
                        className={`w-7 h-7 bg-gradient-to-r ${colorGradient} rounded-full flex items-center justify-center`}
                      >
                        <User className="w-3 h-3 text-white" />
                      </div>
                      <div>
                        <p
                          style={{
                            fontFamily: F.body,
                            fontWeight: 400,
                            fontSize: "0.78rem",
                            color: "rgba(255,255,255,0.85)",
                          }}
                        >
                          {sp.name}
                        </p>
                        <p
                          style={{
                            fontFamily: F.mono,
                            fontSize: "8px",
                            letterSpacing: "0.05em",
                            color: "rgba(255,255,255,0.32)",
                          }}
                        >
                          {sp.title}
                        </p>
                      </div>
                    </div>
                  ))}
                  {speakers.length > 3 && (
                    <div
                      className="flex items-center px-3 py-2"
                      style={{
                        fontFamily: F.mono,
                        fontSize: "8px",
                        color: "rgba(255,255,255,0.28)",
                      }}
                    >
                      +{speakers.length - 3} more
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Image */}
        <motion.div
          className={`lg:col-span-5 relative ${isEven ? "lg:order-2" : "lg:order-1"}`}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative w-full h-96 rounded-3xl overflow-hidden">
            {event.image ? (
              <div className="relative w-full h-full">
                <div
                  className="w-full h-full relative overflow-hidden"
                  style={{ clipPath: imageShape }}
                >
                  <motion.img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover"
                    initial={{ scale: 1.1 }}
                    whileHover={{ scale: 1.2 }}
                    transition={{ duration: 0.5 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>
                <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-white/50" />
                <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-white/50" />
                <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-white/50" />
                <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-white/50" />
                <motion.div
                  className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/60 rounded-full"
                  animate={{ y: [-10, 10, -10], opacity: [0.3, 1, 0.3] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <motion.div
                  className="absolute top-3/4 right-1/4 w-1 h-1 bg-white/40 rounded-full"
                  animate={{ y: [10, -10, 10], opacity: [0.2, 0.8, 0.2] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                />
              </div>
            ) : (
              <div
                className={`w-full h-full bg-gradient-to-br ${colorGradient}/20 flex items-center justify-center relative overflow-hidden`}
                style={{ clipPath: imageShape }}
              >
                <motion.div
                  className={`w-24 h-24 bg-gradient-to-r ${colorGradient} rounded-full flex items-center justify-center`}
                  animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <IconComponent className="w-12 h-12 text-white" />
                </motion.div>
              </div>
            )}
            <motion.div
              className={`absolute top-1/2 ${isEven ? "-left-4" : "-right-4"} lg:left-1/2 lg:-translate-x-1/2 w-8 h-8 bg-gradient-to-r ${colorGradient} rounded-full border-4 border-black flex items-center justify-center z-10`}
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : { scale: 0 }}
              transition={{ delay: index * 0.2 + 0.5, duration: 0.5 }}
            >
              <motion.div
                className="w-2 h-2 bg-white rounded-full"
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const PastEventsPage: React.FC = () => {
  useFonts();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setEvents(staticEventsData);
      setLoading(false);
    }, 500);
  }, []);

  return (
    <div className="min-h-screen bg-black pt-20">
      {/* Background floating elements — unchanged */}
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

      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Label — DM Mono */}
            <motion.p
              style={{
                fontFamily: F.mono,
                fontSize: "9px",
                letterSpacing: "0.35em",
                textTransform: "uppercase",
                color: "#a78bfa",
              }}
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              OUR JOURNEY
            </motion.p>

            {/* H1 — Instrument Serif */}
            <motion.h1
              style={{
                fontFamily: F.display,
                fontWeight: 400,
                fontSize: "clamp(2.5rem, 8vw, 5rem)",
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
                color: "rgba(255,255,255,0.88)",
                marginBottom: "2rem",
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Past
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                Events
              </span>
            </motion.h1>

            {/* Sub — Outfit 300 */}
            <motion.p
              style={{
                fontFamily: F.body,
                fontWeight: 300,
                fontSize: "clamp(0.8rem, 1.5vw, 1rem)",
                lineHeight: 1.75,
                color: "rgba(255,255,255,0.40)",
                maxWidth: "46ch",
                margin: "0 auto",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
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
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="mb-4"
                >
                  <Loader className="w-8 h-8 text-purple-500" />
                </motion.div>
                <p
                  style={{
                    fontFamily: F.body,
                    fontWeight: 300,
                    fontSize: "0.78rem",
                    color: "rgba(255,255,255,0.35)",
                  }}
                >
                  Loading past events…
                </p>
              </div>
            ) : events.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Calendar className="w-16 h-16 text-gray-500 mb-4" />
                <h3
                  style={{
                    fontFamily: F.display,
                    fontWeight: 400,
                    fontSize: "1.1rem",
                    color: "rgba(255,255,255,0.85)",
                    marginBottom: "0.4rem",
                  }}
                >
                  No Past Events Found
                </h3>
                <p
                  style={{
                    fontFamily: F.body,
                    fontWeight: 300,
                    fontSize: "0.78rem",
                    color: "rgba(255,255,255,0.35)",
                  }}
                >
                  Check back later for updates on completed events.
                </p>
              </div>
            ) : (
              events.map((event, index) => (
                <EventCard
                  key={event.id}
                  event={event}
                  index={index}
                  isInView={isInView}
                />
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PastEventsPage;
