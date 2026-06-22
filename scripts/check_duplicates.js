import fs from 'fs';
import path from 'path';

const baseDir = path.join(process.cwd(), 'commands');
const categories = fs.readdirSync(baseDir).filter(f => fs.statSync(path.join(baseDir, f)).isDirectory());

const allCmds = new Map();
const duplicates = [];

for (const cat of categories) {
    const files = fs.readdirSync(path.join(baseDir, cat)).filter(f => f.endsWith('.js'));
    for (const file of files) {
        const fp = path.join(baseDir, cat, file);
        try {
            const content = fs.readFileSync(fp, 'utf-8');
            const nameMatch = content.match(/name:\s*['"]([^'"]+)['"]/);
            if (nameMatch) {
                const cmdName = nameMatch[1].toLowerCase();
                if (allCmds.has(cmdName)) {
                    duplicates.push(fp);
                    console.log(`Duplicate found! '${cmdName}' in ${fp} (already tracked in ${allCmds.get(cmdName)})`);
                } else {
                    allCmds.set(cmdName, fp);
                }
            }
        } catch (e) {}
    }
}

if (duplicates.length > 0) {
    console.log('Revoking duplicates...');
    for (const dup of duplicates) {
        fs.unlinkSync(dup);
        console.log(`Deleted ${dup}`);
    }
} else {
    console.log('No duplicated commands found.');
}
