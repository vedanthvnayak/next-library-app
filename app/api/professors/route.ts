import { getAllProfessors } from "@/app/[locale]/admin/professors/calendlyOperations";
import { NextResponse } from "next/server";

export async function GET() {
  const professors = await getAllProfessors();
  return NextResponse.json(professors);
}
