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
	const dir = fs.opendirSync(root);

	let promiseList = [];
	for await (let file of dir) {
		console.log(file.name);
		promiseList.push(importCode(file));
	}
	return Promise.all(promiseList);
}
