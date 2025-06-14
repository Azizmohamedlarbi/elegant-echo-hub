
export const extractThumbnail = (mediaUrl: string): string | null => {
  if (!mediaUrl) return null;

  // YouTube thumbnail extraction
  const youtubeMatch = mediaUrl.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (youtubeMatch) {
    return `https://img.youtube.com/vi/${youtubeMatch[1]}/maxresdefault.jpg`;
  }

  // Google Drive image thumbnail
  const driveMatch = mediaUrl.match(/https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)\/view/);
  if (driveMatch) {
    return `https://drive.google.com/uc?export=view&id=${driveMatch[1]}`;
  }

  // Direct image URLs - return as is
  const imageExtensions = /\.(jpg|jpeg|png|gif|webp|bmp|svg)(\?.*)?$/i;
  if (imageExtensions.test(mediaUrl)) {
    return mediaUrl;
  }

  // For other URLs, return null (no thumbnail available)
  return null;
};
