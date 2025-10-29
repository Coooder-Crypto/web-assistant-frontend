# Modern AI Tool UI Library

A comprehensive, modern UI component library specifically designed for AI tools and conversational interfaces.

## 🎨 Design Philosophy

This UI library follows modern AI tool design principles:
- **Clean & Minimal**: Focus on content with minimal visual clutter
- **Conversational**: Optimized for chat and messaging interfaces
- **Accessible**: WCAG compliant with keyboard navigation support
- **Responsive**: Works seamlessly across all device sizes
- **Performance**: Lightweight components with smooth animations

## 🏗️ Architecture

```
src/ui/
├── components/          # React components
├── tokens/             # Design tokens (colors, spacing, etc.)
├── hooks/              # Custom React hooks
├── styles/             # CSS animations and utilities
└── utils/              # Helper functions
```

## 🎯 Core Components

### Button
Modern button component with multiple variants and loading states.

```tsx
import { Button } from '@src/ui'

<Button variant="primary" size="lg" loading={isLoading}>
  Send Message
</Button>
```

**Variants**: `primary`, `secondary`, `ghost`, `danger`
**Sizes**: `sm`, `md`, `lg`

### Input
Flexible input component with multiline support and modern styling.

```tsx
import { Input } from '@src/ui'

<Input
  multiline
  rows={3}
  placeholder="Type your message..."
  onChange={setValue}
/>
```

### Card
Container component with multiple visual styles.

```tsx
import { Card } from '@src/ui'

<Card variant="elevated" hoverable>
  <p>Card content</p>
</Card>
```

**Variants**: `default`, `elevated`, `outlined`, `glass`

### Message
Specialized component for chat messages with role-based styling.

```tsx
import { Message } from '@src/ui'

<Message
  content="Hello, how can I help you?"
  role="assistant"
  timestamp={new Date()}
/>
```

### Modal
Accessible modal with backdrop blur and smooth animations.

```tsx
import { Modal } from '@src/ui'

<Modal isOpen={isOpen} onClose={onClose} title="Settings">
  <p>Modal content</p>
</Modal>
```

### Badge
Status indicator with semantic color variants.

```tsx
import { Badge } from '@src/ui'

<Badge variant="ai" size="sm">AI</Badge>
```

### Loading Components
Various loading states for different contexts.

```tsx
import { LoadingSpinner, ThinkingDots } from '@src/ui'

<LoadingSpinner size="6" />
<ThinkingDots />
```

### Toast
Non-intrusive notifications with auto-dismiss.

```tsx
import { Toast } from '@src/ui'

<Toast
  message="Success!"
  type="success"
  onClose={handleClose}
/>
```

## 🎨 Design Tokens

### Colors
- **Primary**: Modern blue palette for AI branding
- **Neutral**: Carefully crafted grayscale for optimal contrast
- **Semantic**: Success, warning, error, info states
- **AI-specific**: Special colors for AI interactions and states

### Typography
- **Font Family**: Inter as primary, JetBrains Mono for code
- **Scale**: Modern typographic scale with consistent line heights
- **Weights**: 400, 500, 600, 700 for clear hierarchy

### Spacing & Layout
- **Consistent Scale**: 4px base unit for perfect alignment
- **Border Radius**: Rounded corners for friendly AI feel
- **Shadows**: Subtle elevation with AI-themed glow effects

### Animations
- **Smooth Transitions**: Cubic-bezier easing for natural feel
- **AI-specific**: Typing indicators, thinking dots, glow effects
- **Performance**: Hardware-accelerated transforms
- **Accessibility**: Respects prefers-reduced-motion

## 🪝 Custom Hooks

### useEntranceAnimation
Staggered entrance animations for better UX.

```tsx
import { useEntranceAnimation } from '@src/ui/hooks/useAnimation'

const { className, style } = useEntranceAnimation(200)
```

### useTypingAnimation
Typewriter effect for AI responses.

```tsx
import { useTypingAnimation } from '@src/ui/hooks/useAnimation'

const { displayText, isComplete } = useTypingAnimation('Hello world', 50)
```

### useLoadingAnimation
Manage loading states with smooth transitions.

```tsx
import { useLoadingAnimation } from '@src/ui/hooks/useAnimation'

const { setLoading, setSuccess, animationClass } = useLoadingAnimation()
```

## 💫 Animations

### CSS Classes
Pre-built animation classes for common patterns:
- `.fade-in` / `.fade-out`
- `.slide-up` / `.slide-down`
- `.pulse` / `.spin`
- `.typing` / `.glow`
- `.hover-lift` / `.hover-glow`

### Usage
```tsx
<div className="fade-in hover-lift">
  Animated content
</div>
```

## 🌙 Dark Mode Support
Components automatically adapt to system dark mode preference.

## ♿ Accessibility Features
- Keyboard navigation support
- ARIA labels and roles
- Focus management
- Screen reader compatibility
- High contrast support
- Reduced motion support

## 📱 Responsive Design
All components work seamlessly across:
- Mobile (320px+)
- Tablet (768px+)
- Desktop (1024px+)
- Large screens (1400px+)

## 🎯 AI-Specific Features

### Conversational UI Patterns
- Message bubbles with role differentiation
- Typing indicators and thinking states
- Quick action buttons
- Status badges and connection states

### Visual Hierarchy
- Clear distinction between user and AI messages
- Subtle AI branding with gradient accents
- Information density optimized for conversation

### Performance Optimizations
- Lazy loading for large conversation histories
- Smooth scrolling with message batching
- Efficient re-renders with React optimization

## 🚀 Getting Started

1. Import components:
```tsx
import { Button, Card, Input } from '@src/ui'
```

2. Import animations CSS:
```tsx
import '@src/ui/styles/animations.css'
```

3. Use design tokens:
```tsx
import { colors, spacing, typography } from '@src/ui'
```

## 🛠️ Customization

The design system is built with customization in mind. Modify tokens in `src/ui/tokens/` to match your brand:

```typescript
// Custom colors
export const colors = {
  primary: {
    500: '#your-brand-color',
    // ... other shades
  },
  // ... other color scales
}
```

## 📦 Bundle Size
The library is tree-shakeable - only import what you need:
- Core components: ~8KB gzipped
- Full library: ~15KB gzipped
- Zero runtime dependencies (beyond React)

## 🔮 Future Roadmap
- [ ] Advanced AI interaction patterns
- [ ] Voice interaction components
- [ ] Rich media message support
- [ ] Advanced loading states
- [ ] Collaborative editing components
