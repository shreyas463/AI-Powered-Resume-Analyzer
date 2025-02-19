# AI-Powered Resume Analyzer

A modern web application that analyzes resumes using AI to provide detailed feedback, skill analysis, and improvement suggestions. Built with Next.js, Firebase, and Tailwind CSS.

## Features

- 🚀 **Instant Resume Analysis**: Upload your resume and get immediate feedback
- 🎯 **Skill Detection**: Automatically identifies technical and soft skills
- 📊 **ATS Compatibility Check**: Ensures your resume is ATS-friendly
- 🔒 **Secure Authentication**: User authentication and data storage with Firebase
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- ✨ **Interactive UI**: Modern, clean interface with smooth animations

## Tech Stack

- **Frontend**: Next.js 13, React, TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **PDF Processing**: pdf.js
- **Deployment**: Vercel (recommended)

## Getting Started

1. Clone the repository
```bash
git clone https://github.com/shreyas463/AI-Powered-Resume-Analyzer.git
cd AI-Powered-Resume-Analyzer
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env.local` file with:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

4. Run the development server
```bash
npm run dev
```

Visit `http://localhost:3000`

## Features Explained

### Resume Analysis
- Extracts text from PDF resumes
- Analyzes skills and experience
- Provides improvement suggestions
- Calculates resume score
- Checks ATS compatibility

### Authentication
- User registration and login
- Secure password handling
- Protected routes
- User-specific data storage

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.