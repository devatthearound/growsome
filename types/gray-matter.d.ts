declare module 'gray-matter' {
  interface GrayMatterFile<T> {
    data: T;
    content: string;
    excerpt?: string;
  }

  interface GrayMatterOption<T> {
    excerpt?: (file: GrayMatterFile<T>, options: GrayMatterOption<T>) => string;
    excerpt_separator?: string;
  }

  function matter<T = any>(input: string, options?: GrayMatterOption<T>): GrayMatterFile<T>;

  export = matter;
} 