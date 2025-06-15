
export const extractThumbnail = (mediaUrl: string): string | null => {
  console.log('Extracting thumbnail for URL:', mediaUrl);
  
  if (!mediaUrl) return null;

  // YouTube thumbnail extraction
  const youtubeMatch = mediaUrl.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (youtubeMatch) {
    const thumbnail = `https://img.youtube.com/vi/${youtubeMatch[1]}/maxresdefault.jpg`;
    console.log('YouTube thumbnail extracted:', thumbnail);
    return thumbnail;
  }

  // Google Drive image thumbnail - handle various formats
  // Pattern 1: https://drive.google.com/file/d/FILE_ID/view
  let driveMatch = mediaUrl.match(/https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)\/view/);
  
  // Pattern 2: https://drive.google.com/open?id=FILE_ID
  if (!driveMatch) {
    driveMatch = mediaUrl.match(/https:\/\/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/);
  }
  
  // Pattern 3: Already in uc format: https://drive.google.com/uc?id=FILE_ID or https://drive.google.com/uc?export=view&id=FILE_ID
  if (!driveMatch) {
    driveMatch = mediaUrl.match(/https:\/\/drive\.google\.com\/uc\?(?:export=view&)?id=([a-zA-Z0-9_-]+)/);
  }

  if (driveMatch) {
    const fileId = driveMatch[1];
    const thumbnail = `https://drive.google.com/thumbnail?id=${fileId}&sz=w400-h300-c`;
    console.log('Google Drive thumbnail extracted:', thumbnail, 'from file ID:', fileId);
    return thumbnail;
  }

  // Direct image URLs - return as is
  const imageExtensions = /\.(jpg|jpeg|png|gif|webp|bmp|svg)(\?.*)?$/i;
  if (imageExtensions.test(mediaUrl)) {
    console.log('Direct image URL detected:', mediaUrl);
    return mediaUrl;
  }

  console.log('No thumbnail could be extracted for URL:', mediaUrl);
  // For other URLs, return null (no thumbnail available)
  return null;
};
