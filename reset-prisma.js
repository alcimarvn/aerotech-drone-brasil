
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log("Starting Nuclear Prisma Reset...");

// 1. Kill Node Processes (Forcefully)
try {
    console.log("Killing Node.js processes...");
    execSync('taskkill /F /IM node.exe /T', { stdio: 'ignore' });
} catch (e) {
    console.log("No running node processes found (or error killing them).");
}

// 2. Delete .prisma cache
const prismaPath = path.join(__dirname, 'node_modules', '.prisma');
if (fs.existsSync(prismaPath)) {
    console.log(`Deleting ${prismaPath}...`);
    fs.rmSync(prismaPath, { recursive: true, force: true });
}

// 3. Delete @prisma/client cache just in case
const prismaClientPath = path.join(__dirname, 'node_modules', '@prisma', 'client');
if (fs.existsSync(prismaClientPath)) {
    // We shouldn't delete the package itself, usually only .prisma is the generated part, 
    // but sometimes clean install helps. Let's stick to .prisma first.
    // actually, `npx prisma generate` writes to node_modules/@prisma/client as well.
}

// 4. Run Generate
console.log("Running prisma generate...");
try {
    execSync('npx prisma generate', { stdio: 'inherit' });
    console.log("Generation Successful!");
} catch (e) {
    console.error("Generation Failed:", e.message);
    process.exit(1);
}

// 5. Run DB Push
console.log("Running prisma db push...");
try {
    execSync('npx prisma db push', { stdio: 'inherit' });
    console.log("DB Push Successful!");
} catch (e) {
    console.error("DB Push Failed:", e.message);
}
