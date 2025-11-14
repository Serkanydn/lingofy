# AddWordDialog Premium Feature - Usage Guide

## Overview

The `AddWordDialog` component now supports premium feature gating. When a non-premium user selects text, the dialog shows a beautiful warning message encouraging them to upgrade to premium.

## Design System Applied

✅ **Claymorphism Style**
- Soft rounded corners (`rounded-2xl`, `rounded-3xl`)
- Orange gradient backgrounds (`bg-linear-to-br from-orange-50 to-amber-50`)
- Colored shadows (`shadow-[0_4px_14px_rgba(249,115,22,0.15)]`)
- Smooth transitions (`transition-all duration-300`)

✅ **Visual Elements**
- Crown icon for premium branding
- Sparkles icon for premium feature indicator
- Orange color palette (primary brand color)
- Gradient button with hover lift effect

## Updated Props

```typescript
interface AddWordDialogProps {
  open: boolean;
  onClose: () => void;
  initialWord?: string;
  sourceType?: "reading" | "listening";
  sourceId?: string;
  initialCategoryId?: string | null;
  isPremium?: boolean;  // NEW: Controls premium feature access
}
```

## Usage Example

```tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { AddWordDialog } from '@/features/words/components/addWordDialog';

export function ReadingPage() {
  const { isPremium } = useAuth();
  const [showAddWord, setShowAddWord] = useState(false);
  const [selectedText, setSelectedText] = useState('');

  const handleTextSelection = () => {
    const selection = window.getSelection()?.toString().trim();
    
    if (selection) {
      setSelectedText(selection);
      setShowAddWord(true);
    }
  };

  return (
    <div onMouseUp={handleTextSelection}>
      {/* Your content here */}
      
      <AddWordDialog
        open={showAddWord}
        onClose={() => {
          setShowAddWord(false);
          setSelectedText('');
        }}
        initialWord={selectedText}
        isPremium={isPremium}
        sourceType="reading"
        sourceId="some-article-id"
      />
    </div>
  );
}
```

## Behavior

### For Premium Users (`isPremium={true}`)
- All form fields are enabled
- Normal word-saving functionality works
- No warning message displayed

### For Non-Premium Users (`isPremium={false}`)
- When `initialWord` has a value (user selected text):
  - Beautiful warning alert is displayed at the top
  - All form fields are disabled
  - "Add Word" button is disabled
  - Premium upgrade CTA button is shown
  - Selected text is displayed in the warning: "You've selected: {word}"
  
- When `initialWord` is empty (manual word entry):
  - Normal form behavior
  - Users can still add words manually (if this is your intended UX)

## Premium Warning Message

The warning includes:
1. **Crown icon** - Premium branding
2. **Title**: "Premium Feature" with Sparkles icon
3. **Selected text display**: Shows what the user tried to save
4. **Description**: Explains premium benefits
5. **CTA Button**: Links to `/premium` page with gradient styling

## Design Details

### Alert Container
```tsx
className="rounded-2xl border-2 border-orange-100 bg-linear-to-br from-orange-50 to-amber-50 shadow-[0_4px_14px_rgba(249,115,22,0.15)]"
```

### Premium Upgrade Button
```tsx
className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-linear-to-r from-orange-500 to-orange-600 text-white font-semibold text-sm shadow-[0_4px_14px_rgba(249,115,22,0.4)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.5)] transition-all duration-300 hover:from-orange-600 hover:to-orange-700"
```

## Implementation Checklist

- [x] Added `isPremium` prop to interface
- [x] Imported Crown, Sparkles icons from lucide-react
- [x] Imported Alert components
- [x] Created premium warning UI with claymorphism styling
- [x] Disabled all form inputs when non-premium + selected text
- [x] Disabled submit button for non-premium users with selected text
- [x] Added "Upgrade to Premium" CTA button
- [x] Applied design system patterns (colors, shadows, borders)
- [x] Maintained accessibility with proper disabled states

## Related Files

- Component: `src/features/words/components/addWordDialog.tsx`
- Premium Hook: `src/features/premium/hooks/usePremiumSubscription.ts`
- Auth Hook: `src/features/auth/hooks/useAuth.ts`
- Premium Page: `app/(main)/premium/page.tsx`

## Future Enhancements

Consider these improvements:
1. Add animation when warning appears (slide down effect)
2. Track "upgrade clicks" from this modal for analytics
3. Add A/B testing for different CTA messages
4. Consider showing limited preview of premium features
5. Add "Learn More" link to premium features page
