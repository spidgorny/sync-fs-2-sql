import {runTest} from "@/test/bootstrap";
import * as fs from "fs";
import {Dirent} from "fs";
import path from "node:path";
import {findInsertFolderInDb} from "@/scanner/parent";
import {importCodeWithParent} from "@/scanner/db-folder-file";
import {File, Folder} from "@/server/database/types";

runTest(async () => {
    const root = path.resolve("..");
    const parent = await findInsertFolderInDb(root);
    console.log({parent});
    await scanDir(root, (dirent: Dirent) => importCodeWithParent(parent, dirent));
}).then();

async function scanDir(
    root: string,
    importCode: (file: Dirent) => Promise<File | Folder>,
) {
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
        folders.map((entry) => {
            let pathToDir = path.join(root, entry.name);
            return scanDir(pathToDir, (dirent: Dirent) => importCodeWithParent(entry, dirent));
        }),
    );
}
