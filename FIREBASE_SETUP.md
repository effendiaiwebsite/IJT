# Firebase Setup Guide

This guide will help you set up Firebase for the IJT Exam Preparation Platform with authentication and student progress tracking.

## Prerequisites

- A Google account
- Node.js and npm installed
- The IJT app codebase

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter your project name (e.g., "IJT Exam Platform")
4. (Optional) Enable Google Analytics if you want usage insights
5. Click "Create project"

## Step 2: Register Your Web App

1. In the Firebase Console, click the **Web icon** (`</>`) to add a web app
2. Enter an app nickname (e.g., "IJT Web App")
3. Check "Also set up Firebase Hosting" if you plan to deploy on Firebase Hosting
4. Click "Register app"
5. You'll see your Firebase configuration object - **keep this page open**, you'll need these values

## Step 3: Configure Environment Variables

1. In your project root, copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and fill in your Firebase configuration values from Step 2:
   ```env
   VITE_FIREBASE_API_KEY=your-actual-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   ```

3. **IMPORTANT**: Never commit your `.env` file to version control. It's already in `.gitignore`.

## Step 4: Enable Authentication

1. In Firebase Console, go to **Build** ’ **Authentication**
2. Click "Get started"
3. Enable **Email/Password** authentication:
   - Click "Email/Password"
   - Toggle "Enable"
   - Click "Save"

4. Enable **Google** authentication:
   - Click "Google"
   - Toggle "Enable"
   - Select a support email
   - Click "Save"

5. (Optional) Enable **Phone** authentication if needed

## Step 5: Set Up Firestore Database

1. In Firebase Console, go to **Build** ’ **Firestore Database**
2. Click "Create database"
3. Select **Start in production mode** (we'll add security rules next)
4. Choose a Cloud Firestore location (closest to your users)
5. Click "Enable"

## Step 6: Deploy Firestore Security Rules

1. The security rules are defined in `firestore.rules` in the project root
2. In Firebase Console, go to **Firestore Database** ’ **Rules**
3. Copy the contents of `firestore.rules` and paste it into the editor
4. Click "Publish"

Alternatively, if you have Firebase CLI installed:
```bash
firebase deploy --only firestore:rules
```

### Understanding the Security Rules

The rules ensure:
- Users can only read/write their own data
- Each user has a profile document at `/users/{userId}`
- Progress is stored at `/users/{userId}/progress/{examId}`
- Chapter progress is stored at `/users/{userId}/progress/{examId}/chapters/{chapterId}`
- No user can delete their profile (only update)

## Step 7: Set Up Storage (Optional)

If you need to store user profile images or other files:

1. In Firebase Console, go to **Build** ’ **Storage**
2. Click "Get started"
3. Choose security rules mode (start in production mode)
4. Choose a storage location
5. Click "Done"

## Step 8: Test the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to the signup page: `http://localhost:5173/signup`

3. Create a test account:
   - Enter name, email, and password
   - Click "Create Account"
   - You should be redirected to the profile page

4. Verify in Firebase Console:
   - Go to **Authentication** ’ **Users**
   - You should see your test user
   - Go to **Firestore Database** ’ **Data**
   - You should see a `users` collection with your user document

5. Test Google Sign-In:
   - Go to login page: `http://localhost:5173/login`
   - Click "Sign in with Google"
   - Complete the Google auth flow
   - You should be logged in

## Step 9: Test Progress Tracking

1. Log in to your account
2. Navigate to an exam journey (e.g., `/exam/ssc-mts/journey`)
3. Start a tutorial
4. Complete the tutorial
5. Take a chapter test
6. Check Firebase Console ’ Firestore Database:
   - Navigate to `users/{your-uid}/progress/ssc-mts/chapters`
   - You should see chapter progress documents

## Database Structure

```
users/
  {userId}/
    - email: string
    - displayName: string
    - photoURL: string | null
    - createdAt: timestamp
    - lastActive: timestamp

    progress/
      {examId}/
        - examId: string
        - examName: string
        - startedAt: timestamp
        - lastAccessedAt: timestamp
        - totalTimeSpent: number (minutes)

        chapters/
          {chapterId}/
            - chapterId: string
            - chapterName: string
            - subjectId: string
            - tutorialCompleted: boolean
            - tutorialCompletedAt: timestamp | null
            - testsAttempted: number
            - bestScore: number (percentage)
            - lastAttemptScore: number (percentage)
            - lastAttemptAt: timestamp | null
            - timeSpent: number (minutes)
            - notes: string
```

## Troubleshooting

### "Firebase not initialized" error
- Check that your `.env` file exists and has the correct values
- Restart your development server after creating/modifying `.env`

### "Permission denied" errors
- Verify your Firestore security rules are deployed
- Make sure the user is authenticated
- Check browser console for detailed error messages

### Google Sign-In popup blocked
- Enable popups for localhost in your browser
- Check that Google auth is enabled in Firebase Console

### User data not saving
- Open browser DevTools ’ Network tab
- Check for failed Firestore requests
- Verify security rules allow the operation
- Check browser console for error messages

## Production Deployment

Before deploying to production:

1. **Update security rules** if needed for your use case
2. **Set up Firebase Hosting** (optional):
   ```bash
   firebase init hosting
   npm run build
   firebase deploy
   ```

3. **Configure authorized domains**:
   - Go to Firebase Console ’ Authentication ’ Settings ’ Authorized domains
   - Add your production domain

4. **Environment variables**:
   - Set production environment variables on your hosting platform
   - Never expose `.env` file in production

5. **Enable additional security**:
   - Set up App Check to prevent abuse
   - Monitor usage in Firebase Console
   - Set up budget alerts

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [React + Firebase Guide](https://firebase.google.com/docs/web/setup)

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Review Firebase Console for quota/billing issues
3. Verify all steps in this guide
4. Check Firebase Status page for outages

---

**Note**: Firebase has a generous free tier (Spark Plan) that should be sufficient for development and small-scale production use. Monitor your usage in the Firebase Console.
