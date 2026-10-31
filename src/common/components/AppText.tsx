import { Text } from 'react-native';
import { cn } from '@/core/theme';

type AppTextVariant = 'title' | 'body' | 'muted';

const variantClass: Record<AppTextVariant, string> = {
  title: 'text-title font-semibold text-ink',
  body: 'text-body text-text',
  muted: 'text-body text-muted',
};

export function AppText({
  children,
  variant = 'body',
}: {
  children: React.ReactNode;
  variant?: AppTextVariant;
}) {
  return <Text className={cn(variantClass[variant])}>{children}</Text>;
}
