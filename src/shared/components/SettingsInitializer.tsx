/**
 * Settings Initializer
 * Following: docs/03-code-standards/01-design-patterns.md (Initialization Pattern)
 * Initializes settings on app mount
 */

'use client';

import { useEffect } from 'react';
import { useSettingsStore } from '@/features/admin/features/settings';

export function SettingsInitializer() {
  const initialize = useSettingsStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return null;
}
