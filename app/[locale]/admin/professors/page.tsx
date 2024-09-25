import AdminProfessorTable from "@/components/AdminProfessorTable";
import { getProfessors } from "@/app/[locale]/lib/calendlyOperations";

export default async function AdminProfessorsPage() {
  const professors = await getProfessors();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Manage Professors</h1>
      <AdminProfessorTable professors={professors} />
    </div>
  );
}
