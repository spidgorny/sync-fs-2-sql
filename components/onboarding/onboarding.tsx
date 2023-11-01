import { db, pgPool } from "@/server/database/database";
import { PropsWithChildren, Suspense } from "react";
import { Spinner } from "@nextui-org/spinner";
import { ErrorAlert } from "@/app/error-alert";
import invariant from "tiny-invariant";
import { TriggerCreateTables } from "@/components/onboarding/trigger-create-tables";
import fs from "fs";

export async function Onboarding(props: PropsWithChildren<{}>) {
	try {
		await checkTablesExist();
		await checkFoldersImported();
		return <div>{props.children}</div>;
	} catch (e) {
		return (
			<div className="flex justify-center items-center h-screen">
				<Suspense
					fallback={
						<div>
							<Spinner /> Checking database
						</div>
					}
				>
					<CheckDbConnection />
				</Suspense>
			</div>
		);
	}
}

export async function CheckDbConnection() {
	try {
		const data = await db.introspection.getTables();
		return (
			<div className="">
				✅ Database is working
				<Suspense
					fallback={
						<div>
							<Spinner /> Checking database tables
						</div>
					}
				>
					<CheckDbTables />
				</Suspense>
			</div>
		);
	} catch (e) {
		return (
			<div className="">
				⛔ Database missing
				<ErrorAlert error={e.message} />
				{e.message === 'database "sync-fs" does not exist' && (
					<pre>Create Postgres database called "sync-db" and refresh.</pre>
				)}
			</div>
		);
	}
}

async function createTables() {
	"use server";
	console.log("server", process.uptime());
	let createFolder = fs.readFileSync("sql/folder.sql", "utf8");
	const res1 = await pgPool.query(createFolder);
	let createFile = fs.readFileSync("sql/file.sql", "utf8");
	const res2 = await pgPool.query(createFile);
	return { res1, res2 };
}

export async function CheckDbTables() {
	try {
		await checkTablesExist();
		return (
			<div className="">
				✅ Database tables exist
				<CheckFoldersImportedView />
			</div>
		);
	} catch (e) {
		return (
			<div className="">
				⛔ Database tables missing
				<ErrorAlert error={e.message} />
				<TriggerCreateTables createTables={createTables} />
			</div>
		);
	}
}

async function checkTablesExist() {
	const data = await db.introspection.getTables();
	invariant(
		data.some((x) => x.name === "folder"),
		"folder table missing",
	);
	invariant(
		data.some((x) => x.name === "file"),
		"file table missing",
	);
}

async function checkFoldersImported() {
	const folders = await db
		.selectFrom("folder")
		.select(({ fn, val, ref }) => [fn.count<number>("id").as("folder_count")])
		.executeTakeFirstOrThrow();
	invariant(folders.folder_count > 0, "nothing is imported yet");
	return folders.folder_count;
}

export async function CheckFoldersImportedView() {
	try {
		await checkFoldersImported();
		return <div className="">✅ Some data is imported</div>;
	} catch (e) {
		return (
			<div className="">
				⛔ No data is imported
				<ErrorAlert error={e.message} />
				<pre>
					{`From CLI run the following command:

> npx tsx scanner/run-scanner <folder to import>

It will start importing data into the database.
Refresh this page after that.`}
				</pre>
			</div>
		);
	}
}
