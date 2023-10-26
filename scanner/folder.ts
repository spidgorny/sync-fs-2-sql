import { db } from "@/server/database/database";
import { Folder } from "@/server/database/types";
import fs, { Dirent } from "fs";
import path from "node:path";

export function getFolderById(insertId: number): Promise<Folder> {
	return db
		.selectFrom("folder")
		.selectAll()
		.where("id", "=", insertId)
		.executeTakeFirst();
}

export type FolderEntry = (Folder | File)[];

export async function getChildrenOf({
	id,
}: {
	id: number;
}): Promise<FolderEntry> {
	return (
		await Promise.all([
			db.selectFrom("folder").selectAll().where("parent", "=", id).execute(),
			db.selectFrom("file").selectAll().where("id_folder", "=", id).execute(),
		])
	).flat();
}
