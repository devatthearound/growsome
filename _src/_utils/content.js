export async function getContent(type) {
  try {
    const response = await fetch(`/content/${type}/index.json`);
    if (!response.ok) throw new Error('Content not found');
    return await response.json();
  } catch (error) {
    console.error(`Error loading ${type} content:`, error);
    return [];
  }
}

export async function getContentBySlug(type, slug) {
  try {
    const response = await fetch(`/content/${type}/${slug}.json`);
    if (!response.ok) throw new Error('Content not found');
    return await response.json();
  } catch (error) {
    console.error(`Error loading ${type} content:`, error);
    return null;
  }
} 