# Timeline — HR Employee Lifecycle Tracker

A simple, distinctive employee lifecycle and milestone tracker for a single
HR/employer user. React + Firebase, bilingual Arabic/English with RTL,
deployed to GitHub Pages via GitHub Actions (no terminal needed after the
initial setup below).

**This is Phase 1 of the build:** Firebase connection, Authentication,
Firestore, Employee List, Add Employee, and the live Employment Counter.
Probation decisions, the visual Timeline, the Post-Probation Checklist,
Custom Milestones, and Reminders come in later phases.

---

## 1. Create your Firebase project

1. Go to [console.firebase.google.com](https://console.firebase.google.com) → **Add project**.
2. Name it (e.g. `hr-timeline-tracker`). You can skip Google Analytics.
3. Once created, click the **Web** icon (`</>`) to register a web app.
   Give it any nickname — you do **not** need Firebase Hosting.
4. Copy the `firebaseConfig` values shown (apiKey, authDomain, etc.) —
   you'll need them in step 4 below.

### Enable Authentication

1. In the Firebase console, go to **Build → Authentication → Get started**.
2. Enable the **Email/Password** sign-in method.
3. Go to the **Users** tab → **Add user** → create your own HR login
   (your email + a password you choose). This is the only account that
   will ever exist in this app.

### Enable Firestore

1. Go to **Build → Firestore Database → Create database**.
2. Choose **Production mode** (not test mode) and pick a region close to Egypt
   (e.g. `eur3` or `europe-west1`).
3. Once created, go to the **Rules** tab and paste in the contents of
   `firestore.rules` from this project, then **Publish**. This ensures only
   your logged-in account can ever read or write employee data.

---

## 2. Set your GitHub repo name

1. Create a new **private** GitHub repository (e.g. `hr-timeline-tracker`).
2. Open `vite.config.js` in this project and change the `base` value to
   match your repo name exactly, e.g.:
   ```js
   base: '/hr-timeline-tracker/',
   ```

---

## 3. Add your Firebase keys as GitHub Secrets

Since there's no local terminal step, the build happens on GitHub itself via
GitHub Actions — so your Firebase config needs to live there as **Secrets**,
not in a committed file.

1. In your GitHub repo: **Settings → Secrets and variables → Actions → New repository secret**.
2. Add each of these, using the values from your Firebase config (step 1):
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`

---

## 4. Enable GitHub Pages

1. In your repo: **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **GitHub Actions**.

---

## 5. Upload the project and deploy

1. Upload all files from this project into your new GitHub repo (drag-and-drop
   into the GitHub web UI works fine, or use GitHub Desktop like your other
   projects — no terminal commands needed).
2. Make sure the folder `.github/workflows/deploy.yml` is included — this is
   what builds and publishes the site automatically on every push to `main`.
3. Once pushed, go to the **Actions** tab in your repo and watch the
   "Deploy to GitHub Pages" workflow run. When it finishes, your app will be
   live at:
   ```
   https://mariamelfadaly.github.io/hr-timeline-tracker/
   ```
   (adjust the repo name to whatever you used).

### Authorize the domain in Firebase

Once you know your live URL, go back to **Firebase Console → Authentication
→ Settings → Authorized domains** and add:
```
mariamelfadaly.github.io
```

---

## Local development (optional)

If you ever want to preview changes on your own machine before pushing:

```
npm install
cp .env.example .env.local   # then fill in your Firebase values
npm run dev
```

---

## Project structure

```
src/
  lib/
    firebase.js       Firebase app initialization
    dateUtils.js       Calendar-accurate date math (counter, probation)
    employees.js        Firestore reads/writes for employee records
    employeeStatus.js  Derives live status + "next action" from a record
  contexts/
    AuthContext.jsx     Firebase Auth session state
    LanguageContext.jsx AR/EN + RTL/LTR switching
  components/
    EmployeeCounter.jsx  The signature live Y/M/D counter
    EmployeeCard.jsx     List card
    StatusBadge.jsx
    ProtectedRoute.jsx
  pages/
    Login.jsx
    EmployeeList.jsx     Main screen — search, filter, add
    AddEmployee.jsx
    EmployeeProfile.jsx  Counter + probation progress + details
```

## Data model

```
users/{yourUid}/employees/{employeeId}
  name, employeeId, jobTitle, joiningDate, phoneNumber
  department, email, manager        (optional)
  status: "probation" | "active" | "action_required" | "ended"
  probation: { type, startDate, endDate, decision }
  confirmation, checklist, milestones   (used in later phases)
```

The employment counter and probation days-remaining are **never stored** —
they're calculated fresh from `joiningDate` / `probation.endDate` every time
the app renders, exactly per the brief.

## What's next (Phase 2+)

- Probation "Action Required" decision flow (Confirm / Extend / End / Review)
  + automatic 30/14/7/1-day reminder generation
- Visual Employee Timeline
- Post-Probation Checklist (ID, uniform, locker, payroll card, EMP FILE)
- Custom Milestones
- In-app Reminders/Notifications center

Just say the word when you're ready for the next phase.
