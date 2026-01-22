'use client';

import { IconChevronUp, IconSettings, IconUser } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import TRTC, { NetworkQuality } from 'trtc-sdk-v5';

import { cn } from '@/utils/ui';

import NetworkStatus from '@/components/NetworkStatus';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';

export interface AudioVideoConfigurationPanelProps {
  networkQuality?: NetworkQuality;
  isOpen: boolean;
  setIsOpen: (state: boolean) => void;
}

const AudioVideoConfigurationPanel = ({
  networkQuality,
  isOpen,
  setIsOpen,
}: AudioVideoConfigurationPanelProps) => {
  const [userMicrophone, setUserMicrophone] = useState<string | null>(null);
  const [userCamera, setUserCamera] = useState<string | null>(null);
  const [userVolume, setUserVolume] = useState(50);
  const [backgroundOn, setBackgroundOn] = useState(false);
  const [microphoneList, setMicphoneList] = useState<MediaDeviceInfo[]>([]);
  const [cameraList, setCameraList] = useState<MediaDeviceInfo[]>([]);

  const handleVolumeChange = (value: number | readonly number[]) => {
    setUserVolume(Array.isArray(value) ? value[0] : value);
  };

  const handleTestAudio = () => {
    // TODO: Implement audio test functionality
    console.log('Testing audio...');
  };

  useEffect(() => {
    const initialMicrophones = async () => {
      const microphones = await TRTC.getMicrophoneList();
      setMicphoneList(
        microphones.filter(
          (microphone) => !microphone.label.startsWith('Default')
        )
      );
      setUserMicrophone(microphones[0].deviceId);
    };

    const initialCameras = async () => {
      const cameras = await TRTC.getCameraList();
      setCameraList(cameras);
      setUserCamera(cameras[0].deviceId);
    };

    initialMicrophones();
    initialCameras();
  }, []);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full bg-white border absolute bottom-0 left-0 right-0"
    >
      <CollapsibleTrigger
        render={
          <Button
            variant="ghost"
            className="w-full justify-between p-4 hover:bg-gray-50"
          >
            <div className="flex items-center gap-2">
              <IconSettings className="size-4 text-gray-600" />
              <p className="text-md font-semibold text-gray-900">
                Check audio and video
              </p>
            </div>
            <IconChevronUp
              className={cn('size-4 text-gray-600 transition-transform)', {
                ['rotate-180']: isOpen,
              })}
            />
          </Button>
        }
      />

      <div className="bg-white grid grid-cols-1 lg:grid-cols-2">
        <div className="flex justify-between items-center py-2 px-4">
          <p className="text-xs">Your network quality</p>
          <NetworkStatus value={networkQuality?.uplinkNetworkQuality} />
        </div>
        <div className="flex justify-between items-center py-2 px-4">
          <p className="text-xs">Patient network quality</p>
          <NetworkStatus value={networkQuality?.downlinkNetworkQuality} />
        </div>
      </div>

      <CollapsibleContent className="px-4 pb-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">
                Microphone
              </label>
              <Select value={userMicrophone} onValueChange={setUserMicrophone}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {microphoneList.map((microphone) => (
                    <SelectItem
                      key={microphone.deviceId}
                      value={microphone.deviceId}
                    >
                      {microphone.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">
                Camera
              </label>
              <Select value={userCamera} onValueChange={setUserCamera}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {cameraList.map((camera) => (
                    <SelectItem key={camera.deviceId} value={camera.deviceId}>
                      {camera.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">
                Volume
              </label>
              <div className="relative">
                <Slider
                  min={0}
                  max={100}
                  step={1}
                  value={[userVolume]}
                  onValueChange={handleVolumeChange}
                />
              </div>
            </div>

            <Button
              onClick={handleTestAudio}
              className="w-full"
              variant="secondary"
            >
              Test Audio
            </Button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-900">
                Turn background on
              </label>
              <Switch
                checked={backgroundOn}
                onCheckedChange={setBackgroundOn}
                className="data-[state=checked]:bg-teal-500"
              />
            </div>

            <div className="bg-teal-600 rounded-lg p-4 h-48 flex flex-col items-center justify-center text-white">
              <div className="text-center space-y-2">
                <h4 className="font-medium">RafflesMedical</h4>
                <IconUser className="size-16 mx-auto opacity-80" />
              </div>
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default AudioVideoConfigurationPanel;
