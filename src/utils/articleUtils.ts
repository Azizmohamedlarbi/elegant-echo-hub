
export const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

export const validateArticleForm = (title: string, content: string) => {
  if (!title.trim() || !content.trim()) {
    return 'Title and content are required';
  }
  return null;
};
