Live demo {https://sage-pasca-f78fed.netlify.app/}

# QuizMaster - Interactive Quiz Application

A beautifully designed, cross-platform quiz application built with Expo and React Native that works seamlessly on both mobile devices and web browsers.

## Features

- 🎯 Random questions from various categories via Open Trivia DB API
- ⏱️ Timed questions with 30-second countdown
- 📊 Real-time score tracking
- 🏆 Leaderboard system
- 🎨 Beautiful, responsive UI that works on both mobile and desktop
- 📱 Cross-platform compatibility (iOS, Android, Web)
- 🔄 Multiple difficulty levels
- 🎯 Category-based quizzes

## Tech Stack

- Expo SDK 52.0.30
- Expo Router 4.0.17
- React Native
- TypeScript
- React Native Reanimated
- Expo Linear Gradient
- Lucide React Native Icons

## Getting Started

### Prerequisites

- Node.js (v18 or newer)
- npm or yarn
- Expo CLI

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## Project Structure

```
├── app/                    # Application routes
│   ├── _layout.tsx        # Root layout
│   ├── +not-found.tsx     # 404 page
│   └── (tabs)/            # Tab-based navigation
├── components/            # Reusable components
├── constants/            # App constants
├── services/            # API and data services
├── types/               # TypeScript type definitions
└── utils/              # Helper functions
```

## Features in Detail

### Home Screen
- Featured quiz categories with beautiful imagery
- Quick access to different difficulty levels
- Statistics overview (total questions, categories, time per question)

### Quiz Screen
- Timer countdown for each question
- Real-time feedback on answers
- Score tracking system
- Progress indicator
- Category and difficulty information

### Leaderboard Screen
- Global rankings
- Personal best scores
- Recent quiz attempts
- Top 3 players highlight

## Scoring System

- Correct answer: +10 points
- Incorrect answer: -5 points
- Time limit: 30 seconds per question
- Total questions: 10 per quiz

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Open Trivia Database](https://opentdb.com/) for providing the quiz questions API
- [Pexels](https://www.pexels.com/) for the beautiful category images
- [Lucide Icons](https://lucide.dev/) for the icon set
