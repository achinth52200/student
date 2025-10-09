
import * as fs from 'fs/promises';
import * as path from 'path';
import mime from 'mime-types';

export async function getFileAsDataURL(filePath: string): Promise<string> {
    try {
        const absolutePath = path.join(process.cwd(), 'public', filePath);
        const fileBuffer = await fs.readFile(absolutePath);
        const mimeType = mime.lookup(absolutePath) || 'application/octet-stream';
        const base64 = fileBuffer.toString('base64');
        return `data:${mimeType};base64,${base64}`;
    } catch (error) {
        console.error(`Error reading file at ${filePath}:`, error);
        throw new Error(`Could not read file at path: ${filePath}`);
    }
}
