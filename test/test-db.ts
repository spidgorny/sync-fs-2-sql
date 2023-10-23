import {db} from '../server/database/database'
import {runTest} from "@/test/bootstrap";

runTest(async () => {
    const row = await db.selectFrom('file')
        .where('id', '=', 1)
        .selectAll()
        .executeTakeFirst();
    console.log({row})
}).then();
