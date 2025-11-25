# Personal CRM Design Guidelines

## Design Approach

**Selected Framework:** Apple Human Interface Guidelines (HIG)
**Rationale:** Productivity-focused contact management tool requiring clean, efficient interface with emphasis on usability and content clarity.

**Core Principles:**
- Clarity through minimalism
- Content-first hierarchy
- Subtle depth through shadows
- Generous whitespace

---

## Typography

**Font Family:** System font stack (-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto)

**Type Scale:**
- Page Title: 32px, weight 700
- Section Headers: 24px, weight 600
- Contact Names: 18px, weight 600
- Body Text: 16px, weight 400
- Labels/Meta: 14px, weight 500
- Captions: 13px, weight 400

---

## Layout System

**Spacing Units:** Tailwind units of 2, 3, 4, 6, 8, 12
- Component padding: p-6, p-8
- Section spacing: mb-8, mb-12
- Card gaps: gap-4, gap-6
- Form field spacing: space-y-4

**Container Structure:**
- Max width: max-w-6xl
- Main content: Centered with mx-auto px-4
- Cards: Rounded corners (rounded-xl)

---

## Core Components

### Navigation Bar
- Fixed top, full-width with subtle border-bottom
- Height: h-16
- Content: Logo/title left, "Add Contact" button right
- Backdrop blur effect

### Contact List View
- Grid layout: Single column on mobile, 2 columns on md, 3 columns on lg
- Contact cards with:
  - Name as primary element (text-lg font-semibold)
  - Birthday with icon
  - Last contact date
  - Days until next reminder (prominent badge)
  - Edit/Delete actions (subtle, appear on hover)
- Search bar: Full-width, rounded-full, with search icon
- Sort dropdown: Minimal, right-aligned

### Contact Card
- White background with subtle shadow (shadow-sm hover:shadow-md)
- Border: border border-gray-200
- Padding: p-6
- Rounded: rounded-xl
- Transition on hover

### Add/Edit Contact Form
- Modal overlay with centered card (max-w-md)
- Form fields:
  - Text inputs with floating labels
  - Date pickers for birthday and last contact
  - Number input for reminder interval (with unit selector: days/weeks/months)
- Input styling: Rounded (rounded-lg), border-gray-300, focus ring
- Button group: Cancel (ghost) + Save (primary) aligned right

### Reminder Badge
- Pill-shaped, rounded-full
- Size based on urgency:
  - Overdue: Prominent display
  - Soon: Medium emphasis
  - Future: Subtle

### Empty State
- Centered content when no contacts
- Icon + heading + subtext + "Add First Contact" button
- Vertical spacing: space-y-6

---

## Interaction Patterns

### Buttons
- Primary: Solid fill, rounded-lg, px-6 py-2.5
- Secondary: Border outline, transparent background
- Icon buttons: Square, p-2, rounded-lg
- Hover: Subtle opacity change (0.9)

### Forms
- Focus states: Blue ring (ring-2 ring-blue-500)
- Validation: Inline error messages below fields
- Required fields: Asterisk notation

### Cards
- Hover: Lift effect (shadow increase)
- Active: Slight scale down (scale-98)

### Modals
- Backdrop: Semi-transparent dark overlay
- Animation: Fade in + scale up
- Close: X button top-right + click outside

---

## Responsive Behavior

**Mobile (base):**
- Single column layout
- Full-width contact cards
- Simplified card content
- Bottom sheet for forms

**Tablet (md: 768px):**
- 2-column contact grid
- Expanded card details

**Desktop (lg: 1024px):**
- 3-column contact grid
- All features visible

---

## Special Features

### Notification System
- Toast notifications: Top-right corner
- Types: Success, info, warning
- Auto-dismiss after 3s
- Slide-in animation

### Date Display
- Birthday: Show age + date
- Last contact: Relative time ("3 days ago")
- Next reminder: Countdown format

---

## Images

**No hero images needed** - This is a productivity application focused on functionality over marketing aesthetics.

**Icons:** Use Heroicons (outline style) via CDN for:
- Calendar, user, bell, search, pencil, trash, plus icons
- Keep icons at 20px or 24px sizes