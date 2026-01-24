import { useCallback, useEffect, useState } from 'react';
import TRTC from 'trtc-sdk-v5';

interface NetworkStats {
  bandwidth: string;
  latency: string;
  packetLoss: string;
  jitter: string;
}

export const useSettingsConfiguration = () => {
  // Device lists state
  const [microphoneList, setMicrophoneList] = useState<MediaDeviceInfo[]>([]);
  const [cameraList, setCameraList] = useState<MediaDeviceInfo[]>([]);
  const [speakerList, setSpeakerList] = useState<MediaDeviceInfo[]>([]);

  // Selected devices state
  const [userMicrophone, setUserMicrophone] = useState<string | null>(null);
  const [userCamera, setUserCamera] = useState<string | null>(null);
  const [userSpeaker, setUserSpeaker] = useState<string | null>(null);

  // Audio test state
  const [isPlaying, setIsPlaying] = useState(false);

  // Network metrics state
  const [networkStats, setNetworkStats] = useState<NetworkStats>({
    bandwidth: '0 Mbps',
    latency: '-- ms',
    packetLoss: '--%',
    jitter: '-- ms',
  });
  const [isLoadingNetworkStats, setIsLoadingNetworkStats] = useState(false);

  // Initialize device lists
  useEffect(() => {
    const initializeDevices = async () => {
      try {
        const [microphones, cameras, speakers] = await Promise.all([
          TRTC.getMicrophoneList(),
          TRTC.getCameraList(),
          TRTC.getSpeakerList(),
        ]);

        setMicrophoneList(microphones);
        setCameraList(cameras);
        setSpeakerList(speakers);
      } catch (error) {
        console.error('Failed to initialize devices:', error);
      }
    };

    initializeDevices();
  }, []);

  // Audio test handler
  const handleTestAudio = useCallback(() => {
    const audioContext = new AudioContext();
    const oscillator = audioContext.createOscillator();
    oscillator.connect(audioContext.destination);
    oscillator.start();
    setIsPlaying(true);

    setTimeout(() => {
      oscillator.stop();
      setIsPlaying(false);
    }, 1000);

    oscillator.onended = () => {
      setIsPlaying(false);
    };
  }, []);

  // Network measurement functions
  const measureLatency = useCallback(async (): Promise<number> => {
    // Test multiple endpoints for more accurate latency measurement
    const endpoints = [
      // Try local API first (Next.js API route)
      '/api/ping',
      // Fallback to external endpoints if local fails
      'https://www.google.com/generate_204', // Google's no-content endpoint
      'https://httpbin.org/status/200', // HTTPBin status endpoint
      'https://www.cloudflare.com/cdn-cgi/trace', // Cloudflare trace
    ];

    const results: number[] = [];

    for (const endpoint of endpoints) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout per test

        const start = performance.now();
        const response = await fetch(
          endpoint + (endpoint.includes('?') ? '&' : '?') + `t=${Date.now()}`,
          {
            method: 'HEAD',
            cache: 'no-cache',
            signal: controller.signal,
          }
        );

        clearTimeout(timeoutId);

        if (response.ok) {
          const end = performance.now();
          const latency = end - start;

          // Sanity check: reasonable latency range (1ms to 10s)
          if (latency >= 1 && latency <= 10000) {
            results.push(latency);
            // If we got a successful local measurement, prefer it
            if (endpoint === '/api/ping') {
              break;
            }
          }
        }
      } catch (error: unknown) {
        if (error instanceof Error && error.name !== 'AbortError') {
          console.warn(`Latency test failed for ${endpoint}:`, error);
        }

        // For external endpoints that might have CORS issues, try no-cors mode
        if (
          endpoint.includes('google.com') ||
          endpoint.includes('cloudflare.com')
        ) {
          try {
            const start = performance.now();
            await fetch(endpoint, {
              method: 'HEAD',
              cache: 'no-cache',
              mode: 'no-cors',
            });
            const end = performance.now();
            const latency = end - start;
            if (latency >= 1 && latency <= 10000) {
              results.push(latency);
            }
          } catch (corsError) {
            console.warn('CORS latency test also failed:', corsError);
          }
        }
      }

      // Break early if we have enough successful measurements
      if (results.length >= 2) break;
    }

    if (results.length > 0) {
      // Return median latency for better accuracy (less affected by outliers)
      const sorted = results.slice().sort((a, b) => a - b);
      const median =
        sorted.length % 2 === 0
          ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
          : sorted[Math.floor(sorted.length / 2)];

      return Math.round(median);
    }

    return 0;
  }, []);

  const measureBandwidth = useCallback(async (): Promise<number> => {
    try {
      const results: number[] = [];

      // Method 1: Use built-in Network Information API (most accurate when available)
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        if (connection && connection.downlink && connection.downlink > 0) {
          results.push(connection.downlink);
        }
      }

      // Method 2: Download test files with known sizes
      const testFiles = [
        // Use multiple CDNs for better reliability
        {
          url: 'https://speed.cloudflare.com/__down?bytes=500000',
          size: 500000,
        }, // 500KB from Cloudflare
        { url: 'https://httpbin.org/bytes/100000', size: 100000 }, // 100KB from HTTPBin
      ];

      // Test multiple files in parallel for better accuracy
      const downloadPromises = testFiles.map(async (testFile) => {
        try {
          const start = performance.now();

          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

          const response = await fetch(`${testFile.url}?t=${Date.now()}`, {
            method: 'GET',
            cache: 'no-cache',
            signal: controller.signal,
          });

          clearTimeout(timeoutId);

          if (response.ok && response.body) {
            const reader = response.body.getReader();
            let receivedLength = 0;

            // Read the stream to measure actual download speed
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              receivedLength += value?.length || 0;
            }

            const end = performance.now();
            const durationSeconds = (end - start) / 1000;

            if (durationSeconds > 0 && receivedLength > 0) {
              const bandwidthMbps =
                (receivedLength * 8) / (durationSeconds * 1000000);

              // Sanity check: reasonable bandwidth range (0.1 Mbps to 1000 Mbps)
              if (bandwidthMbps >= 0.1 && bandwidthMbps <= 1000) {
                return bandwidthMbps;
              }
            }
          }
        } catch (error: unknown) {
          if (error instanceof Error && error.name !== 'AbortError') {
            console.warn(`Bandwidth test failed for ${testFile.url}:`, error);
          }
        }
        return 0;
      });

      const downloadResults = await Promise.all(downloadPromises);
      results.push(...downloadResults.filter((result) => result > 0));

      // Method 3: Analyze recent resource loading performance
      if ('performance' in window && 'getEntriesByType' in performance) {
        try {
          const recentResources = performance
            .getEntriesByType('resource')
            .filter((entry: any) => {
              // Filter for meaningful resource sizes and recent loads
              return (
                entry.transferSize > 5000 &&
                Date.now() - entry.startTime < 30000 && // Last 30 seconds
                entry.responseEnd > entry.requestStart
              );
            })
            .slice(-3); // Take most recent 3 resources

          recentResources.forEach((entry: any) => {
            const duration = entry.responseEnd - entry.requestStart;
            if (duration > 0) {
              const bandwidthMbps =
                (entry.transferSize * 8) / (duration * 1000);
              if (bandwidthMbps >= 0.1 && bandwidthMbps <= 1000) {
                results.push(bandwidthMbps);
              }
            }
          });
        } catch (error) {
          console.warn('Resource timing analysis failed:', error);
        }
      }

      // Calculate weighted average (give more weight to recent direct tests)
      if (results.length > 0) {
        // Remove outliers (values beyond 1.5 * IQR from median)
        const sorted = results.slice().sort((a, b) => a - b);
        const q1 = sorted[Math.floor(sorted.length / 4)];
        const q3 = sorted[Math.floor((sorted.length * 3) / 4)];
        const iqr = q3 - q1;
        const lowerBound = q1 - 1.5 * iqr;
        const upperBound = q3 + 1.5 * iqr;

        const filteredResults = results.filter(
          (val) => val >= lowerBound && val <= upperBound
        );

        if (filteredResults.length > 0) {
          const avgBandwidth =
            filteredResults.reduce((sum, bw) => sum + bw, 0) /
            filteredResults.length;
          return Math.round(avgBandwidth * 10) / 10;
        }
      }

      // Final fallback: Basic connectivity test
      const fallbackStart = performance.now();
      const fallbackResponse = await fetch(
        'https://www.google.com/favicon.ico?' + Date.now(),
        {
          method: 'HEAD',
          cache: 'no-cache',
        }
      );

      if (fallbackResponse.ok) {
        const fallbackEnd = performance.now();
        const fallbackLatency = fallbackEnd - fallbackStart;

        // Estimate bandwidth based on latency (very rough approximation)
        if (fallbackLatency < 50) return 25.0; // Good connection
        if (fallbackLatency < 100) return 10.0; // Moderate connection
        if (fallbackLatency < 300) return 5.0; // Slow connection
        return 1.0; // Very slow connection
      }

      return 0;
    } catch (error) {
      console.error('All bandwidth measurement methods failed:', error);
      return 0;
    }
  }, []);

  const measureNetworkQuality = useCallback(async () => {
    setIsLoadingNetworkStats(true);

    try {
      // Measure latency multiple times for better accuracy
      const latencyTests = await Promise.all([
        measureLatency(),
        measureLatency(),
        measureLatency(),
        measureLatency(),
        measureLatency(),
      ]);

      const validLatencies = latencyTests.filter((l) => l > 0);
      const avgLatency =
        validLatencies.length > 0
          ? Math.round(
              validLatencies.reduce((a, b) => a + b) / validLatencies.length
            )
          : 0;

      // Calculate jitter (variation in latency)
      const jitter =
        validLatencies.length > 1
          ? Math.round(
              Math.sqrt(
                validLatencies.reduce(
                  (acc, lat) => acc + Math.pow(lat - avgLatency, 2),
                  0
                ) / validLatencies.length
              )
            )
          : 0;

      // Measure bandwidth
      const bandwidth = await measureBandwidth();

      // Estimate packet loss based on failed requests
      const packetLoss =
        ((latencyTests.length - validLatencies.length) / latencyTests.length) *
        100;

      // Get connection information if available
      const connection =
        (navigator as any).connection ||
        (navigator as any).mozConnection ||
        (navigator as any).webkitConnection;
      let effectiveType = '';
      let downlink = bandwidth;

      if (connection) {
        effectiveType = connection.effectiveType || '';
        downlink = connection.downlink || bandwidth;
      }

      setNetworkStats({
        bandwidth: `${downlink.toFixed(1)} Mbps`,
        latency: avgLatency > 0 ? `${avgLatency} ms` : '-- ms',
        packetLoss: `${packetLoss.toFixed(1)}%`,
        jitter: jitter > 0 ? `${jitter} ms` : '-- ms',
      });
    } catch (error) {
      console.error('Network quality measurement failed:', error);
      setNetworkStats({
        bandwidth: 'Error',
        latency: 'Error',
        packetLoss: 'Error',
        jitter: 'Error',
      });
    } finally {
      setIsLoadingNetworkStats(false);
    }
  }, [measureLatency, measureBandwidth]);

  // Initial network measurement on component mount
  useEffect(() => {
    measureNetworkQuality();
  }, [measureNetworkQuality]);

  return {
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
  };
};
