import path from "node:path";
import chokidar from "chokidar";

// One-liner for current directory
let root = '/';
console.log({root})
chokidar.watch(root).on('all', (event, path) => {
    if (event === "add" || event === "addDir") {
        return;
    }
    console.log(event, path);
});

// interesting
// here