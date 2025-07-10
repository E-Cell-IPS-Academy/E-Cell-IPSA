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
  AlertCircle,
  Loader,
} from "lucide-react";

// Firebase imports
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase/config"; // Adjust path as needed

// Types
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
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// Events service
class PastEventsService {
  private collection = "events";

  async getPastEvents(): Promise<Event[]> {
    try {
      // First, get all events and filter/sort in memory
      // This avoids the need for a composite index
      const q = query(
        collection(db, this.collection),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const allEvents = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Event[];

      // Filter completed events and sort by date
      const pastEvents = allEvents
        .filter((event) => event.status === "completed")
        .sort((a, b) => {
          // Sort by date (newest first)
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          return dateB - dateA;
        });

      return pastEvents;
    } catch (error) {
      console.error("Error fetching past events:", error);

      // Fallback: try simple query without orderBy
      try {
        const simpleQuery = query(
          collection(db, this.collection),
          where("status", "==", "completed")
        );
        const fallbackSnapshot = await getDocs(simpleQuery);
        const fallbackEvents = fallbackSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Event[];

        // Sort in memory
        return fallbackEvents.sort((a, b) => {
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          return dateB - dateA;
        });
      } catch (fallbackError) {
        console.error("Fallback query also failed:", fallbackError);
        throw new Error("Failed to fetch past events");
      }
    }
  }

  // Alternative method that gets all events without any compound queries
  async getAllEventsAndFilter(): Promise<Event[]> {
    try {
      const querySnapshot = await getDocs(collection(db, this.collection));
      const allEvents = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Event[];

      // Filter and sort in memory
      return allEvents
        .filter((event) => event.status === "completed")
        .sort((a, b) => {
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          return dateB - dateA;
        });
    } catch (error) {
      console.error("Error fetching all events:", error);
      throw new Error("Failed to fetch past events");
    }
  }
}

const pastEventsService = new PastEventsService();

// Floating Elements Component
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

// Event Card Component
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

  const IconComponent = getEventIcon(event.category);
  const colorGradient = getEventColor(event.category);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ delay: index * 0.2, duration: 0.8 }}
      className="relative mb-16 last:mb-0"
    >
      {/* Timeline Line */}
      <div className="absolute left-8 lg:left-1/2 lg:-translate-x-0.5 top-24 w-0.5 h-full bg-gradient-to-b from-white/20 via-white/10 to-transparent" />

      <div
        className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${
          index % 2 === 0 ? "" : "lg:grid-flow-col-dense"
        }`}
      >
        {/* Event Content */}
        <motion.div
          className={`space-y-6 ${index % 2 === 0 ? "" : "lg:col-start-2"}`}
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

        {/* Event Visual */}
        <motion.div
          className={`relative ${index % 2 === 0 ? "" : "lg:col-start-1"}`}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <div
            className={`relative w-full h-80 rounded-3xl border border-white/10 flex items-center justify-center overflow-hidden`}
          >
            {/* Event Image */}
            {event.image ? (
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className={`w-full h-full bg-gradient-to-br ${colorGradient}/20 flex items-center justify-center`}
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

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Corner decorations */}
            <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-white/30" />
            <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-white/30" />
            <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-white/30" />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-white/30" />
          </div>

          {/* Timeline dot */}
          <motion.div
            className={`absolute top-1/2 ${
              index % 2 === 0 ? "-right-4" : "-left-4"
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
        </motion.div>
      </div>
    </motion.div>
  );
};

const PastEventsPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  useEffect(() => {
    loadPastEvents();
  }, []);

  const loadPastEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const pastEvents = await pastEventsService.getPastEvents();
      setEvents(pastEvents);
    } catch (err) {
      setError("Failed to load past events. Please try again later.");
      console.error("Error loading past events:", err);
    } finally {
      setLoading(false);
    }
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
            {loading ? (
              /* Loading State */
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
            ) : error ? (
              /* Error State */
              <div className="flex flex-col items-center justify-center py-20">
                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">
                  Error Loading Events
                </h3>
                <p className="text-gray-400 text-center mb-6">{error}</p>
                <button
                  onClick={loadPastEvents}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-blue-600 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : events.length === 0 ? (
              /* Empty State */
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
              /* Events List */
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
