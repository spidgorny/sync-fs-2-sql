import { db } from '../server/database/database'

async function runTest(code: () => void) {
    console.log('Startup time', process.uptime());
    await code();
    console.log('Run time', process.uptime());
}

runTest(async () => {
    const row = await db.selectFrom('file')
        .where('id', '=', 1)
        .selectAll()
        .executeTakeFirst();
    console.log({row})
}).then();
