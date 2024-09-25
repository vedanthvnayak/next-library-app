"use client";

import { useState, useEffect } from "react";
import { getUsersAppointments } from "@/app/[locale]/lib/calendlyOperations";
import {
  Calendar,
  Clock,
  Link,
  MapPin,
  User,
  ChevronLeft,
  PlusCircle,
  X,
  Loader2,
  Filter,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import NextLink from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface Appointment {
  name: string;
  status: string;
  start_time: string;
  end_time: string;
  location: {
    type: string;
    join_url?: string;
  };
  invitees?: Array<{ name: string }>;
  event_memberships: Array<{ user_name: string; user_email: string }>;
}

export default function MyAppointments() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<
    Appointment[]
  >([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false); // New state to toggle active/all events

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && session?.user?.email) {
      fetchAppointments(session.user.email);
    }
  }, [status, session, router]);

  useEffect(() => {
    // Filter by date and status (active/all)
    const filtered = appointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.start_time);
      const selected = new Date(selectedDate);
      const isMatchingDate =
        !selectedDate ||
        (appointmentDate.getDate() === selected.getDate() &&
          appointmentDate.getMonth() === selected.getMonth() &&
          appointmentDate.getFullYear() === selected.getFullYear());
      const isMatchingStatus = showAll || appointment.status === "active"; // Filter by status
      return isMatchingDate && isMatchingStatus;
    });
    setFilteredAppointments(filtered);
  }, [appointments, selectedDate, showAll]);

  const fetchAppointments = async (email: string) => {
    try {
      setLoading(true);
      const fetchedAppointments = await getUsersAppointments(email);
      setAppointments(fetchedAppointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const clearFilter = () => {
    setSelectedDate("");
  };

  const toggleShowAll = () => {
    setShowAll((prev) => !prev); // Toggle between showing all or only active
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 px-4 sm:px-6 lg:px-8 py-12 pt-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <NextLink
            href="/profile"
            className="flex items-center text-indigo-400 hover:text-indigo-300 transition-colors duration-300"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            <span className="text-sm font-medium">Back to Profile</span>
          </NextLink>
          <h1 className="text-4xl font-bold text-white flex items-center">
            <Calendar className="w-8 h-8 mr-3 text-indigo-400" />
            My Appointments
          </h1>
          <NextLink
            href="/professors"
            className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition-colors duration-300 text-sm font-medium"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Schedule Meeting
          </NextLink>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div>
            <label
              htmlFor="date-filter"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Filter by Date
            </label>
            <input
              type="date"
              id="date-filter"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-gray-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          {selectedDate && (
            <button
              onClick={clearFilter}
              className="flex items-center bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors duration-300 text-sm font-medium"
            >
              <X className="w-4 h-4 mr-2" />
              Clear Filter
            </button>
          )}

          {/* Toggle between active/all events */}
          <button
            onClick={toggleShowAll}
            className="flex items-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2 rounded-full hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 text-sm font-medium shadow-md transform hover:scale-105"
          >
            <Filter className="w-4 h-4 mr-2" />
            {showAll ? "Show Only Active" : "Show All Events"}
          </button>
        </div>

        <AnimatePresence>
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center items-center h-64"
            >
              <Loader2 className="w-12 h-12 text-indigo-400 animate-spin" />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map(
                  (appointment: Appointment, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-indigo-500/20 hover:bg-gray-700 flex flex-col"
                    >
                      <div className="p-6 flex-grow">
                        <div className="flex justify-between items-start mb-4">
                          <h2 className="text-2xl font-semibold text-white">
                            {appointment.name}
                          </h2>
                          <div className="flex flex-col items-end space-y-2">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                appointment.status === "active"
                                  ? "bg-green-500 text-white"
                                  : "bg-gray-600 text-gray-300"
                              }`}
                            >
                              {appointment.status === "active"
                                ? "Active"
                                : "Inactive"}
                            </span>
                            {isToday(new Date(appointment.start_time)) && (
                              <span className="px-2 py-1 rounded-full text-xs font-semibold bg-indigo-500 text-white">
                                Today
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="space-y-4 text-gray-300">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-5 w-5 text-indigo-400" />
                            <p className="text-sm">
                              {new Date(
                                appointment.start_time
                              ).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-5 w-5 text-indigo-400" />
                            <p className="text-sm">
                              {new Date(
                                appointment.start_time
                              ).toLocaleTimeString()}{" "}
                              -{" "}
                              {new Date(
                                appointment.end_time
                              ).toLocaleTimeString()}
                            </p>
                          </div>
                          {appointment.location.type && (
                            <div className="flex items-center space-x-2">
                              <MapPin className="h-5 w-5 text-indigo-400" />
                              <p className="text-sm">
                                {appointment.location.type === "physical"
                                  ? "In-Person Meeting"
                                  : "Virtual Meeting"}
                              </p>
                            </div>
                          )}
                          {appointment.location.join_url && (
                            <div className="flex items-center space-x-2">
                              <Link className="h-5 w-5 text-indigo-400" />
                              <a
                                href={appointment.location.join_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm underline hover:text-indigo-300"
                              >
                                Join Meeting
                              </a>
                            </div>
                          )}
                          {appointment.invitees && (
                            <div className="flex items-center space-x-2">
                              <User className="h-5 w-5 text-indigo-400" />
                              <p className="text-sm">
                                Invitees:{" "}
                                {appointment.invitees
                                  .map((invitee) => invitee.name)
                                  .join(", ")}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="bg-gray-900 p-4 flex items-center justify-between text-sm text-gray-400">
                        <div>
                          Organized by{" "}
                          <span className="text-indigo-400">
                            {
                              appointment.event_memberships[0].user_name // Get the first event member
                            }
                          </span>
                        </div>
                        <a
                          href={`mailto:${appointment.event_memberships[0].user_email}`}
                          className="text-indigo-400 hover:underline"
                        >
                          Contact
                        </a>
                      </div>
                    </motion.div>
                  )
                )
              ) : (
                <p className="text-gray-300 text-lg">
                  No appointments found for the selected filters.
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
