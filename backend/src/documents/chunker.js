function chunkText(text, maxLength = 4000) {
    const paragraphs = text
        .split(/\n\s*\n/)
        .map(p => p.trim())
        .filter(Boolean);

    const chunks = [];
    let currentChunk = "";

    for (const paragraph of paragraphs) {
        if (
            currentChunk.length + paragraph.length + 2 <=
            maxLength
        ) {
            currentChunk += paragraph + "\n\n";
        } else {
            if (currentChunk) {
                chunks.push(currentChunk.trim());
            }

            currentChunk = paragraph + "\n\n";
        }
    }

    if (currentChunk) {
        chunks.push(currentChunk.trim());
    }

    return chunks;
}

module.exports = { chunkText };