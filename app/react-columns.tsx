import { File, Folder } from "@/server/database/types";
import { useFolderState } from "./finder-view";
import { ColumnEntryView } from "@/app/column-entry-view";

export type ColumnEntry = Partial<Folder | File>;

export function ReactColumns(props: {
	data: ColumnEntry[];
	folderState: ReturnType<useFolderState>;
}) {
	let { selectedIdList, setSelectedFolder } = props.folderState;

	let lastCol = props.data;
	const columns = [
		props.data,
		...selectedIdList
			.map((id) => {
				let newLastCol = lastCol?.find((x) => x.id === id);
				lastCol = newLastCol?.children; // next loop
				return newLastCol?.children ?? null;
			})
			.filter(Boolean),
	];
	console.log({ columns });

	return (
		<div className="flex flex-row h-full rounded m-1 p-1">
			{columns.map((column, index) => (
				<Column
					level={index}
					key={column.id ?? index}
					data={column}
					selectedIdList={selectedIdList}
					setSelectedFolder={setSelectedFolder}
				/>
			))}
		</div>
	);
}

function Column(props: {
	level: number;
	data: ColumnEntry[];
	selectedIdList: number[];
	setSelectedFolder: (level: number, id: number) => void;
}) {
	return (
		<div className="d-flex flex-col border border-gray-500 w-[10em]">
			{props.data.map((entry) => (
				<ColumnEntryView
					level={props.level}
					key={entry.id}
					data={entry}
					selectedIdList={props.selectedIdList}
					setSelectedFolder={props.setSelectedFolder}
				/>
			))}
		</div>
	);
}
