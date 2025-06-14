
export const processMediaContent = (content: string): string => {
  let processedContent = content;

  // YouTube video embedding - support multiple URL formats
  processedContent = processedContent.replace(
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/g,
    '<div class="video-container my-6 relative w-full" style="padding-bottom: 56.25%; height: 0;"><iframe class="absolute top-0 left-0 w-full h-full" src="https://www.youtube.com/embed/$1" frameborder="0" allowfullscreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe></div>'
  );

  // Google Drive video embedding - better URL handling
  processedContent = processedContent.replace(
    /https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)\/view\?usp=sharing/g,
    '<div class="video-container my-6 relative w-full" style="padding-bottom: 56.25%; height: 0;"><iframe class="absolute top-0 left-0 w-full h-full" src="https://drive.google.com/file/d/$1/preview" frameborder="0" allowfullscreen></iframe></div>'
  );

  processedContent = processedContent.replace(
    /https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)\/view/g,
    '<div class="video-container my-6 relative w-full" style="padding-bottom: 56.25%; height: 0;"><iframe class="absolute top-0 left-0 w-full h-full" src="https://drive.google.com/file/d/$1/preview" frameborder="0" allowfullscreen></iframe></div>'
  );

  // Google Drive image embedding - multiple formats
  processedContent = processedContent.replace(
    /https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)\/view\?usp=sharing/g,
    '<img src="https://drive.google.com/uc?export=view&id=$1" alt="Article image" class="w-full h-auto rounded-lg my-4 max-w-full" loading="lazy" onerror="this.src=\'https://drive.google.com/uc?id=$1\'" />'
  );

  // Instagram post embedding
  processedContent = processedContent.replace(
    /https:\/\/(?:www\.)?instagram\.com\/(?:p|reel)\/([a-zA-Z0-9_-]+)\/?/g,
    '<div class="instagram-container my-6 flex justify-center"><blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/p/$1/" data-instgrm-version="14" style="background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:540px; min-width:326px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"></blockquote></div>'
  );

  // Facebook video embedding
  processedContent = processedContent.replace(
    /https:\/\/(?:www\.)?facebook\.com\/.*\/videos\/([0-9]+)/g,
    '<div class="video-container my-6 relative w-full" style="padding-bottom: 56.25%; height: 0;"><iframe class="absolute top-0 left-0 w-full h-full" src="https://www.facebook.com/plugins/video.php?href=https://www.facebook.com/facebook/videos/$1&show_text=false&width=560" frameborder="0" allowfullscreen allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe></div>'
  );

  // Direct image embedding - improved with error handling
  processedContent = processedContent.replace(
    /(https?:\/\/[^\s]+\.(?:jpg|jpeg|png|gif|webp|bmp|svg))(?:\?[^\s]*)?/gi,
    '<img src="$1" alt="Article image" class="w-full h-auto rounded-lg my-4 max-w-full" loading="lazy" onerror="this.style.display=\'none\'" />'
  );

  // Vimeo embedding
  processedContent = processedContent.replace(
    /https:\/\/(?:www\.)?vimeo\.com\/([0-9]+)/g,
    '<div class="video-container my-6 relative w-full" style="padding-bottom: 56.25%; height: 0;"><iframe class="absolute top-0 left-0 w-full h-full" src="https://player.vimeo.com/video/$1" frameborder="0" allowfullscreen allow="autoplay; fullscreen; picture-in-picture"></iframe></div>'
  );

  return processedContent;
};

export const loadInstagramScript = () => {
  // Check if script is already loaded
  if (window.instgrm) {
    window.instgrm.Embeds.process();
    return;
  }

  // Load Instagram embed script
  const script = document.createElement('script');
  script.async = true;
  script.src = '//www.instagram.com/embed.js';
  script.onload = () => {
    if (window.instgrm) {
      window.instgrm.Embeds.process();
    }
  };
  document.body.appendChild(script);
};

// TypeScript declarations for Instagram embed
declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process: () => void;
      };
    };
  }
}
