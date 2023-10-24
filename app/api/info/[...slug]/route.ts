import { NextRequest } from "next/server";
import {findPath} from "@/scanner/db-folder-file";
import {getFolderById} from "@/scanner/folder";

export async function GET(req: NextRequest, { params }: { params: { slug: string[] } }) {
    let pathParts = params.slug;
    console.log({slug: pathParts});
    let [rootId, ...otherParts] = pathParts;
    const root = await getFolderById(Number(rootId));
    console.log({root})
    const data = await findPath(otherParts, root);
    return Response.json({ path: pathParts.join('/'), data});
}
