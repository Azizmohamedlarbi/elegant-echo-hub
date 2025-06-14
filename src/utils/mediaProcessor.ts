
export const processMediaContent = (content: string): string => {
  let processedContent = content;

  // YouTube video embedding - support multiple URL formats with better native appearance
  processedContent = processedContent.replace(
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/g,
    '<div class="video-embed my-6 rounded-lg overflow-hidden shadow-lg"><div class="relative w-full" style="padding-bottom: 56.25%; height: 0;"><iframe class="absolute top-0 left-0 w-full h-full" src="https://www.youtube.com/embed/$1" frameborder="0" allowfullscreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" loading="lazy"></iframe></div></div>'
  );

  // Google Drive video embedding - improved handling
  processedContent = processedContent.replace(
    /https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)\/view(?:\?usp=sharing)?/g,
    '<div class="video-embed my-6 rounded-lg overflow-hidden shadow-lg"><div class="relative w-full" style="padding-bottom: 56.25%; height: 0;"><iframe class="absolute top-0 left-0 w-full h-full" src="https://drive.google.com/file/d/$1/preview" frameborder="0" allowfullscreen loading="lazy"></iframe></div></div>'
  );

  // Google Drive image embedding - better native appearance
  processedContent = processedContent.replace(
    /https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)\/view(?:\?usp=sharing)?/g,
    '<div class="image-embed my-6 flex justify-center"><img src="https://drive.google.com/uc?export=view&id=$1" alt="Article image" class="max-w-full h-auto rounded-lg shadow-md" loading="lazy" onerror="this.src=\'https://drive.google.com/uc?id=$1\'; this.onerror=null;" /></div>'
  );

  // Instagram post embedding - native appearance
  processedContent = processedContent.replace(
    /https:\/\/(?:www\.)?instagram\.com\/(?:p|reel)\/([a-zA-Z0-9_-]+)\/?/g,
    '<div class="social-embed my-6 flex justify-center"><blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/p/$1/" data-instgrm-version="14" style="background:#FFF; border:0; border-radius:12px; box-shadow:0 4px 12px 0 rgba(0,0,0,0.15); margin: 1px; max-width:540px; min-width:326px; padding:0; width:99.375%;"></blockquote></div>'
  );

  // Facebook video embedding - improved native look
  processedContent = processedContent.replace(
    /https:\/\/(?:www\.)?facebook\.com\/.*\/videos\/([0-9]+)/g,
    '<div class="video-embed my-6 rounded-lg overflow-hidden shadow-lg"><div class="relative w-full" style="padding-bottom: 56.25%; height: 0;"><iframe class="absolute top-0 left-0 w-full h-full" src="https://www.facebook.com/plugins/video.php?href=https://www.facebook.com/facebook/videos/$1&show_text=false&width=560" frameborder="0" allowfullscreen allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" loading="lazy"></iframe></div></div>'
  );

  // Direct image embedding - enhanced native appearance
  processedContent = processedContent.replace(
    /(https?:\/\/[^\s]+\.(?:jpg|jpeg|png|gif|webp|bmp|svg))(?:\?[^\s]*)?/gi,
    '<div class="image-embed my-6 flex justify-center"><img src="$1" alt="Article image" class="max-w-full h-auto rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200" loading="lazy" onerror="this.style.display=\'none\'" /></div>'
  );

  // Vimeo embedding - native appearance
  processedContent = processedContent.replace(
    /https:\/\/(?:www\.)?vimeo\.com\/([0-9]+)/g,
    '<div class="video-embed my-6 rounded-lg overflow-hidden shadow-lg"><div class="relative w-full" style="padding-bottom: 56.25%; height: 0;"><iframe class="absolute top-0 left-0 w-full h-full" src="https://player.vimeo.com/video/$1" frameborder="0" allowfullscreen allow="autoplay; fullscreen; picture-in-picture" loading="lazy"></iframe></div></div>'
  );

  // Process markdown-style formatting for better text editing
  processedContent = processedContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  processedContent = processedContent.replace(/(?<!\*)\*([^*\n]+)\*/g, '<em>$1</em>');
  processedContent = processedContent.replace(/<u>(.*?)<\/u>/g, '<u>$1</u>');
  
  // Process headings
  processedContent = processedContent.replace(/^### (.+)$/gm, '<h3 class="text-xl font-semibold mt-6 mb-3">$1</h3>');
  processedContent = processedContent.replace(/^## (.+)$/gm, '<h2 class="text-2xl font-semibold mt-8 mb-4">$1</h2>');
  processedContent = processedContent.replace(/^# (.+)$/gm, '<h1 class="text-3xl font-bold mt-10 mb-5">$1</h1>');
  
  // Process lists
  processedContent = processedContent.replace(/^- (.+)$/gm, '<li class="ml-4">• $1</li>');
  processedContent = processedContent.replace(/^(\d+)\. (.+)$/gm, '<li class="ml-4">$1. $2</li>');
  
  // Process quotes
  processedContent = processedContent.replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-gray-300 pl-4 italic my-4 text-gray-700">$1</blockquote>');

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
