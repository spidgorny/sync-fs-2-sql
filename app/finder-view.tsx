"use client";

// import "finderjs/example/finderjs.css";
import { ReactColumns } from "@/app/react-columns";

export default function FinderView() {
	const data = [
		{
			id: 1,
			name: "Label A",
			children: [
				{
					id: 10,
					name: "Label A1",
				},
				{
					id: 11,
					name: "Label A2",
				},
			],
		},
		{
			id: 2,
			name: "Label CB",
		},
	];

	return (
		<main className="h-full">
			<ReactColumns data={data} />
		</main>
	);
}
