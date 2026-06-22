import fs from 'fs';
import path from 'path';

function replaceInDir(dir, replacements) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            replaceInDir(fullPath, replacements);
        } else if (fullPath.endsWith('.js')) {
            let content = fs.readFileSync(fullPath, 'utf-8');
            let changed = false;
            for (const {from, to} of replacements) {
                if (typeof from === 'string' ? content.includes(from) : from.test(content)) {
                    content = content.replace(from, to);
                    changed = true;
                }
            }
            if (changed) {
                fs.writeFileSync(fullPath, content);
            }
        }
    }
}

const dir = path.join(process.cwd(), 'commands');

const reps = [
    // Error messages replacement to be funny
    {
        from: "Error in stalker.",
        to: "Whoops, stealth mode broke, I dropped my binoculars! 🤦‍♂️"
    },
    {
        from: /Error in stalker (.*?)\./g,
        to: "Whoops, stealth mode broke, I dropped my binoculars! 🤦‍♂️"
    },
    {
        from: /Error in tiktokstalk\./g,
        to: "TikTok stalking failed, let's just use Google. 😅"
    },
    {
        from: /Error in .*stalk\./g,
        to: "Whoops, stealth mode broke, I dropped my binoculars! 🤦‍♂️"
    },
    {
        from: "Only the host/owner can use this command.",
        to: "Hold up! 🛑 Only my main boss can tell me to do that!"
    },
    {
        from: "Only the developer can use this command.",
        to: "Nice try buddy, but only my creator can run this! 😎"
    },
    // Adding some fun replacing base generic errors
    {
        from: /Error executing (.*?)\./g,
        to: "Yikes, executing $1 went completely sideways 😂."
    },
    {
        from: /Error in search (.*?)\./g,
        to: "My searching glasses are broken, couldn't find $1 🤓."
    },
    {
        from: /Error in (.*?) downloader\./g,
        to: "Downloading $1 just crashed my tiny server brain 😭."
    },
    {
        from: "Error in host command.",
        to: "Host command crashed, system says NOPE! 🤯"
    },
    {
        from: "Error in dev command.",
        to: "Dev command exploded in my face! 💥"
    },
    {
        from: "Error in game.",
        to: "I tripped and lost the game for you! 🤡"
    },
    {
        from: "Error in economy.",
        to: "The economy crashed harder than my code! 📉"
    }
];

replaceInDir(dir, reps);
console.log('Done replacing strings to be fun!');
