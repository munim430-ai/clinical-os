import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Vibration,
} from 'react-native';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import { BlurView } from 'expo-blur';
import { ScanLine, Camera, X, Check, FileText, AlertTriangle } from 'lucide-react';
import { MotiView } from 'moti';
import { FrostedGlass } from '@/components/ui/glassmorphism';
import { AmbientMeshGradient } from '@/components/backgrounds/mesh-gradient';
import { triggerSelectionHaptic, triggerSuccessHaptic, triggerAlertHaptic } from '@/lib/clinical-haptics';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface ScribeLensViewfinderProps {
  onClose: () => void;
  onCapture: (data: any) => void;
  mode?: 'document' | 'prescription' | 'lab' | 'vitals';
}

export function ScribeLensViewfinder({ onClose, onCapture, mode = 'document' }: ScribeLensViewfinderProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  
  const scanLineAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const device = useCameraDevice('back');
  const { hasPermission, requestPermission } = useCameraPermission();

  useEffect(() => {
    // Animate in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    if (!hasPermission) {
      requestPermission();
    }
  }, []);

  useEffect(() => {
    if (isScanning) {
      // Scan line animation
      const scanLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(scanLineAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(scanLineAnim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      );
      scanLoop.start();

      // Pulse animation
      const pulseLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      pulseLoop.start();

      // Simulate scanning progress
      const progressInterval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            setIsScanning(false);
            clearInterval(progressInterval);
            handleScanComplete();
            return 100;
          }
          return prev + 10;
        });
      }, 200);

      return () => {
        scanLoop.stop();
        pulseLoop.stop();
        clearInterval(progressInterval);
      };
    }
  }, [isScanning]);

  const handleStartScan = () => {
    triggerSelectionHaptic();
    setIsScanning(true);
    setScanProgress(0);
    setCapturedImage(null);
  };

  const handleStopScan = () => {
    triggerAlertHaptic();
    setIsScanning(false);
    setScanProgress(0);
  };

  const handleScanComplete = () => {
    triggerSuccessHaptic();
    Vibration.vibrate(200);
    setProcessing(true);
    
    // Simulate processing
    setTimeout(() => {
      setProcessing(false);
      setCapturedImage('simulated-capture');
    }, 1500);
  };

  const handleRetake = () => {
    triggerSelectionHaptic();
    setCapturedImage(null);
    setScanProgress(0);
  };

  const handleConfirm = () => {
    triggerSuccessHaptic();
    onCapture({
      image: capturedImage,
      mode,
      timestamp: new Date().toISOString(),
    });
    onClose();
  };

  const getModeInfo = () => {
    switch (mode) {
      case 'document':
        return { title: 'Document Scanner', icon: <FileText size={20} color="#C8F53C" />, color: '#C8F53C' };
      case 'prescription':
        return { title: 'Prescription Reader', icon: <FileText size={20} color="#00D7B5" />, color: '#00D7B5' };
      case 'lab':
        return { title: 'Lab Report Scanner', icon: <FileText size={20} color="#64D2FF" />, color: '#64D2FF' };
      case 'vitals':
        return { title: 'Vitals Monitor', icon: <AlertTriangle size={20} color="#FFD60A" />, color: '#FFD60A' };
      default:
        return { title: 'Document Scanner', icon: <FileText size={20} color="#C8F53C" />, color: '#C8F53C' };
    }
  };

  const modeInfo = getModeInfo();

  if (!hasPermission) {
    return (
      <AmbientMeshGradient>
        <View style={styles.permissionContainer}>
          <View style={styles.permissionContent}>
            <Camera size={48} color="#7A7A80" />
            <Text style={styles.permissionTitle}>Camera Permission Required</Text>
            <Text style={styles.permissionText}>
              Clinical OS needs camera access to scan documents and medical records
            </Text>
            <TouchableOpacity
              style={styles.permissionButton}
              onPress={requestPermission}
            >
              <Text style={styles.permissionButtonText}>Grant Permission</Text>
            </TouchableOpacity>
          </View>
        </View>
      </AmbientMeshGradient>
    );
  }

  if (!device) {
    return (
      <AmbientMeshGradient>
        <View style={styles.errorContainer}>
          <AlertTriangle size={48} color="#FF453A" />
          <Text style={styles.errorTitle}>Camera Not Available</Text>
          <Text style={styles.errorText}>No camera device found on this device</Text>
          <TouchableOpacity style={styles.errorButton} onPress={onClose}>
            <Text style={styles.errorButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </AmbientMeshGradient>
    );
  }

  return (
    <AmbientMeshGradient>
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color="#FFFFFF" />
          </TouchableOpacity>
          
          <View style={styles.headerContent}>
            <View style={styles.modeInfo}>
              {modeInfo.icon}
              <Text style={styles.modeTitle}>{modeInfo.title}</Text>
            </View>
            {isScanning && (
              <View style={styles.scanningInfo}>
                <Text style={styles.scanningText}>Scanning... {scanProgress}%</Text>
              </View>
            )}
          </View>
        </View>

        {/* Camera/Viewfinder Area */}
        <View style={styles.viewfinderContainer}>
          {!capturedImage ? (
            <>
              {/* Camera View */}
              <Camera
                style={styles.camera}
                device={device}
                isActive={!processing}
                photo={true}
              />

              {/* Scanning Overlay */}
              <View style={styles.scanOverlay}>
                {/* Viewfinder Frame */}
                <MotiView
                  animate={{
                    borderColor: isScanning ? modeInfo.color : '#7A7A80',
                    transform: [{ scale: pulseAnim }],
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 30,
                  }}
                  style={styles.viewfinder}
                >
                  {/* Corner Markers */}
                  <View style={[styles.corner, styles.topLeft]} />
                  <View style={[styles.corner, styles.topRight]} />
                  <View style={[styles.corner, styles.bottomLeft]} />
                  <View style={[styles.corner, styles.bottomRight]} />

                  {/* Scanning Line */}
                  {isScanning && (
                    <Animated.View
                      style={[
                        styles.scanLine,
                        {
                          transform: [
                            {
                              translateY: scanLineAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, 200],
                              }),
                            },
                          ],
                        },
                      ]}
                    >
                      <ScanLine size={40} color={modeInfo.color} />
                    </Animated.View>
                  )}
                </MotiView>

                {/* Instructions */}
                <View style={styles.instructions}>
                  <Text style={styles.instructionText}>
                    {isScanning 
                      ? 'Align document within frame...' 
                      : 'Position document and tap Scan'
                    }
                  </Text>
                </View>
              </View>

              {/* Processing Overlay */}
              {processing && (
                <View style={styles.processingOverlay}>
                  <MotiView
                    animate={{ rotate: '360deg' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30, repeat: Infinity }}
                  >
                    <Camera size={40} color="#C8F53C" />
                  </MotiView>
                  <Text style={styles.processingText}>Processing document...</Text>
                </View>
              )}
            </>
          ) : (
            /* Captured Image Preview */
            <View style={styles.previewContainer}>
              <View style={styles.previewPlaceholder}>
                <Check size={48} color="#00D7B5" />
                <Text style={styles.previewTitle}>Document Captured</Text>
                <Text style={styles.previewSubtitle}>
                  Text extraction and analysis complete
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          {!capturedImage ? (
            <View style={styles.scanControls}>
              <TouchableOpacity
                style={[
                  styles.scanButton,
                  isScanning && styles.scanButtonActive,
                  { backgroundColor: isScanning ? modeInfo.color : '#1A1A1A' }
                ]}
                onPress={isScanning ? handleStopScan : handleStartScan}
              >
                <ScanLine size={24} color="#FFFFFF" />
                <Text style={styles.scanButtonText}>
                  {isScanning ? 'Stop' : 'Scan'}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.captureControls}>
              <TouchableOpacity
                style={styles.retakeButton}
                onPress={handleRetake}
              >
                <X size={20} color="#FFFFFF" />
                <Text style={styles.retakeButtonText}>Retake</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleConfirm}
              >
                <Check size={20} color="#FFFFFF" />
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Animated.View>
    </AmbientMeshGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    zIndex: 10,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContent: {
    marginTop: 20,
    alignItems: 'center',
  },
  modeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  modeTitle: {
    marginLeft: 8,
    fontSize: 18,
    fontFamily: 'Geist-Bold',
    color: '#FFFFFF',
  },
  scanningInfo: {
    backgroundColor: 'rgba(184, 255, 210, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  scanningText: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: '#C8F53C',
  },
  viewfinderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    ...StyleSheet.absoluteFillObject,
  },
  scanOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewfinder: {
    width: 280,
    height: 200,
    borderWidth: 2,
    borderRadius: 16,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#FFFFFF',
  },
  topLeft: {
    top: -2,
    left: -2,
  },
  topRight: {
    top: -2,
    right: -2,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderLeftWidth: 0,
  },
  bottomLeft: {
    bottom: -2,
    left: -2,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: -2,
    right: -2,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderTopWidth: 0,
    borderLeftWidth: 0,
  },
  scanLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  instructions: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  instructionText: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: '#FFFFFF',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  processingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingText: {
    marginTop: 16,
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: '#FFFFFF',
  },
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewPlaceholder: {
    alignItems: 'center',
    padding: 40,
  },
  previewTitle: {
    marginTop: 16,
    fontSize: 20,
    fontFamily: 'Geist-Bold',
    color: '#FFFFFF',
  },
  previewSubtitle: {
    marginTop: 8,
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: '#B8B8BE',
    textAlign: 'center',
  },
  controls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
  scanControls: {
    alignItems: 'center',
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  scanButtonActive: {
    borderColor: '#C8F53C',
  },
  scanButtonText: {
    marginLeft: 8,
    fontSize: 18,
    fontFamily: 'Geist-Bold',
    color: '#FFFFFF',
  },
  captureControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  retakeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: '#1C1C1E',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginRight: 12,
  },
  retakeButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#FFFFFF',
  },
  confirmButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: '#00D7B5',
    borderWidth: 1,
    borderColor: 'rgba(0, 215, 181, 0.3)',
  },
  confirmButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#FFFFFF',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  permissionContent: {
    alignItems: 'center',
  },
  permissionTitle: {
    marginTop: 20,
    fontSize: 20,
    fontFamily: 'Geist-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  permissionText: {
    marginTop: 12,
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: '#B8B8BE',
    textAlign: 'center',
  },
  permissionButton: {
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: '#C8F53C',
  },
  permissionButtonText: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#000000',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorTitle: {
    marginTop: 20,
    fontSize: 20,
    fontFamily: 'Geist-Bold',
    color: '#FF453A',
    textAlign: 'center',
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: '#B8B8BE',
    textAlign: 'center',
  },
  errorButton: {
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: '#FF453A',
  },
  errorButtonText: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#FFFFFF',
  },
});
