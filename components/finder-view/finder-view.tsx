"use client";

import { ReactColumns } from "@/components/finder-view/react-columns";
import { useEffect, useState } from "react";

export function useFolderState() {
	const [data, setData] = useState([]);
	const [selectedIdList, setSelectedIdList] = useState<number[]>([]);
	// console.log({ selectedIdList });

	const setSelectedFolder = (level: number, id: number) => {
		let newList = [...selectedIdList].slice(0, level);
		newList[level] = id;
		setSelectedIdList(newList);
		loadChildren(newList).then();
	};

	const init = async () => {
		const res = await fetch("/api/info");
		const { data } = await res.json();
		setData(data);
	};

	useEffect(() => {
		init().then();
	}, []);

	const getTreeChildByIdPath = (idPath: number[]) => {
		let current = data;
		console.log("getTreeChildByIdPath", JSON.stringify(idPath));
		for (let id of idPath) {
			let newCurrent = current?.children ?? current; // needed
			if (!newCurrent) {
				return current;
			}
			current = newCurrent;
			current = current.find((x) => x.id === id);
			console.log("current", "[", id, "]", "=>", current);
		}
		return current as any;
	};

	const loadChildren = async (idPath: number[]) => {
		const res = await fetch("/api/info/" + idPath.join("/"));
		const { data: infoAboutId, children } = await res.json();
		const pointer = getTreeChildByIdPath(idPath);
		pointer.children = children;
		setData([...data]);
	};

	// console.dir(data, { depth: null });
	return { data, setData, selectedIdList, setSelectedFolder, loadChildren };
}

export default function FinderView() {
	const { data, ...folderState } = useFolderState();

	return (
		<main className="h-full">
			<ReactColumns data={data} folderState={{ data, ...folderState }} />
			<pre className="pre-wrap">{JSON.stringify(data, null, 2)}</pre>
		</main>
	);
}
