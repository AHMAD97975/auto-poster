import { GoogleGenAI, Type } from "@google/genai";
import { Post, ReferenceImageType } from "../types";

// Lazy initialization of Gemini Client with singleton pattern
let aiInstance: GoogleGenAI | null = null;

const getAI = () => {
  if (!aiInstance) {
    const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("API Key is required. Please set API_KEY or GEMINI_API_KEY in your environment.");
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
};

export const generateCampaignContent = async (
  title: string,
  topic: string,
  targetAudience: string,
  days: number,
  postsPerDay: number,
  platforms: string[],
  referenceImage?: string,
  referenceImageType?: ReferenceImageType
): Promise<Post[]> => {
  const totalPosts = days * postsPerDay;
  const platformsStr = platforms.join(", ");

  let imageContextInstruction = "";
  if (referenceImage && referenceImageType) {
    switch (referenceImageType) {
        case 'logo':
            imageContextInstruction = "The attached image is the BRAND LOGO. Ensure the generated image prompts explicitly mention 'incorporating the brand colors and style shown in the logo'.";
            break;
        case 'character':
            imageContextInstruction = "The attached image is the MAIN CHARACTER/MASCOT. The generated image prompts MUST describe this character in detail so it appears in every post image.";
            break;
        case 'business':
            imageContextInstruction = "The attached image is the BUSINESS ENVIRONMENT/OFFICE. Use this as the aesthetic setting for the content.";
            break;
        case 'expressive':
            imageContextInstruction = "The attached image is the ARTISTIC VIBE. Use its mood, lighting, and style as the main inspiration for all generated image prompts.";
            break;
        default:
            imageContextInstruction = "Use the attached image as a general visual reference for the style.";
    }
  }

  const promptText = `
    You are an expert social media manager and growth hacker acting as the 'Content Engine'.
    
    CAMPAIGN DETAILS:
    - Campaign Title: "${title}"
    - Core Topic: "${topic}"
    - Target Audience: "${targetAudience}"
    - Target Platforms: ${platformsStr}
    
    VISUAL CONTEXT:
    ${imageContextInstruction}
    
    TASK:
    Generate a content plan of exactly ${totalPosts} posts optimized for VIRALITY and TREND ALGORITHMS.
    
    IMPORTANT GUIDELINES:
    1. Language: Arabic (اللغة العربية).
    2. Trend Optimization: 
       - Start with a "Hook" (Grab attention in the first 3 seconds).
       - Use short, punchy sentences.
       - End with a Call to Action (CTA) or a question to drive comments (Engagement).
       - Focus on value, emotion, or entertainment.
    3. Hashtags: Include 5-10 high-traffic, relevant trending hashtags for each post.
    4. Images: Provide a creative, high-quality AI image generation prompt in English.
       ${referenceImage ? "CRITICAL: The image prompt MUST be influenced by the attached reference image as per the instructions above." : ""}
  `;

  const parts: any[] = [{ text: promptText }];

  if (referenceImage) {
      const [header, base64Data] = referenceImage.split(',');
      const mimeType = header.split(':')[1].split(';')[0];
      
      parts.push({
          inlineData: {
              mimeType: mimeType,
              data: base64Data
          }
      });
  }

  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts: parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              day: { type: Type.INTEGER, description: "Day number (1 to N)" },
              title: { type: Type.STRING, description: "Catchy headline/Hook in Arabic" },
              content: { type: Type.STRING, description: "Main post content in Arabic (optimized for engagement)" },
              hashtags: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of 5-10 trending Arabic hashtags" },
              imagePrompt: { type: Type.STRING, description: "Detailed AI image generation prompt in English." }
            },
            required: ["day", "title", "content", "hashtags", "imagePrompt"]
          }
        }
      }
    });

    if (response.text) {
      const rawPosts = JSON.parse(response.text);
      return rawPosts.map((p: any, index: number) => ({
        id: `post-${Date.now()}-${index}`,
        day: p.day,
        title: p.title,
        content: p.content,
        hashtags: p.hashtags || [],
        imagePrompt: p.imagePrompt,
        status: 'pending',
        scheduledTime: new Date(Date.now() + (p.day * 24 * 60 * 60 * 1000)).toISOString()
      }));
    }
    return [];
  } catch (error) {
    console.error("Failed to generate campaign content:", error);
    throw new Error("فشل المحرك في توليد المنشورات.");
  }
};

export const generatePostImage = async (prompt: string, referenceImage?: string): Promise<string | null> => {
  try {
    const parts: any[] = [{ text: prompt }];

    if (referenceImage) {
      const [header, base64Data] = referenceImage.split(',');
      const mimeType = header.split(':')[1].split(';')[0];
      parts.push({
        inlineData: {
          mimeType: mimeType,
          data: base64Data
        }
      });
    }

    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: parts
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image generation failed:", error);
    throw error;
  }
};