export async function getContent(type: string) {
  try {
    const response = await fetch(`/content/${type}/index.json`);
    if (!response.ok) {
      console.error(`Failed to fetch content for type: ${type}, status: ${response.status}`);
      throw new Error('Content not found');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error loading ${type} content:`, error);
    return null;
  }
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