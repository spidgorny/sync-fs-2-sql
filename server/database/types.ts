import {
	ColumnType,
	Generated,
	Insertable,
	Selectable,
	Updateable,
} from "kysely";

export interface Database {
	folder: FolderTable;
	file: FileTable;
}

export interface FileTable {
	id: Generated<number>;
	name: string;
	size: number;
	ctime: ColumnType<Date, string | undefined, never>;
	mtime: ColumnType<Date, string | undefined, never>;
	created_at: ColumnType<Date, string | undefined, never>;
	updated_at: ColumnType<Date, string | undefined, never>;
}
export type File = Selectable<FileTable>;
export type NewFile = Insertable<FileTable>;
export type FileUpdate = Updateable<FileTable>;

export interface FolderTable {
	id: Generated<number>;
	id_parent: number;
	name: string;
	size: number;
	ctime: ColumnType<Date, string | undefined, never>;
	mtime: ColumnType<Date, string | undefined, never>;
	created_at: ColumnType<Date, string | undefined, never>;
	updated_at: ColumnType<Date, string | undefined, never>;
}
export type Folder = Selectable<FolderTable>;
export type NewFolder = Insertable<FolderTable>;
export type FolderUpdate = Updateable<FolderTable>;
