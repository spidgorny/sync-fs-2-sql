import { db } from "@/server/database/database";
import { Folder } from "@/server/database/types";
import fs, { Dirent } from "fs";
import path from "node:path";

export function getFolderById(insertId: number) {
	return db.selectFrom("folder").where("id", "=", insertId).executeTakeFirst();
}
