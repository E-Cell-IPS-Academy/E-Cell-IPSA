import React, { useState, useEffect, useRef } from "react";
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

// Updated static events data with actual image URLs
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
    image:
      "/gallery/1.jpg",
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
    image:
      "/gallery/7.jpg",
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
    image:
      "/gallery/2.jpg",
  },
];

// Types remain the same
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

// Floating Elements Component remains the same
interface FloatingElementProps {
  delay?: number;
  children: React.ReactNode;
}

const FloatingElement: React.FC<FloatingElementProps> = ({
  delay = 0,
  children,
}) => {
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

// Updated Event Card Component with custom shaped images
const EventCard: React.FC<{
  event: Event;
  index: number;
  isInView: boolean;
}> = ({ event, index, isInView }) => {
  const getEventIcon = (category: string) => {
    switch (category.toLowerCase()) {
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

  const getEventColor = (category: string) => {
    switch (category.toLowerCase()) {
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

  // Different clip-path shapes for variety
  const getImageShape = (index: number) => {
    const shapes = [
      "polygon(0 0, 85% 0, 100% 15%, 100% 100%, 0 100%)", // Cut top-right corner
      "polygon(0 0, 100% 0, 100% 85%, 85% 100%, 0 100%)", // Cut bottom-right corner
      "polygon(15% 0, 100% 0, 100% 100%, 0 100%, 0 15%)", // Cut top-left corner
      "polygon(0 0, 100% 0, 100% 100%, 15% 100%, 0 85%)", // Cut bottom-left corner
      "ellipse(80% 60% at 50% 40%)", // Oval top
      "polygon(0 20%, 100% 0, 100% 80%, 0 100%)", // Diagonal cuts
    ];
    return shapes[index % shapes.length];
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
      {/* Timeline Line */}
      <div className="absolute left-8 lg:left-1/2 lg:-translate-x-0.5 top-24 w-0.5 h-full bg-gradient-to-b from-white/20 via-white/10 to-transparent" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Event Content */}
        <motion.div
          className={`lg:col-span-7 space-y-6 ${
            isEven ? "lg:order-1" : "lg:order-2"
          }`}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-500">
            {/* Category Badge */}
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-4 bg-gradient-to-r ${colorGradient} text-white`}
            >
              <IconComponent className="w-3 h-3" />
              {event.category}
            </div>

            {/* Date and Time */}
            <motion.div
              className="flex items-center gap-4 text-sm text-gray-400 mb-4"
              whileHover={{ x: 5 }}
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date(event.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {event.time}
              </div>
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

            {/* Event Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <motion.div
                className="flex items-center gap-2 text-gray-400"
                whileHover={{ x: 5, color: "#ffffff" }}
              >
                <MapPin className="w-4 h-4" />
                <span>{event.location}</span>
              </motion.div>
              <motion.div
                className="flex items-center gap-2 text-gray-400"
                whileHover={{ x: 5, color: "#ffffff" }}
              >
                <Users className="w-4 h-4" />
                <span>{event.attendees} attendees</span>
              </motion.div>
            </div>

            {/* Tags */}
            {event.tags && event.tags.length > 0 && (
              <motion.div
                className="flex flex-wrap gap-2 mb-6"
                whileHover={{ x: 5 }}
              >
                {event.tags.slice(0, 4).map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-white/10 text-gray-300 rounded-full text-xs"
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </motion.div>
            )}

            {/* Speakers */}
            {event.speakers && event.speakers.length > 0 && (
              <motion.div whileHover={{ x: 5 }}>
                <h4 className="text-sm font-medium text-gray-400 mb-3">
                  Speakers
                </h4>
                <div className="flex flex-wrap gap-3">
                  {event.speakers.slice(0, 3).map((speaker, speakerIndex) => (
                    <div
                      key={speakerIndex}
                      className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-lg"
                    >
                      <div
                        className={`w-8 h-8 bg-gradient-to-r ${colorGradient} rounded-full flex items-center justify-center`}
                      >
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">
                          {speaker.name}
                        </p>
                        <p className="text-gray-400 text-xs">{speaker.title}</p>
                      </div>
                    </div>
                  ))}
                  {event.speakers.length > 3 && (
                    <div className="flex items-center px-3 py-2 text-gray-400 text-sm">
                      +{event.speakers.length - 3} more
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Event Image with Custom Shape */}
        <motion.div
          className={`lg:col-span-5 relative ${
            isEven ? "lg:order-2" : "lg:order-1"
          }`}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative w-full h-96 rounded-3xl overflow-hidden">
            {event.image ? (
              <div className="relative w-full h-full">
                {/* Custom shaped image container */}
                <div
                  className="w-full h-full relative overflow-hidden"
                  style={{
                    clipPath: imageShape,
                  }}
                >
                  <motion.img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover"
                    initial={{ scale: 1.1 }}
                    whileHover={{ scale: 1.2 }}
                    transition={{ duration: 0.5 }}
                  />

                  {/* Gradient overlay for better text contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>

                {/* Decorative elements */}
                <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-white/50" />
                <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-white/50" />
                <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-white/50" />
                <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-white/50" />

                {/* Floating particles effect */}
                <motion.div
                  className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/60 rounded-full"
                  animate={{
                    y: [-10, 10, -10],
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <motion.div
                  className="absolute top-3/4 right-1/4 w-1 h-1 bg-white/40 rounded-full"
                  animate={{
                    y: [10, -10, 10],
                    opacity: [0.2, 0.8, 0.2],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                />
              </div>
            ) : (
              // Fallback for events without images
              <div
                className={`w-full h-full bg-gradient-to-br ${colorGradient}/20 flex items-center justify-center relative overflow-hidden`}
                style={{
                  clipPath: imageShape,
                }}
              >
                <motion.div
                  className={`w-24 h-24 bg-gradient-to-r ${colorGradient} rounded-full flex items-center justify-center`}
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
                  <IconComponent className="w-12 h-12 text-white" />
                </motion.div>
              </div>
            )}

            {/* Timeline dot */}
            <motion.div
              className={`absolute top-1/2 ${
                isEven ? "-left-4" : "-right-4"
              } lg:left-1/2 lg:-translate-x-1/2 w-8 h-8 bg-gradient-to-r ${colorGradient} rounded-full border-4 border-black flex items-center justify-center z-10`}
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : { scale: 0 }}
              transition={{ delay: index * 0.2 + 0.5, duration: 0.5 }}
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
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Rest of the component remains the same
const PastEventsPage: React.FC = () => {
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
                <p className="text-gray-400">Loading past events...</p>
              </div>
            ) : events.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Calendar className="w-16 h-16 text-gray-500 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">
                  No Past Events Found
                </h3>
                <p className="text-gray-400 text-center">
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
