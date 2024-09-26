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
  XCircle,
  RefreshCw,
  History,
  ChevronDown,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import NextLink from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import ReactCalendlyInline from "@/components/ui/ReactCalendlyInline";

interface Appointment {
  id: string;
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
  cancel_url: string;
  reschedule_url: string;
}

const CustomSwitch = ({
  checked,
  onChange,
  id,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  id: string;
  label: string;
}) => {
  return (
    <label htmlFor={id} className="flex items-center cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          id={id}
          className="sr-only"
          checked={checked}
          onChange={onChange}
        />
        <div
          className={`block w-10 h-6 rounded-full ${
            checked ? "bg-indigo-600" : "bg-gray-600"
          }`}
        ></div>
        <div
          className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition ${
            checked ? "transform translate-x-4" : ""
          }`}
        ></div>
      </div>
      <div className="ml-3 text-sm text-gray-300 font-medium">{label}</div>
    </label>
  );
};

export default function MyAppointments() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<
    Appointment[]
  >([]);
  const [filterOption, setFilterOption] = useState("upcoming");
  const [showAll, setShowAll] = useState(false);
  const [showPast, setShowPast] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showCalendlyPopup, setShowCalendlyPopup] = useState(false);
  const [calendlyUrl, setCalendlyUrl] = useState("");
  const [popupTitle, setPopupTitle] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && session?.user?.email) {
      fetchAppointments(session.user.email);
    }
  }, [status, session, router]);

  useEffect(() => {
    const filtered = appointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.start_time);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      let isMatchingDate = true;
      if (filterOption === "upcoming") {
        isMatchingDate = appointmentDate >= today;
      } else if (filterOption === "today") {
        isMatchingDate =
          appointmentDate.toDateString() === today.toDateString();
      } else if (filterOption === "thisWeek") {
        const weekEnd = new Date(today);
        weekEnd.setDate(today.getDate() + 7);
        isMatchingDate = appointmentDate >= today && appointmentDate < weekEnd;
      }

      const isMatchingStatus = showAll || appointment.status === "active";
      const isPastAppointment = showPast || appointmentDate >= today;

      return isMatchingDate && isMatchingStatus && isPastAppointment;
    });
    setFilteredAppointments(filtered);
  }, [appointments, filterOption, showAll, showPast]);

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

  const isPast = (date: Date) => {
    const today = new Date();
    return date < today;
  };

  const toggleShowAll = () => {
    setShowAll((prev) => !prev);
  };

  const toggleShowPast = () => {
    setShowPast((prev) => !prev);
  };

  const cancelAppointment = (cancelUrl: string) => {
    setCalendlyUrl(cancelUrl);
    setPopupTitle("Cancel Appointment");
    setShowCalendlyPopup(true);
  };

  const rescheduleAppointment = (rescheduleUrl: string) => {
    setCalendlyUrl(rescheduleUrl);
    setPopupTitle("Reschedule Appointment");
    setShowCalendlyPopup(true);
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

        <div className="mb-6 flex flex-wrap items-center gap-4">
          <div className="relative">
            <select
              value={filterOption}
              onChange={(e) => setFilterOption(e.target.value)}
              className="appearance-none bg-gray-700 text-white rounded-md px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="upcoming">Upcoming</option>
              <option value="today">Today</option>
              <option value="thisWeek">This Week</option>
              <option value="all">All</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          <CustomSwitch
            id="show-all"
            checked={showAll}
            onChange={toggleShowAll}
            label="Show Inactive"
          />
          <CustomSwitch
            id="show-past"
            checked={showPast}
            onChange={toggleShowPast}
            label="Show Past"
          />
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
                      key={appointment.id}
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
                            {isPast(new Date(appointment.start_time)) && (
                              <span className="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-500 text-white">
                                Past
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
                          {appointment.invitees &&
                            appointment.invitees.length > 0 && (
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
                      <div className="bg-gray-700 p-4 flex items-center justify-between">
                        {!isPast(new Date(appointment.start_time)) && (
                          <>
                            <button
                              onClick={() =>
                                cancelAppointment(appointment.cancel_url)
                              }
                              className="flex items-center bg-gray-600 text-white px-3 py-2 rounded-md hover:bg-gray-500 transition-colors duration-300 text-sm font-medium"
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Cancel
                            </button>
                            <button
                              onClick={() =>
                                rescheduleAppointment(
                                  appointment.reschedule_url
                                )
                              }
                              className="flex items-center bg-indigo-600 text-white px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-300 text-sm font-medium"
                            >
                              <RefreshCw className="w-4 h-4 mr-2" />
                              Reschedule
                            </button>
                          </>
                        )}
                        {isPast(new Date(appointment.start_time)) && (
                          <span className="text-gray-400 text-sm">
                            <History className="w-4 h-4 inline-block mr-2" />
                            Past Appointment
                          </span>
                        )}
                        {appointment.location.join_url &&
                          !isPast(new Date(appointment.start_time)) && (
                            <a
                              href={appointment.location.join_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 transition-colors duration-300 text-sm font-medium"
                            >
                              <Link className="w-4 h-4 mr-2" />
                              Join
                            </a>
                          )}
                      </div>
                    </motion.div>
                  )
                )
              ) : (
                <p className="col-span-full text-center text-gray-400 text-lg">
                  No appointments scheduled for the selected filters.
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Calendly Popup for Reschedule and Cancel */}
      {showCalendlyPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">{popupTitle}</h2>
              <button
                onClick={() => setShowCalendlyPopup(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <ReactCalendlyInline url={calendlyUrl} />
          </div>
        </div>
      )}
    </div>
  );
}
