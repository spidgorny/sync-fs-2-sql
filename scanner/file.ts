import { db } from "@/server/database/database";
import { Folder } from "@/server/database/types";

export function getFileById(insertId: number) {
	console.log("getFileById", { insertId });
	return db.selectFrom("file").where("id", "=", insertId).executeTakeFirst();
}

export async function getFileByName(
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
