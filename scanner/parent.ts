import fs from "fs";
import { db } from "@/server/database/database";
import { Folder } from "@/server/database/types";

export async function findFolderByName(
	filePath: string,
	parent: Folder | null = null,
) {
	const select = db
		.selectFrom("folder")
		.selectAll()
		.where("name", "=", filePath);
	if (parent) {
		return select.where("parent", "=", parent?.id ?? null).executeTakeFirst();
	}
	return select.executeTakeFirst();
}

export async function findInsertFolderInDb(
	filePath: string,
	parent: Folder | null = null,
) {
	const row = await findFolderByName(filePath, parent);
	if (row) {
		return row;
	}
	await insertRootDirectory(filePath);
	return findFolderByName(filePath);
}

async function insertRootDirectory(filePath: string) {
	let stat = fs.statSync(filePath);
	let set = {
		parent: null,
		name: filePath,
		size: stat.size,
		ctime: stat.ctime,
		mtime: stat.mtime,
	};
	const res = await db
		.insertInto("folder")
		.values({
			...set,
			created_at: new Date(),
		})
		.execute();
	return res;
}
