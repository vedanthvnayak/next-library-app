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
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import NextLink from "next/link";

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
}

const MyAppointments = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<
    Appointment[]
  >([]);
  const [selectedDate, setSelectedDate] = useState<string>("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && session?.user?.email) {
      fetchAppointments(session.user.email);
    }
  }, [status, session, router]);

  useEffect(() => {
    if (selectedDate) {
      const filtered = appointments.filter((appointment) => {
        const appointmentDate = new Date(appointment.start_time);
        const selected = new Date(selectedDate);
        return (
          appointmentDate.getDate() === selected.getDate() &&
          appointmentDate.getMonth() === selected.getMonth() &&
          appointmentDate.getFullYear() === selected.getFullYear()
        );
      });
      setFilteredAppointments(filtered);
    } else {
      setFilteredAppointments(appointments);
    }
  }, [appointments, selectedDate]);

  const fetchAppointments = async (email: string) => {
    try {
      const fetchedAppointments = await getUsersAppointments(email);
      setAppointments(fetchedAppointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
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

        <div className="mb-6 flex items-center space-x-4">
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
              className="flex items-center bg-gray-700 text-white px-3 py-2 rounded-md hover:bg-gray-600 transition-colors duration-300 text-sm font-medium mt-6"
            >
              <X className="w-4 h-4 mr-2" />
              Clear Filter
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map(
              (appointment: Appointment, index: number) => (
                <div
                  key={index}
                  className="bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-indigo-500/20 hover:bg-gray-700"
                >
                  <div className="p-6">
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
                          {new Date(appointment.end_time).toLocaleTimeString()}
                        </p>
                      </div>
                      {appointment.location.type && (
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-5 w-5 text-indigo-400" />
                          <p className="text-sm">{appointment.location.type}</p>
                        </div>
                      )}
                      {appointment.invitees &&
                        appointment.invitees.length > 0 && (
                          <div className="flex items-center space-x-2">
                            <User className="h-5 w-5 text-indigo-400" />
                            <p className="text-sm">
                              {appointment.invitees[0].name}
                            </p>
                          </div>
                        )}
                    </div>
                  </div>
                  {appointment.location.join_url && (
                    <div className="px-6 py-4 bg-gray-700">
                      <a
                        href={appointment.location.join_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-full px-4 py-2 bg-indigo-700 text-white rounded-full hover:bg-indigo-700 transition-colors duration-300 text-sm font-medium"
                      >
                        <Link className="mr-2 h-4 w-4" />
                        Join Meeting
                      </a>
                    </div>
                  )}
                </div>
              )
            )
          ) : (
            <p className="col-span-full text-center text-gray-400 text-lg">
              No appointments scheduled for the selected date.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyAppointments;
