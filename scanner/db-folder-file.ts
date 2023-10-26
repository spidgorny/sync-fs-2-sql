import { File, Folder } from "@/server/database/types";
import fs, { Dirent } from "fs";
import path from "node:path";
import { db } from "@/server/database/database";
import { getFileById, findFileByName } from "@/scanner/file";
import { findFolderByName } from "@/scanner/parent";
import { getFolderById } from "@/scanner/folder";

export async function importCodeWithParent(
	parent: Folder,
	dirent: Dirent,
): Promise<File | Folder> {
	if (dirent.isDirectory()) {
		return insertUpdateDirectory(parent, dirent);
	}
	return await insertUpdateFile(parent, dirent);
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

async function insertUpdateFile(parent: Folder, dirent: Dirent): Promise<File> {
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
		return findFileByName(dirent.name, parent);
	}

	const row = await findFileByName(dirent.name, parent);
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
	}
	const res = await db
		.insertInto("file")
		.values({
			...set,
			created_at: new Date(),
		})
		.executeTakeFirst();
	return getFileById(Number(res.insertId));
}

export async function findPath(pathParts: string[], root: Folder) {
	let row = null;
	for (let [index, namePart] of pathParts.entries()) {
		if (index === pathParts.length - 1) {
			row = await findFileByName(namePart, root);
			root = row; // next iteration
			console.log(index, row);
			continue;
		}
		row = await findFolderByName(namePart, root);
		root = row; // next iteration
		console.log(index, row);
	}
	return row;
}

export async function findPathById(pathParts: number[], root: Folder) {
	let row = null;
	for (let [index, namePart] of pathParts.entries()) {
		row = await getFolderById(namePart);
		if (row) {
			root = row; // next iteration
			continue;
		}
		row = await getFileById(namePart);
		console.log("findPathById", { index, namePart, row });
	}
	return row;
}
