import {runTest} from "@/test/bootstrap";
import * as fs from "fs";
import {Dirent} from "fs";
import {db} from "@/server/database/database";
import {Folder} from "@/server/database/types";

runTest(async () => {
    const root = '..';
    const parent = null;
    await scanDir(root, (dirent) => importCode(parent, dirent))
}).then()

async function scanDir(root: string, importCode: (file: Dirent)=>void) {
    const dir = fs.opendirSync(root)

    let promiseList = [];
    for await (let file of dir) {
        console.log(file.name);
        promiseList.push(importCode(file));
    }
    return Promise.all(promiseList)
}

async function importCode(parent: Folder, dirent: Dirent) {
    let stat = fs.statSync(dirent.path);
    if (dirent.isDirectory()) {
        let set = {
            parent: parent?.id ?? null,
            name: dirent.name,
            size: stat.size,
            ctime: stat.ctime,
            mtime: stat.mtime,
        };
        const res = await db.insertInto('folder')
            .values(set)
            .onConflict(oc => oc
            .columns(['parent', 'name'])
            .doUpdateSet(set)).execute();
        return;
    }
    let set = {
        id_folder: parent?.id ?? null,
        name: dirent.name,
        size: stat.size,
        ctime: stat.ctime,
        mtime: stat.mtime,
    };
    const res = await db.insertInto('file').values(set)
        .onConflict(oc => oc
            .columns(['id_folder', 'name'])
            .doUpdateSet(set)).execute();
}