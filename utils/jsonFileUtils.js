const fs = require('fs').promises;

// Function to read JSON from a file
async function read(filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error(`Error reading file from disk: ${err}`);
        throw err; // Rethrow to allow the caller to handle
    }
}

// Function to write JSON to a file
async function write(filePath, data) {
    try {
        const jsonData = JSON.stringify(data, null, 2); // Pretty print JSON
        await fs.writeFile(filePath, jsonData, 'utf8');
    } catch (err) {
        console.error(`Error writing file to disk: ${err}`);
        throw err; // Rethrow to allow the caller to handle
    }
}

module.exports = { read, write };
