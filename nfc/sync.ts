import * as path from "node:path";
import * as fs from "node:fs";
import * as timers from "node:timers";

// region Configuration
const changeHandlerTimeout = 1000;
const filesToWatch = [
    "main.py",
    "settings.toml",
    "src",
    "lib/mfrc522.py",
    ".venv/Lib/site-packages/adafruit_display_text",
    ".venv/Lib/site-packages/adafruit_requests.py",
    ".venv/Lib/site-packages/adafruit_st7789.py",
];
const targetDrive = "E:/";
// endregion


// region File watching
const changedFiles = new Set<string>();
for (let toWatch of filesToWatch) {
    toWatch = path.join(toWatch);

    const lstats = fs.lstatSync(toWatch);
    if (lstats.isDirectory()) {
        const basedir = toWatch;
        fs.readdirSync(toWatch, {withFileTypes: true, recursive: true})
            .map(th => path.join(th.path, th.name))
            .filter(th => !th.includes("__pycache__"))
            .forEach(th => changedFiles.add(th));

        fs.watch(basedir, (event, filename) => {
            if (filename.endsWith("~")) return;
            if (filename.includes("__pycache__")) return;
            changedFiles.add(path.join(basedir, filename));
            changeHandler.refresh();
        });

    } else {
        const filename = toWatch;
        changedFiles.add(filename);
        fs.watch(filename, () => {
            changedFiles.add(filename);
            changeHandler.refresh();
        });
    }
}
// endregion


// region Handle File Changes
const changeHandler = timers.setTimeout(() => {
    for (const srcFile of [...changedFiles]) {
        const destFile = path.resolve(targetDrive, srcFile
            .toLowerCase()
            .replace(".venv", "")
            .replace("site-packages", ""));

        let srcStats: fs.Stats, destStats: fs.Stats;
        try {
            srcStats = fs.lstatSync(srcFile);
        } catch (e) {
        }
        try {
            destStats = fs.lstatSync(destFile);
        } catch (e) {
        }

        if (!srcStats && destStats) {
            // Delete file
            console.log("× %s", destFile);

        } else if (srcStats && !destStats) {
            // Create file
            console.log("+ %s", destFile);
            const dirname = path.dirname(destFile);
            if (dirname.length > 3) {
                fs.mkdirSync(dirname, {recursive: true});
            }
            fs.copyFileSync(srcFile, destFile);

        } else if (srcStats && destStats && srcStats.mtime > destStats.mtime) {
            // Update file
            console.log("* %s", destFile);
            fs.copyFileSync(srcFile, destFile);
        }

        changedFiles.delete(srcFile);
    }
    console.log("");
}, changeHandlerTimeout);
// endregion
