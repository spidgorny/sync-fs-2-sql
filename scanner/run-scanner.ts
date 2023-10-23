import { runTest } from "@/test/bootstrap";
import * as fs from "fs";
import { Dirent } from "fs";
import path from "node:path";
import { findInsertFolderInDb } from "@/scanner/parent";
import { importCode } from "@/scanner/db-folder-file";

runTest(async () => {
	const root = path.resolve("..");
	const parent = await findInsertFolderInDb(root);
	console.log({ parent });
	await scanDir(root, (dirent: Dirent) => importCode(parent, dirent));
}).then();

async function scanDir(root: string, importCode: (file: Dirent) => void) {
	console.log(process.uptime().toFixed(3), root);
	const dir = fs.opendirSync(root);

	let promiseList = [];
	for await (let file of dir) {
		// console.log(file.name);
		promiseList.push(importCode(file));
	}
	let entries = await Promise.all(promiseList);
	// console.table(entries, ["id_folder", "name"]);
	let folders = entries.filter((x) => !!x.parent);
	return await Promise.all(
		folders.map((entry) => scanDir(path.join(root, entry.name), importCode)),
	);
}
