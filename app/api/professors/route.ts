import { NextResponse } from "next/server";
import { getProfessors } from "@/app/[locale]/lib/calendlyOperations";

export async function GET() {
  const professors = await getProfessors();
  return NextResponse.json(professors);
}
