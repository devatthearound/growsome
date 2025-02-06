import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'content');

export function getContent(type: string, id: string) {
  const dirPath = path.join(contentDirectory, type);
  const filePath = path.join(dirPath, `${id}.md`);

  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return null;
  }

  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);

  return { data, content };
}

export async function getContentBySlug(type: string, slug: string) {
  try {
    const response = await fetch(`/content/${type}/${slug}.json`);
    if (!response.ok) throw new Error('Content not found');
    return await response.json();
  } catch (error) {
    console.error(`Error loading ${type} content:`, error);
    return null;
  }
} 