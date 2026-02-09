# NEXUS Training Generator - Frontend

React frontend for NEXUS Training Generator that connects to the Flask backend API.

## 📋 Prerequisites

1. **Backend deployed** to Hugging Face Spaces
2. **Backend URL** (e.g., `https://YOUR_USERNAME-nexus-backend.hf.space`)

## 🚀 Deploy to Vercel

### Step 1: Configure Backend URL

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and replace with your actual backend URL:
   ```
   REACT_APP_API_URL=https://YOUR_USERNAME-nexus-backend.hf.space
   ```

### Step 2: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### Step 3: Deploy to Vercel

1. Go to https://vercel.com
2. Click **"Add New"** → **"Project"**
3. **Import** your GitHub repository
4. Vercel will auto-detect it's a **Create React App**
5. **Add Environment Variable:**
   - Key: `REACT_APP_API_URL`
   - Value: Your HF Spaces backend URL
6. Click **"Deploy"**

### Step 4: Enable CORS on Backend

Make sure your Flask backend (`app.py`) has CORS enabled:

```python
from flask_cors import CORS
app = Flask(__name__)
CORS(app)  # This should already be there
```

## 🧪 Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm start

# Build for production
npm run build
```

## 📁 Project Structure

```
nexus-frontend/
├── public/
│   └── index.html
├── src/
│   ├── App.js          # Main component
│   ├── App.css         # Styles
│   ├── index.js        # Entry point
│   └── index.css       # Global styles
├── package.json
├── .env.example
├── .gitignore
└── README.md
```

## 🔧 Troubleshooting

### CORS Errors
**Problem:** "Access to fetch at ... has been blocked by CORS policy"

**Solution:** 
1. Verify CORS is enabled in backend `app.py`
2. Check backend is running at the URL in `.env`
3. In Vercel, verify environment variable is set

### API Not Found
**Problem:** "Failed to generate content" or 404 errors

**Solution:**
1. Check backend URL is correct in Vercel environment variables
2. Test backend directly: `https://YOUR_BACKEND_URL/api/health`
3. Redeploy Vercel after changing environment variables

### Build Fails on Vercel
**Problem:** "npm install failed" or "build failed"

**Solution:**
1. Delete `node_modules` and `package-lock.json` locally
2. Run `npm install` to regenerate
3. Commit and push
4. Redeploy on Vercel

## 🌐 Architecture

```
User Browser
     ↓
React Frontend (Vercel)
     ↓ API calls
Flask Backend (HF Spaces)
     ↓
NEXUS Logic (Python)
```

## 📝 Environment Variables

Required in Vercel:

| Variable | Value | Example |
|----------|-------|---------|
| `REACT_APP_API_URL` | Your backend URL | `https://user-nexus.hf.space` |

## 🎨 Customization

To customize the UI:
- Edit colors in `src/index.css` (gradient background)
- Modify component styles in `src/App.css`
- Update layout in `src/App.js`

## 📄 License

MIT
