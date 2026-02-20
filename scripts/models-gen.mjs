import { readdirSync, writeFileSync } from "fs";
import { join, basename } from "path";

// Folder containing model files
const tablesDir = join(process.cwd(), "src/models");

// Read all .ts files except index.ts
const files = readdirSync(tablesDir).filter(f => f.endsWith(".ts") && f !== "index.ts");

// Generate import lines
const exportLines = files.map(f => `import ${basename(f, ".ts")} from "./${basename(f, ".ts")}";`).join("\n");

// Write to index.ts with export statement
const indexPath = join(tablesDir, "index.ts");
writeFileSync(indexPath, exportLines + "\nexport { " + files.map(f => basename(f, ".ts")).join(', ') + " }\n");

console.log(`✅ Generated models/index.ts with ${files.length} exports.`);

