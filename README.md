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

- **Framework**: Next.js 16.1.4 with TypeScript
- **Video SDK**: Tencent TRTC SDK v5.15.0
- **UI Components**: shadcn/ui with Base UI primitives
- **Styling**: Tailwind CSS v4 with PostCSS
- **State Management**: Zustand v5.0.10
- **Form Handling**: React Hook Form v7.71.1 with Yup v1.6.1 validation
- **Icons**: @tabler/icons-react v3.36.1
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
│       └── generate-user-sig.ts # User signature generation
├── queries/          # React Query hooks
│   └── videoProvider/ # Video-related queries
├── schemas/          # Validation schemas
│   ├── Login.schema.ts
│   └── PatientInvitation.schema.ts
├── stores/          # Zustand state management
│   └── userInfo.store.ts
├── styles/          # Global styles
├── typings/         # TypeScript type definitions
└── utils/           # Utility functions
    ├── trtc.ts              # TRTC instance management
    ├── screenshot.ts        # Screenshot functionality
    ├── datetime.ts          # Date/time utilities
    └── ui.ts               # UI utilities
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ (required)
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
yarn install
```

3. Set up environment variables:
   Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=

SDK_APP_ID=your_sdk_app_id
SDK_SECRET_KEY=your_sdk_secret_key
```

**Note**: `SDK_APP_ID` and `SDK_SECRET_KEY` are server-side only variables (no `NEXT_PUBLIC_` prefix) as they are used in the API route for generating user signatures.

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

## 📦 Dependencies

### Core Dependencies

- **Next.js 16.1.4** - React framework with App Router
- **React 19.2.3** - UI library
- **TRTC SDK v5.15.0** - Video conferencing SDK
- **Zustand v5.0.10** - Lightweight state management
- **React Hook Form v7.71.1** - Performant form handling
- **Yup v1.6.1** - Schema validation
- **@hookform/resolvers v5.2.1** - Form validation resolvers
- **@tanstack/react-query v5.84.1** - Data fetching and caching
- **Axios v1.13.2** - HTTP client
- **dayjs v1.11.13** - Date manipulation library
- **@fontsource-variable/figtree v5.2.10** - Variable font for typography

### UI Dependencies

- **Tailwind CSS v4** - Utility-first CSS framework
- **shadcn/ui v3.7.0** - High-quality component library
- **@base-ui/react v1.1.0** - Base UI primitives
- **@tabler/icons-react v3.36.1** - Icon library
- **class-variance-authority v0.7.1** - Component variant management
- **clsx v2.1.1 & tailwind-merge v3.3.1** - Conditional styling utilities
- **sonner v2.0.7** - Toast notifications

### Development Dependencies

- **TypeScript v5** - Type safety
- **ESLint v9** - Code linting
- **eslint-config-next v16.1.4** - Next.js ESLint configuration
- **Prettier v3.6.2** - Code formatting
- **@trivago/prettier-plugin-sort-imports v6.0.2** - Import sorting
- **prettier-plugin-tailwindcss v0.7.2** - Tailwind class sorting
- **tw-animate-css v1.4.0** - Tailwind animation utilities
- **Husky v6+** - Git hooks
- **lint-staged v10+** - Pre-commit checks

## 🔒 Security Considerations

- HTTPS is required for TRTC SDK functionality
- Environment variables should be properly configured
- API keys and credentials should be kept secure
- User signatures are generated server-side for secure authentication (via `/api/generate-user-sig` endpoint)
- `SDK_APP_ID` and `SDK_SECRET_KEY` are server-side only (no `NEXT_PUBLIC_` prefix) to prevent client-side exposure
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

### v0.1.1 (Current)

- **Dependency Updates**:
  - Upgraded TRTC SDK from v5.12.0 to v5.15.0
  - Upgraded React Hook Form from v7.61.1 to v7.71.1
  - Upgraded Zustand from v5.0.7 to v5.0.10
  - Upgraded Axios from v1.11.0 to v1.13.2
  - Added dayjs v1.11.13 for date manipulation
  - Added @fontsource-variable/figtree v5.2.10 for typography
  - Added tw-animate-css v1.4.0 for Tailwind animation utilities
- **Documentation**: Updated README with accurate dependency versions and project structure

### v0.1.0

- Initial release with basic video conferencing functionality
- Features: Doctor/Patient interfaces, TRTC SDK integration, modern UI components, screenshot functionality, network monitoring, and custom hooks for enhanced user experience
