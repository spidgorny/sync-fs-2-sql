import clsx from "clsx";

import { ColumnEntry } from "@/components/finder-view/react-columns";

export function ColumnEntryView(props: {
	level: number;
	data: ColumnEntry;
	selectedIdList: number[];
	setSelectedFolder: (level: number, id: number) => void;
}) {
	const isSelected = props.selectedIdList.includes(props.data.id);
	const isFolder = props.data.children?.length || props.data.folder;
	return (
		<div
			className={clsx(
				"text-sm flex flex-row justify-between",
				"cursor-pointer overflow-hidden whitespace-nowrap",
				{
					"text-white bg-blue-500": isSelected,
				},
			)}
			onClick={(e) => {
				props.setSelectedFolder(props.level, props.data.id);
			}}
		>
			<span className="cursor-pointer">{props.data.name}</span>
			{isFolder && <span className="">►</span>}
		</div>
	);
}
