"use client";

import "finderjs/example/finderjs.css";
import { ReactFinder } from "./react-finder";

export default function Home() {
	const data = [
		{
			id: 1,
			label: "Label A",
			children: [
				{
					id: 10,
					label: "Label A1",
				},
				{
					id: 11,
					label: "Label A2",
				},
			],
		},
		{
			id: 2,
			label: "Label B",
		},
	];

	return (
		<main className="p-3 bg-white">
			<ReactFinder className="" data={data} />
		</main>
	);
}
