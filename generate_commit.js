const { execSync } = require('child_process');
const fs = require('fs');
const dns = require('dns');

// Force IPv4 resolution to prevent Node.js fetch from failing on some networks with broken IPv6
dns.setDefaultResultOrder('ipv4first');

const API_KEY = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.replace(/^["'`]|["'`]$/g, '').trim() : undefined;

if (!API_KEY) {
    console.error("Veuillez definir la variable d'environnement GEMINI_API_KEY dans votre fichier .env.");
    process.exitCode = 1;
    return;
}

try {
    // Get staged changes
    const diff = execSync('git diff --cached', { encoding: 'utf-8' });

    if (!diff.trim()) {
        console.log("Aucune modification a commiter.");
        process.exitCode = 0;
        return;
    }

    // Truncate to avoid payload limits
    const truncatedDiff = diff.slice(0, 10000);

    const prompt = `Tu es un codeur expert nommé Barry. Génère un message de commit concis (en français) au format conventionnel (ex: feat: xxx, fix: xxx, refactor: xxx) basé sur le git diff suivant. Ne renvoie QUE le message de commit, pas d'explication ou de markdown.
Diff:
${truncatedDiff}`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
                temperature: 0.2, // Low temp for deterministic commit messages
            },
        })
    })
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                console.error("Erreur avec l'API Gemini:", data.error.message || JSON.stringify(data.error));
                process.exitCode = 1;
                return;
            }
            const message = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
            if (message) {
                // Nettoyer les sauts de ligne ou guillemets éventuels
                const cleanMsg = message.replace(/^["'`]|["'`]$/g, '').replace(/\n/g, ' - ').replace(/"/g, "'").trim();
                fs.writeFileSync('.commit_msg.tmp', cleanMsg);
            } else {
                console.error("Erreur avec l'API Gemini:", JSON.stringify(data));
                process.exitCode = 1;
            }
        })
        .catch(err => {
            console.error("Erreur API:", err.message);
            if (err.cause) {
                console.error("Cause de l'erreur réseau:", err.cause.message || err.cause);
            }
            process.exitCode = 1;
        });

} catch (error) {
    console.error("Erreur:", error.message);
    process.exitCode = 1;
}
