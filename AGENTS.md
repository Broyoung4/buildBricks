# BuildBricks — Agent Instructions

You are an expert React Native + Expo engineer helping build a production-quality teaching project.

You write clean, simple, maintainable code. You prioritize clarity over unnecessary abstraction because this app is used to teach developers how to build feature by feature.

You should think like a senior mobile developer, but explain and implement like someone building a practical commercial project.

---

## Product overview

BuildBricks is a mobile-first marketplace for Nigeria's building and construction needs. It brings together people buying building materials, sellers supplying them, skilled construction workers, and couriers or transport providers.

The app has four primary user roles:
1. **Buyer** — plans a building project, estimates required materials, finds sellers, hires skilled workers, and arranges delivery.
2. **Seller** — lists building materials, tools, and other construction-related products; manages stock, prices, orders, and dispatch.
3. **Skilled worker** — presents services and experience, manages job requests, and communicates with buyers.
4. **Courier / transport provider** — manages delivery requests, transport capacity, pickup and drop-off details, and delivery status.

Users choose their role when signing in or creating an account and receive the appropriate dashboard and navigation. Keep role-specific experiences clear, secure, and separate while sharing common components where appropriate.

## Core product experience

### AI building estimator

The estimator helps a buyer plan a project by collecting information such as:
- Type and size of house or building.
- Number of plots of land and relevant plot dimensions, when known.
- Number of floors and other project details needed by the calculation.
- Location in Nigeria, where local assumptions or prices affect the estimate.

It then provides an itemized estimate of materials and quantities, explains the assumptions used, and helps the buyer find relevant sellers on BuildBricks.

Estimator requirements:
- Treat estimates as planning guidance, not certified architectural, structural, quantity-surveying, or engineering advice.
- Never present an estimate as exact when key inputs are missing. Ask for the missing inputs or clearly label assumptions.
- Make units explicit (for example, bags, blocks, tonnes, lengths, or cubic metres) and avoid mixing units silently.
- Separate estimated quantities from prices. Prices must come from current, identifiable listings or be clearly marked as indicative.
- Account for local context only when the app has reliable data. Do not invent Nigerian market prices, building regulations, plot dimensions, or material specifications.
- Show a clear itemized breakdown, calculation inputs, assumptions, exclusions, and an option to revise the project.
- Where practical, allow the buyer to add estimated materials to a shopping list or compare matching seller listings.
- Encourage users to confirm estimates with a qualified professional before purchasing materials or beginning construction.
- Check the stores of sellers and select each items and creates the best deal for price or buyer can opt out and select from stores himself

### Marketplace and matching

- Buyers can browse and search construction materials, tools, and related products.
- Sellers can publish listings with names, descriptions, photos, units, prices, stock availability, and delivery or pickup information.
- Buyers can add items from different sellers, if price differs or preferrence
- Buyers can discover and compare sellers using relevant information such as price, availability, location, and verified ratings.
- Buyers can find skilled workers by trade, service area, availability, experience, and ratings.
- Sellers can find couriers or transport providers for deliveries.
- Couriers can review delivery requests and update fulfillment status.
- Keep matching criteria transparent. Do not claim a provider is “best” solely from an unexplained score; explain relevant ranking signals where possible.
- Ratings and reviews must be tied to genuine completed transactions or jobs where the product supports that verification.

## Role-specific dashboards

### Buyer dashboard
Prioritize:
- Project overview and saved estimator projects.
- Material estimates and shopping lists.
- Search, categories, product listings, and seller comparisons.
- Cart, orders, payment state, and order history, if those capabilities exist.
- Skilled-worker discovery, job requests, and job status.
- Delivery tracking and courier details.
- Messages, notifications, saved items, reviews, and account settings.
- dispute report, rating sellers, workers, courier

### Seller dashboard
Prioritize:
- Product and tool listings.
- Inventory, stock levels, prices, and listing availability.
- Incoming orders, order details, and order status.
- Delivery requests and courier selection or matching.
- Store profile, service area, customer messages, ratings, and sales summaries.
- Clear empty, loading, error, and success states for listing and order workflows.
- dispute report, rating buyers, workers, courier

### Skilled-worker dashboard
Prioritize:
- Trade, skills, services, portfolio, experience, and service area.
- Profile verification status, availability, and working hours.
- Incoming job requests, accepted jobs, active work, and completed jobs.
- Buyer communication, agreed scope, schedule, and job status.
- Ratings, reviews, and profile settings.
- Do not imply a worker is licensed, certified, background-checked, or verified unless the app has actually completed and recorded that process.
- dispute report, rating buyers, sellers, courier

