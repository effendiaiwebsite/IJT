# IJT React App - Project Setup Summary

**Created:** 2025-11-26
**Status:** Step 1 Complete ✅

---

## 📦 Project Structure

```
ijt-app/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── common/          (Button, Card, ProgressBar, Loader, Modal)
│   │   ├── navigation/      (BottomNav, Header, BackButton)
│   │   ├── exam/            (ExamCard, ExamList, ExamDetails)
│   │   ├── learning/        (SubjectCard, ChapterCard, TutorialSlide, etc.)
│   │   └── profile/         (StatsCard, AchievementBadge, ProgressChart)
│   ├── pages/
│   │   ├── SplashScreen.jsx
│   │   ├── LevelSelection.jsx
│   │   ├── ExamList.jsx
│   │   ├── ExamDetails.jsx
│   │   ├── LearningJourney.jsx
│   │   ├── ChapterList.jsx
│   │   ├── TutorialViewer.jsx
│   │   ├── ChapterTest.jsx
│   │   ├── TestResults.jsx
│   │   ├── SolutionsView.jsx
│   │   └── ProfileDashboard.jsx
│   ├── contexts/            (AuthContext, ExamContext, ProgressContext)
│   ├── services/            (firebase.js, authService, examService, etc.)
│   ├── utils/               (constants, helpers, validators)
│   ├── hooks/               (useAuth, useExam, useProgress, useTimer)
│   ├── App.jsx              (Main app with routing)
│   ├── main.jsx
│   └── index.css            (Tailwind CSS)
├── .env                     (Environment variables - DO NOT COMMIT)
├── .env.example             (Template for environment variables)
├── .gitignore
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
└── package.json
```

---

## 🛠️ Tech Stack

### Core
- **React** 18+ (Functional components with hooks)
- **Vite** (Build tool and dev server)
- **React Router** v6 (Client-side routing)

### Styling
- **Tailwind CSS** (Utility-first CSS framework)
- **PostCSS** (CSS processing)
- **Autoprefixer** (Browser compatibility)

### Animation
- **Framer Motion** (Smooth animations and transitions)

### Icons
- **React Icons** (Icon library)

### Backend
- **Firebase** (Authentication, Firestore, Storage)

---

## 🎨 Tailwind Custom Configuration

### Custom Colors
```javascript
primary: #2563EB (Blue)
secondary: #10B981 (Green)
accent: #F59E0B (Orange)
error: #EF4444 (Red)
```

### Custom Utilities
- `.touch-target` - Minimum 44px touch area
- `.card` - White background with rounded corners and shadow
- `.card-hover` - Hover effect for cards

### Custom Fonts
- **Heading:** Poppins, Inter
- **Body:** Inter, system-ui

---

## 🔗 Routes Structure

```
/                           → SplashScreen
/select-level               → LevelSelection
/exams/:level               → ExamList
/exam/:examId               → ExamDetails
/exam/:examId/journey       → LearningJourney
/exam/:examId/subject/:subjectId → ChapterList
/exam/:examId/subject/:subjectId/chapter/:chapterId/tutorial → TutorialViewer
/exam/:examId/subject/:subjectId/chapter/:chapterId/test → ChapterTest
/exam/:examId/subject/:subjectId/chapter/:chapterId/results → TestResults
/exam/:examId/subject/:subjectId/chapter/:chapterId/solutions → SolutionsView
/profile                    → ProfileDashboard
```

---

## 🔥 Firebase Configuration

### Environment Variables Required

Create a `.env` file in the root directory with:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

Get these from Firebase Console → Project Settings → General

---

## 🚀 Development Commands

### Install dependencies
```bash
npm install
```

### Start development server
```bash
npm run dev
```
App will run at: http://localhost:5173/

### Build for production
```bash
npm run build
```

### Preview production build
```bash
npm run preview
```

---

## 📝 Next Steps

1. **Step 2:** Create core components (Button, Card, ProgressBar, Loader, Modal, Navigation)
2. **Step 3:** Build Splash Screen with animation
3. **Step 4:** Build Level Selection screen with data loading
4. **Step 5:** Build Exam List with search and filtering
5. Continue through remaining steps...

---

## 📚 Documentation References

- **React:** https://react.dev
- **Vite:** https://vitejs.dev
- **React Router:** https://reactrouter.com
- **Tailwind CSS:** https://tailwindcss.com
- **Framer Motion:** https://www.framer.com/motion/
- **Firebase:** https://firebase.google.com/docs

---

## 🎯 Current Status

✅ **Step 1 Complete** - Project setup and foundation ready
⏳ **Next:** Step 2 - Core Components & Layout

**Overall Progress:** 4% (1/26 steps complete)
