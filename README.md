# Telemedicine Video Conferencing App

A modern telemedicine video conferencing application built with Next.js and Tencent TRTC SDK, featuring real-time video communication between doctors and patients.

## 🚀 Features

- **Real-time Video Conferencing**: Powered by Tencent TRTC SDK v5 for high-quality video calls
- **Role-based Access**: Separate interfaces for doctors and patients with role-based routing
- **Modern UI**: Built with Tailwind CSS v4 and shadcn/ui components
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **Screenshot Functionality**: Capture and save call moments with automatic download
- **Network Status Monitoring**: Real-time connection quality indicators and status updates
- **Microphone and Camera Controls**: Toggle audio/video during calls with visual feedback
- **Form Validation**: Robust login and invitation forms with Yup validation schemas
- **Audio/Video Configuration**: Advanced settings for call quality optimization
- **Error Handling**: Comprehensive error states and recovery mechanisms
- **Custom Hooks**: Reusable hooks for TRTC room management, media controls, and network quality
- **User Signature Generation**: Secure user authentication with TRTC SDK integration

## 🛠️ Tech Stack

- **Framework**: Next.js 15.4.5 with TypeScript
- **Video SDK**: Tencent TRTC SDK v5.12.0
- **UI Components**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS v4 with PostCSS
- **State Management**: Zustand v5.0.7
- **Form Handling**: React Hook Form v7.61.1 with Yup v1.6.1 validation
- **Icons**: Lucide React v0.535.0
- **Code Quality**: ESLint v9, Prettier v3.6.2, Husky, lint-staged

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── AudioVideoConfigurationPanel/ # Advanced AV settings
│   ├── ConfigButton/   # Configuration controls
│   ├── DoctorVideoLayout/ # Doctor-specific video layout
│   ├── EndCallButton/  # Call termination
│   ├── ErrorState/     # Error handling components
│   ├── LoadingState/   # Loading indicators
│   ├── MediaControls/  # Audio/video control panel
│   ├── MicrophoneButton/ # Audio controls
│   ├── NetworkStatus/  # Connection monitoring
│   ├── PatientVideoLayout/ # Patient-specific video layout
│   ├── TakeScreenshotButton/ # Screenshot functionality
│   ├── VideoButton/    # Video controls
│   ├── VideoLayout/    # Generic video layout
│   └── ui/            # shadcn/ui components
├── constants/         # Application constants
├── hooks/            # Custom React hooks
│   ├── useTRTCRoom.ts      # TRTC room management
│   ├── useRemoteUsers.ts   # Remote user handling
│   ├── useMediaControls.ts # Media control logic
│   └── useNetworkQuality.ts # Network monitoring
├── libs/             # External libraries
├── models/           # TypeScript models
├── modules/          # Feature modules
│   ├── doctor-video-screen/    # Doctor interface
│   ├── login-screen/          # Authentication
│   └── patient-video-screen/  # Patient interface
├── pages/            # Next.js pages
│   ├── doctor/       # Doctor dashboard
│   ├── patient/      # Patient interface
│   └── api/         # API routes
├── schemas/          # Validation schemas
├── stores/          # Zustand state management
├── styles/          # Global styles
└── utils/           # Utility functions
    ├── generateTestUserSig.ts # User signature generation
    ├── trtc.ts              # TRTC instance management
    ├── screenshot.ts        # Screenshot functionality
    └── string.ts           # String utilities
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (recommended: Node.js 20+)
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

NEXT_PUBLIC_SDK_APP_ID=your_sdk_app_id
NEXT_PUBLIC_SDK_SECRET_KEY=your_sdk_secret_key
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

### Doctor Interface (`/doctor`)

- Navigate to `/doctor` to access the doctor's video interface
- Features include:
  - Video call controls with advanced configuration
  - Patient invitation system
  - Screenshot capture functionality
  - Network status monitoring
  - Audio/video quality settings
  - Call management and termination

### Patient Interface (`/patient`)

- Navigate to `/patient` to access the patient's video interface
- Features include:
  - Video call participation
  - Audio/video controls
  - Call management
  - Network quality indicators

## 🛠️ Available Scripts

- `npm run dev` - Start development server with Turbopack and HTTPS
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint for code quality
- `npm run format` - Format code with Prettier
- `npm run prepare` - Install Husky git hooks

## 🔧 Configuration

### Development with HTTPS

The development server runs with HTTPS enabled using `--experimental-https` flag for testing TRTC SDK features that require secure connections.

### Code Quality

- **ESLint v9** for code linting with Next.js configuration
- **Prettier v3.6.2** for code formatting with import sorting
- **Husky** for git hooks
- **lint-staged** for pre-commit checks
- **TypeScript** for type safety

### Webpack Configuration

Custom webpack configuration handles browser-specific modules and fallbacks for the TRTC SDK.

## 📦 Dependencies

### Core Dependencies

- **Next.js 15.4.5** - React framework with App Router
- **React 19.1.0** - UI library
- **TRTC SDK v5.12.0** - Video conferencing SDK
- **Zustand v5.0.7** - Lightweight state management
- **React Hook Form v7.61.1** - Performant form handling
- **Yup v1.6.1** - Schema validation
- **@hookform/resolvers v5.2.1** - Form validation resolvers

### UI Dependencies

- **Tailwind CSS v4** - Utility-first CSS framework
- **shadcn/ui** - High-quality component library
- **Radix UI** - Accessible UI primitives
- **Lucide React v0.535.0** - Beautiful icons
- **class-variance-authority** - Component variant management
- **clsx & tailwind-merge** - Conditional styling utilities

### Development Dependencies

- **TypeScript v5** - Type safety
- **ESLint v9** - Code linting
- **Prettier v3.6.2** - Code formatting
- **Husky** - Git hooks
- **lint-staged** - Pre-commit checks

## 🚀 Deployment

### Vercel (Recommended)

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

1. Push your code to GitHub
2. Import your project to Vercel
3. Add environment variables
4. Deploy

### Other Platforms

Check out the [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying) for more details.

## 🔒 Security Considerations

- HTTPS is required for TRTC SDK functionality
- Environment variables should be properly configured
- API keys and credentials should be kept secure
- User signatures are generated server-side for secure authentication
- Regular dependency updates are recommended
- TRTC SDK credentials should never be exposed in client-side code

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linting (`npm run lint && npm run format`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Submit a pull request

### Development Guidelines

- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed

## 📄 License

This project is private and proprietary.

## 🆘 Support

For support and questions, please refer to:

- [Next.js Documentation](https://nextjs.org/docs)
- [TRTC SDK Documentation](https://web.sdk.qcloud.com/trtc/miniapp/doc/en/)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Zustand Documentation](https://github.com/pmndrs/zustand)

## 🔄 Version History

- **v0.1.0** - Initial release with basic video conferencing functionality
- Features: Doctor/Patient interfaces, TRTC SDK integration, modern UI components, screenshot functionality, network monitoring, and custom hooks for enhanced user experience
