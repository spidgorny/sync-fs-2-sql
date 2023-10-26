import { db } from "@/server/database/database";
import { Folder } from "@/server/database/types";

export function getFileById(id: number) {
	return db
		.selectFrom("file")
		.selectAll()
		.where("id", "=", id)
		.executeTakeFirst();
}

export async function findFileByName(
	name: string,
	parent: Folder | null = null,
) {
	return db
		.selectFrom("file")
		.selectAll()
		.where("name", "=", name)
		.where("id_folder", "=", parent?.id ?? null)
		.executeTakeFirst();
}
