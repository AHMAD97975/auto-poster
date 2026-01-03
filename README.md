<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1YwHuGuyA9P-qgqyMRxnW08Gr8tdDYiJz

## Run Locally

**Prerequisites:**  Node.js (version 16 or higher)

### Quick Setup (Recommended)

Run the automated setup script:
```bash
bash setup.sh
```

This will:
- Install all dependencies
- Create your `.env.local` file from the template
- Guide you through the API key setup

### Manual Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up your Gemini API Key:**
   
   a. Get your API key from Google AI Studio: https://aistudio.google.com/apikey
   
   b. Copy the `.env.example` file to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   
   c. Open `.env.local` and replace `your_gemini_api_key_here` with your actual Gemini API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

3. **Run the app:**
   ```bash
   npm run dev
   ```
   
   The app will be available at `http://localhost:3000`

### Environment Variables

- `GEMINI_API_KEY` - Your Google Gemini API key (required)
  - Get it from: https://aistudio.google.com/apikey
  - Used for AI content generation and image creation

### Troubleshooting

**Issue: "Failed to generate campaign content"**
- Make sure your `GEMINI_API_KEY` is correctly set in `.env.local`
- Verify your API key is valid at https://aistudio.google.com/apikey
- Check that you have quota remaining on your Gemini API account

**Issue: Environment variables not loading**
- Ensure the file is named exactly `.env.local` (not `.env.local.txt`)
- Restart the development server after changing environment variables
- Make sure you're in the correct directory when running `npm run dev`

**Windows Users:**
- Use `setup.bat` instead of `setup.sh`
- Or manually copy `.env.example` to `.env.local` using File Explorer
