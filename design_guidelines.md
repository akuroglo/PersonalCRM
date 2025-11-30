# Personal CRM Design Guidelines

## Design Approach

**Selected Framework:** ClickUp Design System
**Rationale:** Modern, professional productivity tool with clear visual hierarchy and efficient workspace management. Focuses on structured UI, accessibility, and user productivity.

**Core Principles:**
- Professional clarity with modern aesthetics
- Structured information hierarchy
- Action-oriented design
- Efficient use of space with structured density
- Accessibility and dark mode support

---

## Color Scheme (ClickUp Style)

**Primary Color:** Purple/Violet
- Light mode: hsl(268, 100%, 45%)
- Dark mode: hsl(268, 100%, 60%)

**Secondary Color:** Light Gray/Off-white
- Light mode: hsl(0, 0%, 97%)
- Dark mode: hsl(0, 0%, 11%)

**Accent Colors:**
- Success/Green: hsl(142, 71%, 45%)
- Warning/Orange: hsl(38, 92%, 50%)
- Destructive/Red: hsl(0, 84%, 45%)

**Neutral Palette:**
- Backgrounds: White (light) / Dark gray (dark)
- Text: Dark gray (light) / White/Light gray (dark)
- Borders: Subtle gray with proper contrast

---

## Typography

**Font Family:** System font stack (-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto)

**Type Scale:**
- Page Title: 28px, weight 600 (bold)
- Section Headers: 20px, weight 600
- Subsection Headers: 16px, weight 600
- Body Text: 14px, weight 400
- Labels/Meta: 13px, weight 500
- Captions: 12px, weight 400

**Font Weights:**
- Regular: 400 (body text)
- Medium: 500 (labels, secondary text)
- Semibold: 600 (headers, emphasis)
- Bold: 700 (strong emphasis)

---

## Layout System

**Spacing Units:** Consistent spacing scale
- xs: 4px (0.25rem)
- sm: 8px (0.5rem)
- md: 12px (0.75rem)
- lg: 16px (1rem)
- xl: 20px (1.25rem)
- 2xl: 24px (1.5rem)
- 3xl: 32px (2rem)

**Container Structure:**
- Max width: max-w-6xl for desktop
- Main content: Centered with mx-auto px-6
- Sidebar: Fixed or collapsible, width: 16rem (256px)
- Cards: Rounded corners (rounded-md), subtle borders
- Padding consistency: p-4, p-6, p-8

---

## Core Components

### Sidebar Navigation (ClickUp style)
- Dark or light mode appropriate background
- Menu items with icons and labels
- Active state with purple highlight
- Collapsible functionality
- Clean typography with consistent sizing

### Chat Interface
- Message threads with proper spacing
- Input area at bottom (sticky)
- Scrollable message history
- Status indicators for AI responses
- Clear visual feedback for loading states

### Contact Cards
- Clean card layout with subtle border
- Title: Contact name (medium weight)
- Subtitle: Last contact date or upcoming reminder
- Action buttons: Edit, Delete (appear on hover/focus)
- Status badge for reminder urgency

### Forms
- Structured form fields with labels above
- Input styling: rounded-md border, focus ring purple
- Buttons: Primary (purple), Secondary (gray outline)
- Clear error states with red color
- Consistent spacing between fields (space-y-4)

### Buttons
- **Primary:** Purple background, white text, rounded-md
- **Secondary:** Gray background or outline variant
- **Ghost/Tertiary:** No background, text only
- **Size variants:** sm (compact), default (normal), lg (large)
- Hover states: Subtle elevation or opacity change
- Icon buttons: square, p-2, rounded-md

### Badges & Status Indicators
- Small, pill-shaped with appropriate colors
- Color coding: Green (success), Orange (warning), Red (danger), Gray (neutral)
- Consistent sizing: py-1 px-2.5, text-xs

### Input Fields
- Rounded borders (rounded-md)
- Padding: px-3 py-2
- Focus ring: Purple (ring-2 ring-purple-500)
- Placeholder text: Muted color
- Error state: Red border + error message

---

## Interaction Patterns

### Hover States
- Subtle background color change
- Slight shadow elevation on cards
- Opacity change on buttons (0.9)
- No major layout shifts

### Active/Selected States
- Purple highlight or background
- Maintained visual feedback
- Clear indication of current selection

### Loading States
- Spinner/skeleton loading indicators
- Clear feedback to user that action is processing
- Maintained layout to prevent layout shift

### Success/Error Messages
- Toast notifications (top-right)
- Color coding: Green (success), Red (error)
- Auto-dismiss after 3-4 seconds
- Clear, concise messaging

---

## Responsive Design

**Breakpoints:**
- Mobile: base (0px)
- Tablet: md (768px)
- Desktop: lg (1024px)
- Large Desktop: xl (1280px)

**Mobile First:**
- Stack vertical layouts
- Full-width cards
- Collapsible sidebar
- Simplified form layouts

**Tablet & Up:**
- Multi-column layouts
- Expanded sidebar
- More detailed card information

**Desktop:**
- Optimal two-column or three-column layouts
- Full feature set visible
- Optimized spacing and typography

---

## Dark Mode Support

- Automatic color adjustment based on system preference
- CSS custom properties for theme colors
- All elements have light/dark variants
- Maintains readability and contrast in both modes
- Purple remains consistent primary color in both modes

---

## Accessibility

- Minimum contrast ratio: 4.5:1 for normal text
- Focus states clearly visible (purple ring)
- Semantic HTML structure
- Icon labels and ARIA descriptions where needed
- Keyboard navigation support

---

## Animation & Transitions

- Smooth transitions (200-300ms) for hover/active states
- Subtle animations for modals (fade in + scale)
- No excessive motion
- Accessibility considerations for motion preferences

---

## Design System Values

**Clarity:** Information is presented clearly with proper visual hierarchy
**Efficiency:** UI supports quick actions and decision-making
**Consistency:** Unified design language across all pages
**Professionalism:** Modern, trustworthy appearance
**Accessibility:** Usable by everyone regardless of ability
