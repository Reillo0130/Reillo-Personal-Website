const fs = require("node:fs");
const path = require("node:path");
const { fileURLToPath, pathToFileURL } = require("node:url");

const root = path.resolve(__dirname, "..");
const errors = [];
const htmlFiles = fs.readdirSync(root)
    .filter((name) => name.endsWith(".html"))
    .map((name) => path.join(root, name));
const htmlIds = new Map();
const references = [];

const readAttributes = (source) => {
    const attributes = new Map();
    const pattern = /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
    let match;

    while ((match = pattern.exec(source))) {
        attributes.set(match[1].toLowerCase(), match[2] ?? match[3] ?? match[4] ?? "");
    }

    return attributes;
};

const collectHtml = (file) => {
    const source = fs.readFileSync(file, "utf8");
    const ids = new Set();
    const tagPattern = /<([a-z][\w:-]*)\b([^>]*)>/gi;
    let match;

    while ((match = tagPattern.exec(source))) {
        if (match[1].startsWith("!")) continue;
        const attributes = readAttributes(match[2]);
        const id = attributes.get("id");

        if (id) {
            if (ids.has(id)) errors.push(`${path.relative(root, file)}: duplicate id "${id}"`);
            ids.add(id);
        }

        for (const name of ["href", "src", "poster", "action"]) {
            const value = attributes.get(name);
            if (value) references.push({ file, value, kind: "html" });
        }
    }

    htmlIds.set(file, ids);
};

const isExternal = (value) => /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(value);

const resolveCaseSensitive = (filePath) => {
    const relative = path.relative(root, filePath);
    if (relative.startsWith("..") || path.isAbsolute(relative)) return false;

    let current = root;
    for (const part of relative.split(path.sep).filter(Boolean)) {
        let entries;
        try {
            entries = fs.readdirSync(current);
        } catch {
            return false;
        }
        if (!entries.includes(part)) return false;
        current = path.join(current, part);
    }

    return fs.existsSync(current);
};

for (const file of htmlFiles) collectHtml(file);

const cssFiles = [];
const collectCssFiles = (directory) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
        const file = path.join(directory, entry.name);
        if (entry.isDirectory()) collectCssFiles(file);
        else if (entry.isFile() && entry.name.endsWith(".css")) cssFiles.push(file);
    }
};
collectCssFiles(path.join(root, "css"));

for (const file of cssFiles) {
    const source = fs.readFileSync(file, "utf8");
    for (const match of source.matchAll(/url\(\s*(['"]?)(.*?)\1\s*\)/gi)) {
        const value = match[2].trim();
        if (value && !isExternal(value) && !value.startsWith("#")) {
            references.push({ file, value, kind: "css" });
        }
    }
}

for (const reference of references) {
    const { file, value, kind } = reference;
    if (isExternal(value) || value.startsWith("#")) {
        if (kind === "html" && value.startsWith("#")) {
            const fragment = decodeURIComponent(value.slice(1));
            if (!htmlIds.get(file)?.has(fragment)) {
                errors.push(`${path.relative(root, file)}: missing fragment "${value}"`);
            }
        }
        continue;
    }

    const url = new URL(value, pathToFileURL(file));
    const target = path.resolve(fileURLToPath(url));

    if (!resolveCaseSensitive(target)) {
        errors.push(`${path.relative(root, file)}: missing ${kind} resource "${value}"`);
        continue;
    }

    if (kind === "html" && url.hash && target.endsWith(".html")) {
        const fragment = decodeURIComponent(url.hash.slice(1));
        if (!htmlIds.get(target)?.has(fragment)) {
            errors.push(`${path.relative(root, file)}: missing fragment "${value}"`);
        }
    }
}

if (errors.length) {
    console.error(errors.map((error) => `ERROR: ${error}`).join("\n"));
    process.exitCode = 1;
} else {
    console.log(`Validated ${htmlFiles.length} HTML pages, ${cssFiles.length} CSS files, and ${references.length} local references.`);
}
