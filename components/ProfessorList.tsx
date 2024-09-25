import ProfessorCard from "@/components/ProfessorCard";

interface Professor {
  id: string;
  name: string;
  department: string;
  short_bio: string;
}

interface ProfessorListProps {
  professors: Professor[];
}

export default function ProfessorList({ professors }) {
  return (
    <div className="bg-gray-900 p-6 rounded-2xl shadow-xl">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {professors.map((professor) => (
          <ProfessorCard key={professor.id} professor={professor} />
        ))}
      </div>
    </div>
  );
}
