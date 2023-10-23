import { runTest } from "@/test/bootstrap";
import * as fs from "fs";
import { Dirent, Stats } from "fs";
import { db } from "@/server/database/database";
import { Folder } from "@/server/database/types";
import path from "node:path";

runTest(async () => {
	const root = path.resolve("..");
	const parent = await findInsertFolderInDb(root);
	console.log({ parent });
	await scanDir(root, (dirent: Dirent) => importCode(parent, dirent));
}).then();

async function scanDir(root: string, importCode: (file: Dirent) => void) {
	const dir = fs.opendirSync(root);

	let promiseList = [];
	for await (let file of dir) {
		console.log(file.name);
		promiseList.push(importCode(file));
	}
	return Promise.all(promiseList);
}

async function importCode(parent: Folder, dirent: Dirent) {
	if (dirent.isDirectory()) {
		return insertUpdateDirectory(parent, dirent);
	}
	return insertUpdateFile(parent, dirent);
}

async function insertUpdateFile(parent: Folder, dirent: Dirent) {
	let stat = fs.statSync(dirent.path);
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
			.execute();
		return res;
	}

	const row = await db
		.selectFrom("file")
		.selectAll()
		.where("name", "=", dirent.name)
		.executeTakeFirst();
	if (row) {
		const res = await db
			.updateTable("file")
			.set({
				...set,
				created_at: new Date(),
			})
			.where("name", "=", dirent.name)
			.execute();
		return res;
	} else {
		const res = await db
			.insertInto("file")
			.values({
				...set,
				created_at: new Date(),
			})
			.execute();
		return res;
	}
}

async function insertUpdateDirectory(parent: Folder, dirent: Dirent) {
	let stat = fs.statSync(dirent.path);
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
		.execute();
	return res;
}

async function findFolderByName(
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

async function findInsertFolderInDb(
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