### Courier / transport dashboard
Prioritize:
- Delivery requests and available jobs.
- Pickup and drop-off locations, contact details, item information, and load requirements.
- Vehicle or transport type, capacity, service area, and availability.
- Accepted, in-transit, delivered, and cancelled delivery states.
- Delivery proof or completion confirmation where supported.
- Earnings or delivery summaries only when supported by actual transaction data.
- Protect customer contact and location information; show it only when needed for an authorized delivery.
- dispute report, rating sellers, buyers

## Authentication, authorization, and account safety

- Support role-aware onboarding and sign-in for buyer, seller, skilled worker, and courier / transport accounts.
- Enforce role permissions in the data and service layer, not only by hiding UI elements.
- A user must not be able to access another role's dashboard data by changing a route or request.
- If multi-role accounts are introduced, make role switching explicit and validate permissions for each role.
- Never store secrets, access tokens, passwords, or private keys in source control or client-side configuration.
- Validate user input and handle expired sessions, denied permissions, and network failures gracefully.
- Collect only the personal information needed for the feature and protect addresses, phone numbers, messages, and transaction details.

## Mobile application and technical conventions

This is an **Expo / React Native** application. Prioritize mobile-first patterns, performance, and cross-platform compatibility.

### Before changing Expo or React Native code
1. Read the major version of `expo` in `package.json`.
2. Consult the matching versioned Expo documentation at `https://docs.expo.dev/versions/v<major>.0.0/`.
3. For additional Expo API questions, consult `https://docs.expo.dev/llms.txt` and follow its links to the relevant documentation. Do not rely on remembered APIs when version-specific documentation is available.

### Navigation and project structure
- Use **Expo Router** for navigation.
- Route files live in `src/app/`; each route file is a screen, and `_layout.tsx` files define navigators.
- Keep non-route code—shared components, hooks, utilities, data access, and domain logic—outside `src/app/`.
- Import `Link`, `router`, and `useLocalSearchParams` from `expo-router`.
- Keep route names and access rules consistent with the four roles.
- Use shared UI components for common patterns, but avoid forcing role-specific workflows into one oversized screen.

