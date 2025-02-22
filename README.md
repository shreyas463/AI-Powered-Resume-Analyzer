# AI-Powered Resume Analyzer & Builder

A modern web application that helps users create professional resumes and analyzes them using AI to provide actionable feedback. Built with Next.js 13, TypeScript, and Tailwind CSS.

## Features

### Resume Builder
- **Multiple Professional Templates**
  - Modern: Clean design with sidebar layout
  - Professional: Traditional corporate style
  - Creative: Unique layout for creative professionals
  - Minimal: Simple and elegant design

- **Step-by-Step Form Process**
  1. Choose Template: Visual template selection with live previews
  2. Personal Information: Contact details and professional links
  3. Professional Summary: Brief career overview
  4. Work Experience: Detailed work history with achievements
  5. Education: Academic background and accomplishments
  6. Skills: Technical and professional competencies
  7. Certifications: Professional certifications and courses
  8. Preview & Download: Final review and PDF generation

- **Smart Features**
  - Real-time preview of resume changes
  - PDF generation with proper formatting
  - Multi-page support for longer resumes
  - Responsive design for all screen sizes

### Resume Analyzer
- **AI-Powered Analysis**
  - Keyword optimization suggestions
  - Industry-specific recommendations
  - ATS (Applicant Tracking System) compatibility check
  - Content improvement suggestions

- **Detailed Scoring**
  - Overall resume strength score
  - Section-by-section analysis
  - Comparison with industry standards
  - Action-oriented improvement tips

## Technical Stack

- **Frontend**
  - Next.js 13 (App Router)
  - TypeScript
  - Tailwind CSS
  - React Icons
  - HTML2Canvas & jsPDF for PDF generation

- **Backend**
  - Next.js API Routes
  - Firebase Authentication
  - Firestore Database
  - OpenAI GPT for analysis

- **Development**
  - ESLint & Prettier
  - Git version control
  - Responsive design principles
  - TypeScript strict mode

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/AI-Powered-Resume-Analyzer.git
   cd AI-Powered-Resume-Analyzer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   OPENAI_API_KEY=your_openai_api_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

1. **Create a New Resume**
   - Click "Create Resume" on the homepage
   - Choose a template that matches your style
   - Follow the step-by-step form process
   - Preview and download your resume as PDF

2. **Analyze an Existing Resume**
   - Upload your existing resume
   - Wait for the AI analysis to complete
   - Review the detailed feedback
   - Follow the suggestions to improve your resume

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- OpenAI for the GPT API
- Firebase team for the backend services
- All contributors who have helped shape this project