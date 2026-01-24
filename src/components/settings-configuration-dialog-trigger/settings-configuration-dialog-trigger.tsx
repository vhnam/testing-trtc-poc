import {
  IconCamera,
  IconRefresh,
  IconSettings,
  IconVolume,
  IconVolumeOff,
} from '@tabler/icons-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { useSettingsConfiguration } from './settings-configuration-dialog-trigger.actions';

interface SettingsConfigurationDialogTriggerProps {
  isSupportVirtualBackground?: boolean;
}

const SettingsConfigurationDialogTrigger = ({
  isSupportVirtualBackground = false,
}: SettingsConfigurationDialogTriggerProps) => {
  const {
    // Device lists
    microphoneList,
    cameraList,
    speakerList,

    // Selected devices
    userMicrophone,
    setUserMicrophone,
    userCamera,
    setUserCamera,
    userSpeaker,
    setUserSpeaker,

    // Audio test
    isPlaying,
    handleTestAudio,

    // Network stats
    networkStats,
    isLoadingNetworkStats,
    measureNetworkQuality,
  } = useSettingsConfiguration();

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button type="button" variant="outline" className="w-full">
            <IconSettings /> Settings
          </Button>
        }
      />
      <DialogContent className="lg:max-w-xl">
        <DialogHeader className="border-b border-gray-200 pb-4">
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>

        <Tabs
          defaultValue="audio"
          orientation="vertical"
          className="lg:min-h-[60vh]"
        >
          <TabsList variant="line" className="mr-2">
            <TabsTrigger value="audio">Audio</TabsTrigger>
            <TabsTrigger value="camera">Camera</TabsTrigger>
            <TabsTrigger value="network">Network</TabsTrigger>
          </TabsList>
          <TabsContent value="audio" className="space-y-6">
            <h3 className="text-lg font-semibold">Audio Settings</h3>
            <div className="space-y-1">
              <Label>Select Microphone</Label>
              <Select value={userMicrophone} onValueChange={setUserMicrophone}>
                <SelectTrigger className="w-full">
                  <SelectValue>
                    {userMicrophone
                      ? microphoneList.find(
                          (microphone) => microphone.deviceId === userMicrophone
                        )?.label
                      : 'Select a microphone'}
                  </SelectValue>
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

            <div className="space-y-1 w-full">
              <Label>Select Speaker</Label>

              <div className="flex items-end justify-between gap-2">
                <Select value={userSpeaker} onValueChange={setUserSpeaker}>
                  <SelectTrigger className="w-full">
                    <SelectValue>
                      {userSpeaker
                        ? speakerList.find(
                            (speaker) => speaker.deviceId === userSpeaker
                          )?.label
                        : 'Select a speaker'}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {speakerList.map((speaker) => (
                      <SelectItem
                        key={speaker.deviceId}
                        value={speaker.deviceId}
                      >
                        {speaker.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleTestAudio}
                >
                  {isPlaying ? (
                    <>
                      <IconVolumeOff className="size-4" /> Stop
                    </>
                  ) : (
                    <>
                      <IconVolume className="size-4" /> Play
                    </>
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="camera" className="space-y-6">
            <h3 className="text-lg font-semibold">
              Camera & Background Effect
            </h3>
            <div className="space-y-1">
              <Label>Select Camera</Label>
              <Select value={userCamera} onValueChange={setUserCamera}>
                <SelectTrigger className="w-full">
                  <SelectValue>
                    {userCamera
                      ? cameraList.find(
                          (camera) => camera.deviceId === userCamera
                        )?.label
                      : 'Select a camera'}
                  </SelectValue>
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

            <div className="space-y-1">
              <Label>Camera Preview</Label>
              <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-600">
                  <div className="text-4xl mb-4">
                    <IconCamera className="size-4 mx-auto" />
                  </div>
                  <p>Camera preview will appear here</p>
                </div>
              </div>
            </div>

            {isSupportVirtualBackground && (
              <div className="space-y-1">
                <Label htmlFor="virtual-background">
                  <Switch id="virtual-background" /> Toggle virtual background
                </Label>

                <p className="text-muted-foreground text-sm">
                  Doctor only can enable virtual background in consultation room
                </p>
              </div>
            )}
          </TabsContent>
          <TabsContent value="network" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Network Quality</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={measureNetworkQuality}
                disabled={isLoadingNetworkStats}
              >
                <IconRefresh
                  className={`size-4 ${isLoadingNetworkStats ? 'animate-spin' : ''}`}
                />
                Refresh
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-chart-1/20 rounded-lg p-4">
                <div className="text-sm mb-1 font-semibold">Bandwidth</div>
                <p className="text-xs">Available data transfer rate</p>
                <div className="text-2xl font-semibold">
                  {isLoadingNetworkStats ? '...' : networkStats.bandwidth}
                </div>
              </div>
              <div className="bg-chart-2/20 rounded-lg p-4">
                <div className="text-sm mb-1 font-semibold">Latency</div>
                <p className="text-xs">Round-trip time for data packets</p>
                <div className="text-2xl font-semibold">
                  {isLoadingNetworkStats ? '...' : networkStats.latency}
                </div>
              </div>
              <div className="bg-chart-3/20 rounded-lg p-4">
                <div className="text-sm mb-1 font-semibold">Packet Loss</div>
                <p className="text-xs">Percentage of lost data packets</p>
                <div className="text-2xl font-semibold">
                  {isLoadingNetworkStats ? '...' : networkStats.packetLoss}
                </div>
              </div>
              <div className="bg-chart-4/20 rounded-lg p-4">
                <div className="text-sm mb-1 font-semibold">Jitter</div>
                <p className="text-xs">Variation in latency measurements</p>
                <div className="text-2xl font-semibold">
                  {isLoadingNetworkStats ? '...' : networkStats.jitter}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsConfigurationDialogTrigger;
