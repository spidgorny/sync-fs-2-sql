export async function runTest(code: () => void) {
    console.log('Startup time', process.uptime());
    await code();
    console.log('Run time', process.uptime());
}