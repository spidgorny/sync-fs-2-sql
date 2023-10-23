import { Folder } from "@/server/database/types";
import fs, { Dirent } from "fs";
import path from "node:path";
import { db } from "@/server/database/database";
import { getFileById, getFileByName } from "@/scanner/file";
import { getFolderById } from "@/scanner/folder";
import { findFolderByName } from "@/scanner/parent";

export async function importCode(parent: Folder, dirent: Dirent) {
	if (dirent.isDirectory()) {
		return insertUpdateDirectory(parent, dirent);
	}
	return insertUpdateFile(parent, dirent);
}

export async function insertUpdateDirectory(parent: Folder, dirent: Dirent) {
	let stat = fs.statSync(path.join(dirent.path, dirent.name));
	let set = {
		parent: parent?.id ?? null,
		name: dirent.name,
		size: stat.size,
		ctime: stat.ctime,
		mtime: stat.mtime,
	};
	if (!parent) {
		throw new Error("No parent directory when inserting new folder");
	}
	const res = await db
		.insertInto("folder")
		.values({
			...set,
			created_at: new Date(),
		})
		.onConflict((oc) =>
			oc.columns(["parent", "name"]).doUpdateSet({
				...set,
				updated_at: new Date(),
			}),
		)
		.executeTakeFirst();
	return findFolderByName(dirent.name, parent);
}
async function insertUpdateFile(parent: Folder, dirent: Dirent) {
	let stat = fs.statSync(path.join(dirent.path, dirent.name));
	let set = {
		id_folder: parent?.id ?? null,
		name: dirent.name,
		size: stat.size,
		ctime: stat.ctime,
		mtime: stat.mtime,
	};
	if (parent) {
		const res = await db
			.insertInto("file")
			.values({
				...set,
				created_at: new Date(),
			})
			.onConflict((oc) =>
				oc.columns(["id_folder", "name"]).doUpdateSet({
					...set,
					updated_at: new Date(),
				}),
			)
			.executeTakeFirst();
		// console.log({ res, name: dirent.name, parent });
		return getFileByName(dirent.name, parent);
	}

	const row = await getFileByName(dirent.name, parent);
	if (row) {
		const res = await db
			.updateTable("file")
			.set({
				...set,
				created_at: new Date(),
			})
			.where("name", "=", dirent.name)
			.execute();
		return getFileById(row.id);
	} else {
		const res = await db
			.insertInto("file")
			.values({
				...set,
				created_at: new Date(),
			})
			.executeTakeFirst();
		return getFileById(Number(res.insertId));
	}
}
