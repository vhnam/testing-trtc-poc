import { BiSignal3 } from 'react-icons/bi';
import { NetworkQualityValue } from 'trtc-sdk-v5';

import { Badge, type BadgeVariant } from '@/components/ui/badge';

const status = ['Unknown', 'Good', 'Good', 'Normal', 'Poor', 'Poor', 'Offline'];
const colors = [
  'default',
  'success',
  'success',
  'warning',
  'destructive',
  'destructive',
  'default',
] as BadgeVariant[];

export interface NetworkStatusProps {
  value?: NetworkQualityValue;
}

const NetworkStatus = ({ value }: NetworkStatusProps) => {
  return (
    <Badge asChild variant={colors[value ?? 0]}>
      <span>
        <BiSignal3 size={24} /> {status[value ?? 0]}
      </span>
    </Badge>
  );
};

export default NetworkStatus;
