import { IconAntennaBars5 } from '@tabler/icons-react';
import { type VariantProps } from 'class-variance-authority';
import { NetworkQualityValue } from 'trtc-sdk-v5';

import { Badge, type badgeVariants } from '@/components/ui/badge';

const status = ['Unknown', 'Good', 'Good', 'Normal', 'Poor', 'Poor', 'Offline'];
const colors = [
  'default',
  'success',
  'success',
  'warning',
  'destructive',
  'destructive',
  'default',
] as VariantProps<typeof badgeVariants>['variant'][];

export interface NetworkStatusProps {
  value?: NetworkQualityValue;
}

const NetworkStatus = ({ value }: NetworkStatusProps) => {
  return (
    <Badge
      variant={colors[value ?? 0]}
      render={
        <>
          <IconAntennaBars5 /> {status[value ?? 0]}
        </>
      }
    />
  );
};

export default NetworkStatus;
