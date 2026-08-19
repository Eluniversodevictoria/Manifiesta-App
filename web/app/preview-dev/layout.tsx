import type { ReactNode } from 'react';
import { AppShell } from '@/app/app/AppShell';
export default function PreviewLayout({ children }: { children: ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