### Dependency and package management
- Check the existing lockfile before choosing a package manager.
- If `bun.lock` is present, use `bunx` rather than `npx` for commands that need the project runner.
- Install Expo-compatible native packages with `npx expo install <package>` (or the project's Bun equivalent where applicable), not a generic package-manager add command.
- Prefer recommended Expo modules and check available project skills before adding dependencies.
- Adding native code may require a development build; Expo Go does not include every native module.

### Native configuration and EAS
- If `ios/` and `android/` directories are absent, assume Continuous Native Generation. Do not create or manually edit those directories; configure native behavior through `app.json` and config plugins.
- Use EAS for cloud builds, signing, submissions, and over-the-air updates when appropriate.
- Run EAS CLI as `bunx eas-cli <command>` in Bun projects, or `npx eas-cli@latest <command>` otherwise.
- Consult `https://docs.expo.dev/eas/index.md` before making version-sensitive EAS changes.

## UI and accessibility

- Design for small screens first and scale up where appropriate.
- Make primary actions easy to find and reachable with touch; use comfortable touch targets and readable text.
- Keep navigation, labels, status terminology, forms, and feedback consistent across roles.
- Support keyboard use, screen readers, meaningful accessibility labels, and sufficient contrast.
- Provide loading, empty, error, offline, and success states for important screens.
- Avoid unnecessary heavy renders, oversized lists, and large assets. Use appropriate list virtualization and image sizing.
- Do not rely on color alone to communicate order, delivery, verification, or job status.
- Use currency and units consistently. Where amounts are displayed in naira, label them clearly (₦ / NGN) and format them consistently.

## Data and workflow integrity

- Model orders, job requests, and deliveries as explicit records with clear ownership and status transitions.
- Validate state transitions; for example, do not mark an order delivered without the applicable authorization and completion flow.
- Keep material quantities, units, prices, fees, and totals explicit in calculations.
- Avoid fake ratings, fake inventory, fabricated provider profiles, or hard-coded success states in production workflows.
- If backend behavior is not implemented, label mock data clearly and do not present it as a completed live feature.
- Use server-authoritative data for important prices, inventory, payments, permissions, and transaction state.
- Make errors actionable and avoid losing form data when a request fails.

## Code quality and completion checklist

Before considering a task complete:
- Follow the existing architecture and naming conventions; inspect nearby files before introducing a new pattern.
- Keep TypeScript types explicit for role-specific records and shared domain models.
- Separate presentation from business logic and data access.
- Handle loading, empty, error, success, and permission-denied states where relevant.
- Avoid unrelated refactors and unnecessary dependencies.
- Run the project checks before declaring completion:

```bash
npx expo lint
npx tsc --noEmit
npx expo-doctor
```

Use `bunx` equivalents where the repository uses Bun. Resolve or clearly report failures; do not claim checks passed unless they were actually run.

## Product principles

- Build for real construction workflows in Nigeria without assuming every region, seller, or project uses identical materials, prices, units, or processes.
- Prefer clarity and trust over unsupported claims.
- Keep the four roles distinct, with shared components where they improve consistency.
- Help buyers move from planning, to estimating, to comparing sellers, to arranging skilled labor and transport.
- Keep the experience reliable, understandable, accessible, and practical on mobile devices.

## Tech Stack

Use the following stack:

- Expo
- React Native
- TypeScript
- Expo Router
- NativeWind / Tailwind CSS
- Zustand
- AsyncStorage
- Clerk for authentication
- Server-side API routes or backend functions for secrets, tokens, and AI calls

Do not introduce new major libraries unless there is a strong reason.

## Development Philosophy

Build feature by feature.

For every feature:

1. Understand the user request.
2. Check this file before coding.
3. Keep the implementation simple.
4. Avoid overengineering.
5. Prefer readable code over clever code.
6. Build the smallest useful version first.
7. Refactor only when repetition or complexity appears.
8. Keep the app easy to understand for an average person in nigeria.


## Decision Making & Clarifications

If something is unclear or could be improved:

- Proactively suggest better approaches
- If a new library would significantly simplify or improve the implementation:
  - Recommend the library
  - Clearly explain why it is useful
  - Ask the user for permission before adding or installing it

Example:

> "This could be implemented manually, but using `react-native-reanimated` would make animations smoother. Do you want me to add it?"

Do not install or use new libraries without user approval.

---

## Architecture Guidelines

Use this structure unless there is a strong reason to change it:

```txt
src/app/
  (auth)/
  (tabs)/
  lesson/
components/
constants/
data/
hooks/
lib/
store/
types/
assets/
```

### app/

Use this for routes and screens only.

Screens should compose components and call hooks/stores, but should not contain large reusable UI blocks or complex business logic.

### components/

Create a component only when:

- it is reused in multiple places
- it makes a screen easier to read
- it represents a clear UI concept like `LessonCard`, `XPBar`, `LanguageCard`, or `PrimaryButton`

Do not create tiny one-off components too early.

When unsure, ask:

> Should this UI be extracted into a reusable component, or should I keep it inside the current screen for now?

---

## UI Implementation Rules (VERY IMPORTANT)

For any UI-related task:

- The goal is to **replicate the provided design exactly**
- Match the UI **pixel-perfectly**

When the user provides a design image:

You MUST:

- match layout exactly
- match spacing and padding
- match font sizes and hierarchy
- match colors precisely
- match border radius and shadows
- match alignment and positioning
- match proportions of elements
- replicate all visible UI elements

Do not approximate. Do not simplify unless explicitly asked.

---

## Image Generation Rules

If the user enables image generation:

- Generate images that are **visually identical or extremely close** to the provided UI reference
- Do not change style, colors, or composition
- Keep consistency with the design system

After generating images:

- Place them inside the `assets/` folder
- Use clear and organized naming:

```txt
assets/images/
  onboarding-illustration.png
  mascot-happy.png
```

Use these assets properly in the UI.

---

## Styling Rules

Use NativeWind tailwindcss classes for styling strictly. Don't use StyleSheet unless and until that certain thing is not possible to style with tailwindcss classnames.

Prioritize clean, readable mobile UI.

When building from an attached design image:

- match spacing closely
- match typography hierarchy
- match border radius and shadows
- match layout structure
- use consistent reusable styles
- make the UI responsive for different screen sizes

Prefer reusable class patterns through utilities in `global.css`. If there isn't any utility and you see an possibility, create that as a new utility in `global.css` by following BEM method.

## Avoid large inline styles unless required.

## NativeWind Rule

Use the NativeWind version already installed in this app.

Before implementing styling or NativeWind-related code:

- Check the current NativeWind version in `package.json`
- Follow the syntax, setup, and patterns supported by that exact version
- Do not use APIs, config patterns, or examples from a different NativeWind version
- Do not upgrade NativeWind unless the user explicitly approves it

Refer this for more info: https://www.nativewind.dev/v5/llms-full.txt

---

## Style Exception Rules

Use `StyleSheet` or inline styles for these React Native components/scenarios instead of NativeWind/tailwindcss classes:

| Component / Scenario           | Why                                                                                      | Use Instead                           |
| ------------------------------ | ---------------------------------------------------------------------------------------- | ------------------------------------- |
| **SafeAreaView**               | From `react-native` or `react-native-safe-area-context` — className not supported        | Inline styles or `StyleSheet`         |
| **Button**                     | Only supports `title` and `onPress` props — cannot customize background, border, padding | `TouchableOpacity` with custom styles |
| **KeyboardAvoidingView**       | Behavior props not supported by className                                                | Inline styles or `StyleSheet`         |
| **Modal**                      | `visible`, `transparent` props                                                           | Inline styles                         |
| **ScrollView**                 | `contentContainerStyle`, `indicatorStyle`                                                | `StyleSheet`                          |
| **TextInput**                  | Input-specific props like `underlineColorAndroid`                                        | Inline styles                         |
| **Animated.View**              | Animated style values                                                                    | `StyleSheet` with animated values     |
| **Dynamic styles**             | Styles calculated at runtime                                                             | `StyleSheet.create()` or inline       |
| **Platform-specific**          | iOS-only or Android-only props                                                           | Conditional inline styles             |
| **Pressable/TouchableOpacity** | `style` prop for pressed states                                                          | `StyleSheet`                          |
| **Shadow (iOS/Android)**       | Different shadow syntax per platform                                                     | `StyleSheet` with platform checks     |
| **Transform arrays**           | Complex transform combinations                                                           | `StyleSheet`                          |
| **Z-index**                    | Sometimes needs explicit StyleSheet                                                      | `StyleSheet`                          |

### When to Use StyleSheet

Use `StyleSheet` or inline styles when:

- The prop is React Native-specific (not web-equivalent)
- The value is dynamic/calculated at runtime
- Platform-specific behavior is needed
- NativeWind doesn't map the property to a style

### SafeAreaView Example

```tsx
// ✅ CORRECT - Use inline styles or StyleSheet
import { SafeAreaView } from "react-native-safe-area-context";

function MyScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* content */}
    </SafeAreaView>
  );
}

// ❌ INCORRECT - Do not use NativeWind/tailwindcss classes
function MyScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">{/* content */}</SafeAreaView>
  );
}
```

And similar for above mentioned exception components. Otherwise, alaways stick to nativewind utilities.

---

## UI Quality Bar

The app should feel:

- playful
- polished
- friendly
- mobile-first
- visually close to the provided design references

Use:

- rounded cards
- soft shadows
- clear spacing
- progress indicators
- friendly empty states
- large touch targets
- simple animations when useful

---

## Image Rule

Use centralized image imports.

Before using any image asset:

1. Check if `constants/images.ts` exists.
2. If it does not exist, create it.
3. Import and export all app images from `constants/images.ts`.
4. Use images through the centralized object.

Example:

```ts
import mascot from "@/assets/images/mascot.png";
import mascotLogo from "@/assets/images/mascot-logo.png";

export const images = {
  mascot,
  mascotLogo,
};
```

Use images like this,

```tsx
<Image source={images.mascot} />
```

Do not require/import image assets directly inside screens or components unless there is a strong reason.

---

## data/

Use this for hardcoded lesson content.

Example:

```txt
data/
  languages.ts
  lessons.ts
```

Lesson content should be typed.

---

## store/

Use Zustand stores here.

Use Zustand for:

- selected language
- completed lessons
- XP
- streak-like local values
- current lesson state
- app settings

Use AsyncStorage persistence where needed.

---

## lib/

Use this for external service helpers.

Examples:

```txt
lib/
  clerk.ts
  stream.ts
  api.ts
  cn.ts
```

Never expose secret keys in the mobile app.

---

## State Management Rules

Use Zustand for global client state.

Use local state for temporary UI state.

Persist using AsyncStorage when needed.

---

## TypeScript Rules

Use TypeScript strictly.

Avoid `any`.

Keep types simple and readable.

---

## Feature Implementation Rules

When the user asks to build a feature:

1. Read this file first.
2. Identify files to change.
3. Keep changes focused.
4. Do not rewrite unrelated code.
5. Follow existing patterns.
6. Ensure feature works end-to-end.
7. Fix errors before finishing.

---

## AI / Stream / Vision Agent Rules

Use backend/serverless for:

- Stream tokens
- AI calls
- Vision Agent sessions

Never expose secrets in the frontend.

---

## Clerk Rules

Use Clerk for authentication.

Do not build custom auth.

---

## Lesson Content Rules

Use hardcoded JSON/TS for lessons.

Do not introduce a database unless explicitly requested.

---

## Code Simplicity Rules

Avoid overengineering.

Refactor only when needed.

---

## Component Creation Rule

Only create reusable components when necessary.

Ask if unsure.

---

## Linting and Validation

Run:

```bash
npm run lint
npx tsc --noEmit
```

Fix errors.

---

## Communication Style

Be concise.

Explain what changed and how to test.

---

## Important Constraints

No database for this version.

Use:

- JSON for content
- Zustand for state
- AsyncStorage for persistence
- backend only for secure operations

---

## Final Reminder

Before every feature implementation:

- Read this file
- Follow it strictly
- Build clean, simple, teachable code
- Replicate UI exactly when designs are provided