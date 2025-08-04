# Telemedicine Video Conferencing App

A modern telemedicine video conferencing application built with Next.js and Tencent TRTC SDK, featuring real-time video communication between doctors and patients.

## 🚀 Features

- **Real-time Video Conferencing**: Powered by Tencent TRTC SDK for high-quality video calls
- **Role-based Access**: Separate interfaces for doctors and patients
- **Modern UI**: Built with Tailwind CSS and shadcn/ui components
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **Screenshot Functionality**: Capture and save call moments
- **Network Status Monitoring**: Real-time connection quality indicators
- **Microphone and Camera Controls**: Toggle audio/video during calls
- **Form Validation**: Robust login and invitation forms with Yup validation

## 🛠️ Tech Stack

- **Framework**: Next.js 15.4.5 with TypeScript
- **Video SDK**: Tencent TRTC SDK v5
- **UI Components**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand
- **Form Handling**: React Hook Form with Yup validation
- **Icons**: Lucide React and React Icons
- **Code Quality**: ESLint, Prettier, Husky

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ConfigButton/   # Configuration controls
│   ├── EndCallButton/  # Call termination
│   ├── MicrophoneButton/ # Audio controls
│   ├── NetworkStatus/  # Connection monitoring
│   ├── TakeScreenshotButton/ # Screenshot functionality
│   ├── VideoButton/    # Video controls
│   └── ui/            # shadcn/ui components
├── modules/           # Feature modules
│   ├── doctor-video-screen/    # Doctor interface
│   ├── login-screen/          # Authentication
│   └── patient-video-screen/  # Patient interface
├── pages/             # Next.js pages
│   ├── doctor/        # Doctor dashboard
│   ├── patient/       # Patient interface
│   └── api/          # API routes
├── stores/           # Zustand state management
├── utils/            # Utility functions
└── constants/        # Application constants
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm
- Tencent TRTC SDK credentials

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd testing-trtc
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_DEFAULT_ROOM_ID=your_room_id
# Add other TRTC SDK credentials as needed
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [https://localhost:3000](https://localhost:3000) with your browser to see the application.

## 📱 Usage

### Login Screen
- Access the application at the root URL
- Choose your role (Doctor or Patient)
- Enter your credentials to proceed

### Doctor Interface
- Navigate to `/doctor` to access the doctor's video interface
- Features include:
  - Video call controls
  - Patient invitation system
  - Screenshot capture
  - Network status monitoring

### Patient Interface
- Navigate to `/patient` to access the patient's video interface
- Features include:
  - Video call participation
  - Audio/video controls
  - Call management

## 🛠️ Available Scripts

- `npm run dev` - Start development server with Turbopack and HTTPS
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint for code quality
- `npm run format` - Format code with Prettier

## 🔧 Configuration

### Development with HTTPS
The development server runs with HTTPS enabled for testing TRTC SDK features that require secure connections.

### Code Quality
- ESLint for code linting
- Prettier for code formatting
- Husky for git hooks
- lint-staged for pre-commit checks

## 📦 Dependencies

### Core Dependencies
- **Next.js 15.4.5** - React framework
- **React 19.1.0** - UI library
- **TRTC SDK v5** - Video conferencing
- **Zustand** - State management
- **React Hook Form** - Form handling

### UI Dependencies
- **Tailwind CSS v4** - Styling
- **shadcn/ui** - Component library
- **Radix UI** - Accessible primitives
- **Lucide React** - Icons

## 🚀 Deployment

### Vercel (Recommended)
The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

1. Push your code to GitHub
2. Import your project to Vercel
3. Add environment variables
4. Deploy

### Other Platforms
Check out the [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying) for more details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is private and proprietary.

## 🆘 Support

For support and questions, please refer to:
- [Next.js Documentation](https://nextjs.org/docs)
- [TRTC SDK Documentation](https://web.sdk.qcloud.com/trtc/miniapp/doc/en/)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
