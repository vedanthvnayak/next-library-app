import { getProfessor } from "@/app/[locale]/admin/professors/calendlyOperations";
import CalendlyEmbed from "@/components/CalendlyEmbed";

export default async function ProfessorPage({
  params,
}: {
  params: { id: string };
}) {
  const professor = await getProfessor(parseInt(params.id));

  if (!professor) {
    return (
      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="bg-gray-800 rounded-xl shadow-lg p-6">
          <p className="text-center text-gray-400">Professor not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 px-4 sm:px-6 lg:px-8 py-12 pt-20">
      <div className="bg-gray-800 rounded-xl shadow-lg p-6 mb-6 transition-all duration-300 hover:shadow-indigo-500/20">
        <h1 className="text-3xl font-bold mb-6 text-white">
          Book an Appointment with {professor.name}
        </h1>
        <div className="mb-4 space-y-2">
          <p>
            <strong className="text-indigo-300">Department:</strong>{" "}
            <span className="text-gray-400">{professor.department}</span>
          </p>
          <p>
            <strong className="text-indigo-300">Bio:</strong>{" "}
            <span className="text-gray-400">{professor.shortBio}</span>
          </p>
        </div>
      </div>
      <div className="bg-gray-700 rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-indigo-500/20">
        <CalendlyEmbed calendlyLink={professor.calendlyEventLink} />
      </div>
    </div>
  );
}
