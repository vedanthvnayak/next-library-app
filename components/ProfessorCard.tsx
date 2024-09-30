import Link from "next/link";

interface Professor {
  id: string;
  name: string;
  department: string;
  short_bio: string;
}

interface ProfessorCardProps {
  professor: Professor;
}

export default function ProfessorCard({ professor }: ProfessorCardProps) {
  return (
    <div className="bg-gray-800 shadow-lg rounded-xl p-6 transition-all duration-300 hover:shadow-indigo-500/20 min-h-[200px] flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-semibold mb-2 text-white">
          {professor.name}
        </h2>
        <p className="text-indigo-300 mb-2">{professor.department}</p>
        <p className="text-sm text-gray-400 mb-4 line-clamp-3">
          {professor.short_bio}
        </p>
      </div>
      <Link
        href={{
          pathname: "/pay",
          query: { id: professor.id }, // Pass only professor's ID
        }}
        className="bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition-colors duration-300 inline-block text-sm text-center"
      >
        Book Appointment
      </Link>
    </div>
  );
}
