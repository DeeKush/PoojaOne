# PoojaOne Design Guidelines

## Design Approach
**Reference-Based Approach**: Drawing inspiration from premium service platforms like Airbnb (trust & clarity), Headspace (calm & devotional), and Stripe (premium simplicity). The design balances modern sophistication with respectful devotional aesthetics—avoiding cheap religious flyer vibes while maintaining cultural authenticity.

## Core Design Principles
1. **Premium Devotional**: Elevated, respectful aesthetic that honors tradition through modern design
2. **Trust-First**: Clear information hierarchy, transparent pricing, professional presentation
3. **Effortless Booking**: Streamlined forms, minimal friction, clear status communication
4. **Mobile-First**: 60%+ users will book on mobile; optimize for touch and vertical scroll

## Typography System

**Font Families**:
- Primary: Inter or Poppins (modern, clean, excellent readability)
- Accent: Cormorant Garamond or Playfair Display (for devotional elegance in headings)

**Type Scale**:
- Hero Headline: text-5xl md:text-6xl lg:text-7xl, font-bold
- Section Headings: text-3xl md:text-4xl, font-semibold
- Card Titles: text-xl md:text-2xl, font-semibold
- Body: text-base md:text-lg, regular weight
- Captions/Labels: text-sm, medium weight

## Layout System

**Spacing Primitives**: Use Tailwind units of 4, 6, 8, 12, 16, 20, 24 for consistent rhythm
- Section padding: py-16 md:py-24 lg:py-32
- Card spacing: p-6 md:p-8
- Form fields: space-y-6
- Grid gaps: gap-6 md:gap-8

**Container Strategy**:
- Max-width: max-w-7xl for content sections
- Form containers: max-w-2xl for optimal readability
- Full-bleed: Hero sections and dividers

## Page-Specific Layouts

### Homepage

**Hero Section** (100vh on desktop, auto on mobile):
- Large hero image: Professional pandit performing pooja in modern home setting (warm, authentic, aspirational)
- Semi-transparent overlay for text readability
- Centered content with generous breathing room
- Headline + subtext stacked vertically
- Primary CTA button with blurred background
- City coverage badge beneath CTA

**Featured Poojas Section**:
- Grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 (5 cards, last row with 2 cards)
- Card design: Elevated with shadow, hover lift effect
- Each card: Icon/symbol at top, pooja name, 2-line description, duration badge, price range, details button
- Consistent card height for visual harmony

**How It Works**:
- Three-column layout on desktop (grid-cols-1 md:grid-cols-3)
- Large numbered icons (1, 2, 3) with step descriptions
- Vertical flow on mobile with connecting line visual

**Coverage Zones**:
- Four pill-shaped zone badges in centered horizontal layout
- Wraps gracefully on mobile to 2x2 grid

**Trust Section**:
- Three columns on desktop with icons
- Clean bullet points with checkmarks
- "Coming soon" badge for reviews feature

### Pooja Details Page

**Layout**:
- Breadcrumb navigation at top
- Two-column split on desktop (60/40):
  - Left: Pooja name (large), description, duration, what's included/required (expandable sections)
  - Right: Sticky pricing card with both service options, CTA button
- Single column stack on mobile

**Pricing Card**:
- Clear visual separation between "Priest Only" and "With Materials" options
- Radio button selection style
- Price ranges displayed prominently
- Single "Check Availability" CTA updates based on selection

### Check Availability Form

**Layout**:
- Single column, max-w-2xl centered
- Progress indicator at top (visual steps: Select → Details → Confirm)
- Grouped sections with clear labels:
  1. Service Selection (pooja dropdown, zone, date/time in grid)
  2. Preferences (language, service type as large radio cards)
  3. Your Details (name, phone, email in 2-col grid on desktop)
  4. Address (full-width inputs, 2-col for landmark/pincode)

**Form Fields**:
- Generous height: h-12
- Clear labels above fields
- Helper text below when needed
- Validation states (success/error) with icons

### Booking Status Page

**Layout**:
- Centered card design, max-w-xl
- Large status icon at top (checkmark/clock/x)
- Status message with appropriate styling
- Booking details in clean key-value pairs
- Action buttons at bottom (back to home, contact support)

**Status Indicators**:
- Confirmed: Large checkmark icon, positive messaging
- Pending: Clock icon, reassuring message about team follow-up
- Cancelled: Clear explanation with next steps

## Component Library

**Navigation**:
- Sticky header with subtle shadow on scroll
- Logo left, navigation center, CTA right on desktop
- Hamburger menu on mobile with full-screen overlay

**Buttons**:
- Primary: Large (h-12), rounded-lg, font-semibold, with subtle shadow
- Secondary: Outlined style with 2px border
- Ghost: Text-only for tertiary actions
- On images: backdrop-blur-sm with semi-transparent background

**Cards**:
- Pooja cards: Elevated (shadow-lg), rounded-xl, hover:scale-105 transition
- Zone badges: Rounded-full, medium padding
- Pricing options: Large radio-style cards with checkmark visual

**Forms**:
- Inputs: Rounded-lg borders, focus:ring-2 states
- Dropdowns: Custom styled to match input fields
- Date/time pickers: Native with enhanced styling fallback
- Radio groups: Large clickable card style for better mobile UX

**Icons**:
- Use Heroicons for UI elements (16px, 20px, 24px)
- Custom devotional symbols for poojas (simple, elegant line art style)

## Images

**Hero Image**: 
- Professional photograph of pandit performing pooja in contemporary Bangalore home
- Warm natural lighting, clean modern space, authentic ritual setup
- Image should convey trust, tradition, and convenience
- Placement: Full hero section background with gradient overlay

**Pooja Detail Images** (optional enhancement):
- Small illustrative icons for each pooja type at top of detail page
- Simple, respectful symbolic representations

## Responsive Behavior

**Breakpoints**:
- Mobile: < 768px (single column, stacked layouts)
- Tablet: 768px - 1024px (2-column grids)
- Desktop: > 1024px (full multi-column layouts)

**Mobile Optimizations**:
- Touch-friendly button sizes (min h-12)
- Adequate spacing between interactive elements (min gap-4)
- Simplified navigation (hamburger menu)
- Forms stack to single column
- Pricing cards stack vertically with full width

## Animations
Use sparingly for polish:
- Card hover: subtle lift (translate-y-1) + shadow increase
- Page transitions: simple fade-in
- Button states: scale on active press
- Form validation: shake animation for errors
- No decorative scroll animations