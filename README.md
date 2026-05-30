# IELTS Master AI - Premium AI-Powered Learning Platform

A modern, glassmorphic web application for IELTS exam preparation with integrated AI tutoring, speech recognition, and personalized learning.

## Features

✨ **AI-Powered Learning**
- Real-time AI grading for Writing and Speaking
- Intelligent brainstorming and outline generation
- AI Speaking partner for free conversation practice
- Auto-correction with detailed feedback

🎤 **Audio & Speech**
- Built-in microphone for speaking practice
- Audio visualization during recording
- Automatic speech-to-text transcription
- Text-to-speech model answers playback

📚 **Smart Dictionary**
- Hover-based vocabulary lookup
- Instant Vietnamese translations
- Usage examples in context
- Works across all content

🎯 **Adaptive Learning**
- 6 CEFR proficiency levels (A1-C2)
- Level-based content difficulty adjustment
- Personalized AI responses
- Progress tracking and scoring

💎 **Beautiful Design**
- Liquid glass morphism effects
- Animated gradient backgrounds
- Smooth transitions and interactions
- Fully responsive layout

## Tech Stack

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **UI Components**: Lucide React Icons
- **AI Integration**: Google Gemini API
- **Languages**: TypeScript, React
- **Deployment**: Vercel

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/thichdoraemon74-spec/hocielts.git
   cd hocielts
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Add your Gemini API key:
   ```
   NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
npm run build
npm start
```

## Deployment on Vercel

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import `thichdoraemon74-spec/hocielts`
   - Add environment variable `NEXT_PUBLIC_GEMINI_API_KEY`
   - Click Deploy

## Project Structure

```
hocielts/
├── src/
│   ├── app/
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Home page
│   │   └── globals.css       # Global styles
│   └── components/
│       └── IELTSApp.tsx      # Main app component
├── public/                    # Static assets
├── next.config.js           # Next.js config
├── tailwind.config.js       # Tailwind config
├── postcss.config.js        # PostCSS config
├── tsconfig.json            # TypeScript config
├── package.json             # Dependencies
└── README.md               # This file
```

## Features in Detail

### Writing Module
- Customize writing topics (default/manual/AI-generated)
- Real-time word count
- AI sentence rewriting suggestions
- Comprehensive grading with IELTS band scores
- Detailed feedback on all criteria

### Speaking Module
- Cue card-based speaking practice
- Live microphone recording
- Audio visualization
- Automatic speech transcription
- Speaking grading with pronunciation tips

### Chat Module
- Free conversation with AI tutor
- Real-time grammar correction
- Vocabulary suggestions
- Overall conversation grading

### Dictionary
- Select any text to see translation
- Vietnamese definitions
- Example sentences
- Pronunciation guidance

## Keyboard Shortcuts

- `Enter` in chat to send message
- Click microphone icon to toggle recording
- Select text anywhere to see dictionary

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Troubleshooting

**Microphone not working?**
- Check browser microphone permissions
- Ensure you're using HTTPS (required for Web Audio API)
- Try a different browser

**AI responses slow?**
- Check internet connection
- Verify Gemini API quota
- Try again after a few seconds

**Dictionary not appearing?**
- Make sure you have selected text
- Text must be 5 words or less
- Wait for the popup to appear

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- GitHub Issues: [Create Issue](https://github.com/thichdoraemon74-spec/hocielts/issues)
- Email: thichdoraemon74@gmail.com

## Future Enhancements

- [ ] Multiple question types for Writing
- [ ] Listening practice module
- [ ] Reading comprehension exercises
- [ ] Mock full IELTS exam
- [ ] Study group features
- [ ] Mobile native app
- [ ] Offline mode support
- [ ] Advanced analytics dashboard

---

Built with ❤️ by thichdoraemon74-spec
