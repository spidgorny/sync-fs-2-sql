import { NextRequest } from "next/server";
import { findPath, findPathById } from "@/scanner/db-folder-file";
import { getChildrenOf, getFolderById } from "@/scanner/folder";

export async function GET(
	req: NextRequest,
	{ params }: { params: { slug: string[] } },
) {
	let pathParts = params.slug;
	console.log({ slug: pathParts });
	let [rootId, ...otherParts] = pathParts;
	const root = await getFolderById(Number(rootId));
	console.log({ root });
	if (otherParts.length) {
		let data = await findPath(otherParts, root);
		if (!data) {
			data = await findPathById(
				otherParts.map((x) => Number(x)),
				root,
			);
		}
		if (!data) {
			return Response.json(
				{
					path: pathParts.join("/"),
					status: "404 Not Found",
				},
				{ status: 404 },
			);
		}
		const children = data.parent ? await getChildrenOf(data) : undefined;
		return Response.json({
			path: pathParts.join("/"),
			data: data,
			children,
		});
	}
	const children = await getChildrenOf(root);
	return Response.json({
		path: pathParts.join("/"),
		data: root,
		children: children,
	});
}
