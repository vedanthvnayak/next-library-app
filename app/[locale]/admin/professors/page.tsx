import AdminProfessorTable from "@/components/adminComponents/AdminProfessorTable";
import { getAllProfessors } from "./calendlyOperations";

export default async function AdminProfessorsPage() {
  const professors = await getAllProfessors();

  return (
    <div className="container mx-auto px-4 py-8 bg-black">
      <h1 className="text-3xl font-bold mb-6 text-white">Manage Professors</h1>
      <AdminProfessorTable professors={professors} />
    </div>
  );
}
