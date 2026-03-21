# StudentSync Build Prompt

Build a comprehensive, AI-powered student life management platform called **StudentSync** using **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, and **ShadCN UI**.

### Core Architecture
- **Authentication**: Firebase Auth (Email/Google).
- **Database**: Firebase Firestore for notifications/real-time data; LocalStorage for guest session persistence.
- **AI Integration**: Google Genkit with Gemini models for all intelligent features.
- **UI Style**: Modern professional interface with glass-morphism effects, sidebar navigation, and a focus on HSL-based semantic colors (Purple/Indigo primary).

### Key Modules to Implement:

#### 1. AI Study Planner
- **Logic**: A form taking course deadlines, priorities, and study duration.
- **AI Task**: Use Genkit to generate a structured study timetable.
- **Feature**: Export the resulting schedule to a formatted PDF using `jsPDF`.
- **Integration**: Automatically create system reminders based on generated study blocks.

#### 2. Smart Expense Management
- **Manual Tracking**: Full CRUD for income and expenses with categories.
- **AI Receipt Scanner**: Genkit flow to extract merchant, amount, type, and category from uploaded images or UPI screenshots.
- **Analytics**: Use `Recharts` to show a horizontal Bar Chart for expenses and a Donut Chart for income categories.

#### 3. Precision Attendance Calculator
- **Per-Subject Logic**: Track Theory, Practical, and Extra-Curricular subjects.
- **Thresholds**: Calculate exact classes needed to reach 75%, 85%, and 95%.
- **"Can Bunk" Logic**: Calculate the maximum number of classes a student can miss while staying above 75%.
- **UI**: Interactive table with real-time totals.

#### 4. AI Well-being Support
- **Support Flow**: AI analyzes stress levels (1-10), sleep quality, and activity to provide 2-3 sentences of empathetic feedback.
- **TTS**: Convert AI feedback into playable audio using Gemini's Text-to-Speech (Algenib voice).
- **Mentor Chat**: A persistent chatbot flow for academic and health advice using conversation history.

#### 5. Dashboard & Notifications
- **AI Tips**: A component that triggers an AI flow to generate 3-4 personalized "Student Success" tips based on current expenses and pending reminders.
- **Notification Center**: Real-time Firestore-backed system for alerts.
- **Reminders**: A centralized task manager accessible across the app.

### Technical Requirements:
- Use `lucide-react` for icons.
- Implement a custom loader with a PT Sans font theme.
- Ensure responsive design for mobile and desktop.
- Strictly separate Server Actions for AI flows from Client Components for the UI.