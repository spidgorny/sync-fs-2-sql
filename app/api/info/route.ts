import { NextRequest } from "next/server";
import { getVolumes } from "@/scanner/parent";

export async function GET(req: NextRequest) {
	const data = await getVolumes();
	return Response.json({ parent: null, data });
}
