# Environment Setup Guide

This guide will help you set up the Auto Poster Hub application with the required API keys.

## Prerequisites

- Node.js 16 or higher
- npm (comes with Node.js)
- A Google account

## Step-by-Step Setup

### 1. Get Your Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/apikey)
2. Sign in with your Google account
3. Click "Create API Key" or "Get API Key"
4. Copy the generated API key (keep it secure!)
5. Keep this key private and don't share it publicly

### 2. Install and Configure

#### Option A: Automated Setup (Recommended)

**For Linux/Mac:**
```bash
bash setup.sh
```

**For Windows:**
```batch
setup.bat
```

The script will:
- Check your Node.js installation
- Install all required dependencies
- Create your `.env.local` file
- Guide you through adding your API key

#### Option B: Manual Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create environment file:
   ```bash
   cp .env.example .env.local
   ```

3. Edit `.env.local` and add your API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

### 3. Run the Application

```bash
npm run dev
```

The application will start on `http://localhost:3000`

## Environment Variables Explained

| Variable | Description | Required | Where to Get |
|----------|-------------|----------|--------------|
| `GEMINI_API_KEY` | Google Gemini API key for AI content generation | Yes | https://aistudio.google.com/apikey |

## Security Best Practices

1. **Never commit `.env.local` to version control** - It's already in `.gitignore`
2. **Don't share your API key** - Keep it private
3. **Rotate your keys regularly** - Generate new keys periodically
4. **Set API quotas** - Configure usage limits in Google Cloud Console
5. **Monitor usage** - Check your API usage in Google AI Studio

## Troubleshooting

### API Key Not Working

- Ensure there are no extra spaces before or after the key
- Verify the key is valid at https://aistudio.google.com/apikey
- Check that you haven't exceeded your API quota
- Make sure you've restarted the development server after adding the key

### File Not Found Errors

- Ensure `.env.local` is in the root directory of the project
- Check that the file isn't named `.env.local.txt` (common on Windows)
- Verify file permissions allow reading

### Build Errors

- Delete `node_modules` and run `npm install` again
- Clear the npm cache: `npm cache clean --force`
- Ensure you're using Node.js 16 or higher: `node --version`

## Getting Help

If you encounter issues:

1. Check the [Troubleshooting](#troubleshooting) section above
2. Review the [README.md](README.md) for additional information
3. Check the Gemini API documentation at https://ai.google.dev/docs
4. Open an issue on GitHub with detailed error messages

## API Costs

The Gemini API has a free tier with generous limits. For production use:

- Check current pricing at https://ai.google.dev/pricing
- Monitor your usage at https://aistudio.google.com
- Consider setting up billing alerts

## Next Steps

Once your environment is set up:

1. Run the application: `npm run dev`
2. Create your first campaign
3. Explore the AI-generated content features
4. Customize posts and schedule them
5. Export your content for social media platforms

---

**Note:** This application requires an active internet connection to communicate with the Gemini API.
