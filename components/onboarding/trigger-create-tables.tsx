"use client";
import { useFormStatus } from "react-dom";
import { Button } from "@nextui-org/button";
import { revalidatePath } from "next/cache";

export function TriggerCreateTables(props: {
	createTables: () => Promise<{ res1: any; res2: any }>;
}) {
	const { pending } = useFormStatus();

	const onClick = async () => {
		const results = await props.createTables();
		console.log(results);
		revalidatePath("/");
	};

	return (
		<Button color="primary" onClick={onClick} isLoading={pending}>
			Create tables
		</Button>
	);
}
