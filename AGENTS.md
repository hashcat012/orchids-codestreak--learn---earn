## Project Summary
CodeStreak is an interactive coding education platform inspired by Coddy.tech. It uses a 3D-style roadmap to guide users through learning various programming languages. The platform features a daily "coin" currency system where users get 5 free coins per day to unlock lessons (1 coin = 1 level).

## Tech Stack
- Framework: Next.js 15 (App Router)
- Language: TypeScript
- Styling: Tailwind CSS
- Backend/Auth: Firebase (Auth & Firestore)
- Icons: Lucide React

## Architecture
- `src/lib/firebase.ts`: Firebase initialization
- `src/lib/hooks/use-auth.tsx`: Auth context and daily coin logic
- `src/app/roadmap/page.tsx`: Core learning path and level unlocking
- `src/app/admin/page.tsx`: Restricted admin dashboard
- `src/app/languages/page.tsx`: Language selection gallery

## User Preferences
- Theme: Red-Orange-White energetic palette
- Currency: Coins (5 daily for free users, unlimited for admin)
- Admin: erenalmali@icloud.com

## Project Guidelines
- Use energetic gradients (red-to-orange) for primary actions
- Maintain a "game-like" feel with 3D path visualization
- Admin-specific logic must be strictly tied to the email "erenalmali@icloud.com"

## Common Patterns
- Auth-guarded routes use the `useAuth` hook for profile and coin checks
- Coin transactions use Firestore `increment` or manual profile updates
