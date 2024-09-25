import ProfessorList from "@/components/ProfessorList";
import { getProfessors } from "@/app/[locale]/lib/calendlyOperations";
import { Book } from "lucide-react";

export default async function ProfessorsPage() {
  const professors = await getProfessors();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 px-4 sm:px-6 lg:px-8 py-12 pt-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center">
            <Book className="w-8 h-8 mr-3 text-indigo-400" />
            Book an Appointment with a Professor
          </h1>
          <p className="text-gray-400 text-lg">
            Select a professor to schedule your consultation
          </p>
        </div>
        <div className="bg-gray-800 rounded-2xl shadow-xl p-6 transition-all duration-300 hover:shadow-indigo-500/20">
          <ProfessorList professors={professors} />
        </div>
      </div>
    </div>
  );
}
