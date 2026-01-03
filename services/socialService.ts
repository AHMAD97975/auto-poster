import { Post } from "../types";

/**
 * Handles the logic for sharing content to various social platforms.
 * Since direct API posting requires a backend for secrets, we use Web Intents
 * and Clipboard/Download actions to simulate a smooth "Assistant" experience.
 */

export const shareContent = async (platform: string, post: Post) => {
    const text = post.content;
    const tags = post.hashtags ? `\n\n${post.hashtags.join(' ')}` : '';
    const fullText = `${text}${tags}`;
    const encodedText = encodeURIComponent(fullText);
    const currentUrl = encodeURIComponent(window.location.href); 

    // Helper to download image
    const downloadImage = () => {
        if (post.imageUrl) {
            const link = document.createElement('a');
            link.href = post.imageUrl;
            link.download = `autoposter-${post.id}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            return true;
        }
        return false;
    };

    // Helper to copy text
    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(fullText);
            return true;
        } catch (err) {
            console.error('Failed to copy text', err);
            return false;
        }
    };

    switch (platform.toLowerCase()) {
        case 'twitter':
        case 'x':
            // Twitter supports text pre-filling via URL
            if (post.imageUrl) downloadImage();
            window.open(`https://twitter.com/intent/tweet?text=${encodedText}`, '_blank');
            break;

        case 'linkedin':
            // LinkedIn does not support pre-filling text via URL anymore (only URL).
            // Strategy: Copy text -> Open LinkedIn Feed
            await copyToClipboard();
            if (post.imageUrl) downloadImage();
            alert("تم نسخ النص وتجهيز الصورة! \nقم بلصق النص (Ctrl+V) ورفع الصورة في نافذة لينكد إن التي ستفتح الآن.");
            window.open(`https://www.linkedin.com/feed/`, '_blank');
            break;

        case 'facebook':
            // Facebook strictly forbids pre-filling text.
            // Strategy: Open Composer
            if (post.imageUrl) downloadImage();
            await copyToClipboard();
            alert("تم نسخ النص! \nفيسبوك لا يسمح بالتعبئة التلقائية. قم بلصق النص ورفع الصورة يدوياً.");
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`, '_blank');
            break;
        
        case 'instagram':
             // Instagram is mobile-first and doesn't have a web intent for posting.
             if (post.imageUrl) downloadImage();
             await copyToClipboard();
             alert("تم نسخ النص وتنزيل الصورة.\nيرجى النشر عبر تطبيق الهاتف أو أدوات إدارة انستجرام.");
             break;

        default:
            // Generic fallback
             await copyToClipboard();
             alert(`تم نسخ النص للحافظة.`);
             break;
    }
    
    return true;
};