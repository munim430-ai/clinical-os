import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import { 
  Siren, 
  AlertTriangle, 
  Heart, 
  Zap, 
  Activity, 
  Droplet, 
  Pill, 
  Phone,
  Clock,
  ChevronRight,
} from 'lucide-react';
import { MotiView } from 'moti';
import { EmergencyMeshGradient } from '@/components/backgrounds/mesh-gradient';
import { GlassCard } from '@/components/ui/glassmorphism';
import { triggerEmergencyHaptic, triggerSelectionHaptic } from '@/lib/clinical-haptics';

const { width: screenWidth } = Dimensions.get('window');

interface EmergencyProtocol {
  id: string;
  title: string;
  subtitle: string;
  urgency: 'critical' | 'urgent' | 'important';
  icon: React.ReactNode;
  action: () => void;
  dosage?: string;
  time?: string;
}

export function ERModeDashboard({ navigation }: any) {
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
  const [activeProtocol, setActiveProtocol] = useState<EmergencyProtocol | null>(null);

  // Emergency protocols for critical situations
  const emergencyProtocols: EmergencyProtocol[] = [
    {
      id: 'anaphylaxis',
      title: 'ANAPHYLAXIS',
      subtitle: 'Immediate epinephrine required',
      urgency: 'critical',
      icon: <Siren size={32} color="#FFFFFF" />,
      action: () => handleAnaphylaxis(),
      dosage: 'Epinephrine 0.3-0.5mg IM',
      time: 'NOW',
    },
    {
      id: 'cardiac',
      title: 'CARDIAC ARREST',
      subtitle: 'Start CPR immediately',
      urgency: 'critical',
      icon: <Heart size={32} color="#FFFFFF" />,
      action: () => handleCardiacArrest(),
      dosage: 'CPR 30:2 ratio',
      time: 'NOW',
    },
    {
      id: 'seizure',
      title: 'SEIZURE',
      subtitle: 'Protect airway, give benzodiazepine',
      urgency: 'urgent',
      icon: <Zap size={32} color="#FFFFFF" />,
      action: () => handleSeizure(),
      dosage: 'Diazepam 5-10mg IV',
      time: 'Within 5 min',
    },
    {
      id: 'hemorrhage',
      title: 'MASSIVE HEMORRHAGE',
      subtitle: 'Apply pressure, transfuse',
      urgency: 'critical',
      icon: <Droplet size={32} color="#FFFFFF" />,
      action: () => handleHemorrhage(),
      dosage: 'O-negative blood',
      time: 'STAT',
    },
    {
      id: 'overdose',
      title: 'DRUG OVERDOSE',
      subtitle: 'Check airway, give naloxone',
      urgency: 'urgent',
      icon: <Pill size={32} color="#FFFFFF" />,
      action: () => handleOverdose(),
      dosage: 'Naloxone 0.4-2mg IV',
      time: 'Within 2 min',
    },
    {
      id: 'respiratory',
      title: 'RESPIRATORY FAILURE',
      subtitle: 'Oxygen, prepare intubation',
      urgency: 'critical',
      icon: <Activity size={32} color="#FFFFFF" />,
      action: () => handleRespiratoryFailure(),
      dosage: 'O2 15L/min via mask',
      time: 'IMMEDIATE',
    },
  ];

  useEffect(() => {
    // Auto-enter emergency mode on mount
    setIsEmergencyMode(true);
    triggerEmergencyHaptic();
  }, []);

  const handleAnaphylaxis = () => {
    Alert.alert(
      'ANAPHYLAXIS PROTOCOL',
      '1. Epinephrine 0.3-0.5mg IM (1:1000)\n2. Airway support\n3. IV fluids\n4. Antihistamines\n5. Corticosteroids',
      [{ text: 'UNDERSTOOD', style: 'destructive' }]
    );
  };

  const handleCardiacArrest = () => {
    Alert.alert(
      'CARDIAC ARREST PROTOCOL',
      '1. Call for help\n2. Start CPR 30:2\n3. Attach AED/defibrillator\n4. Give epinephrine 1mg IV/IO q3-5min\n5. Advanced airway',
      [{ text: 'UNDERSTOOD', style: 'destructive' }]
    );
  };

  const handleSeizure = () => {
    Alert.alert(
      'SEIZURE PROTOCOL',
      '1. Protect airway\n2. Diazepam 5-10mg IV/PR\n3. Check glucose\n4. Consider phenytoin loading\n5. Monitor vitals',
      [{ text: 'UNDERSTOOD', style: 'destructive' }]
    );
  };

  const handleHemorrhage = () => {
    Alert.alert(
      'MASSIVE HEMORRHAGE PROTOCOL',
      '1. Direct pressure\n2. Tourniquet if limb\n3. O-negative blood STAT\n4. Massive transfusion protocol\n5. Surgical consult',
      [{ text: 'UNDERSTOOD', style: 'destructive' }]
    );
  };

  const handleOverdose = () => {
    Alert.alert(
      'DRUG OVERDOSE PROTOCOL',
      '1. Check airway/breathing\n2. Naloxone 0.4-2mg IV\n3. Repeat q2-3min\n4. Monitor for re-sedation\n5. Consider activated charcoal',
      [{ text: 'UNDERSTOOD', style: 'destructive' }]
    );
  };

  const handleRespiratoryFailure = () => {
    Alert.alert(
      'RESPIRATORY FAILURE PROTOCOL',
      '1. High-flow O2 15L/min\n2. Prepare intubation\n3. Rapid sequence induction\n4. Mechanical ventilation\n5. ABG monitoring',
      [{ text: 'UNDERSTOOD', style: 'destructive' }]
    );
  };

  const handleEmergencyCall = () => {
    triggerEmergencyHaptic();
    Alert.alert(
      'EMERGENCY CALL',
      'Calling emergency services and hospital code team...',
      [{ text: 'CALL NOW', style: 'destructive' }]
    );
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return '#FF453A';
      case 'urgent': return '#FFD60A';
      case 'important': return '#64D2FF';
      default: return '#FF453A';
    }
  };

  const getUrgencyBg = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'rgba(255, 69, 58, 0.1)';
      case 'urgent': return 'rgba(255, 214, 10, 0.1)';
      case 'important': return 'rgba(100, 210, 255, 0.1)';
      default: return 'rgba(255, 69, 58, 0.1)';
    }
  };

  return (
    <EmergencyMeshGradient>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Emergency Header */}
        <MotiView
          animate={{
            scale: isEmergencyMode ? [1, 1.05, 1] : 1,
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30,
            repeat: isEmergencyMode ? Infinity : 0,
          }}
        >
          <View style={styles.emergencyHeader}>
            <View style={styles.headerTop}>
              <MotiView
                animate={{
                  rotate: isEmergencyMode ? '360deg' : '0deg',
                }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 30,
                  repeat: isEmergencyMode ? Infinity : 0,
                }}
              >
                <Siren size={48} color="#FF453A" />
              </MotiView>
              <View style={styles.headerText}>
                <Text style={styles.emergencyTitle}>EMERGENCY MODE</Text>
                <Text style={styles.emergencySubtitle}>CRITICAL CARE PROTOCOLS</Text>
              </View>
            </View>
            
            {/* Emergency Call Button */}
            <TouchableOpacity
              style={styles.emergencyCallButton}
              onPress={handleEmergencyCall}
              activeOpacity={0.8}
            >
              <Phone size={24} color="#FFFFFF" />
              <Text style={styles.emergencyCallText}>CALL CODE</Text>
            </TouchableOpacity>
          </View>
        </MotiView>

        {/* Critical Protocols */}
        <View style={styles.protocolsSection}>
          <Text style={styles.sectionTitle}>CRITICAL PROTOCOLS</Text>
          
          {emergencyProtocols.map((protocol, index) => (
            <MotiView
              key={protocol.id}
              from={{ opacity: 0, translateX: -50 }}
              animate={{ opacity: 1, translateX: 0 }}
              transition={{ delay: index * 100, type: 'spring', stiffness: 300 }}
            >
              <TouchableOpacity
                style={[
                  styles.protocolCard,
                  { 
                    borderLeftWidth: 4,
                    borderLeftColor: getUrgencyColor(protocol.urgency),
                    backgroundColor: getUrgencyBg(protocol.urgency),
                  }
                ]}
                onPress={() => {
                  triggerSelectionHaptic();
                  setActiveProtocol(protocol);
                  protocol.action();
                }}
                activeOpacity={0.7}
              >
                <View style={styles.protocolContent}>
                  <View style={styles.protocolHeader}>
                    <View style={styles.protocolIcon}>
                      {protocol.icon}
                    </View>
                    <View style={styles.protocolInfo}>
                      <Text style={styles.protocolTitle}>{protocol.title}</Text>
                      <Text style={styles.protocolSubtitle}>{protocol.subtitle}</Text>
                    </View>
                    <ChevronRight size={24} color="#7A7A80" />
                  </View>
                  
                  {/* Critical Info */}
                  <View style={styles.criticalInfo}>
                    {protocol.dosage && (
                      <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>DOSAGE:</Text>
                        <Text style={styles.infoValue}>{protocol.dosage}</Text>
                      </View>
                    )}
                    {protocol.time && (
                      <View style={styles.infoRow}>
                        <Clock size={16} color="#FF453A" />
                        <Text style={[styles.infoValue, { color: '#FF453A' }]}>
                          {protocol.time}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            </MotiView>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>QUICK ACTIONS</Text>
          
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity style={styles.quickActionButton}>
              <Heart size={24} color="#FF453A" />
              <Text style={styles.quickActionText}>VITALS</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickActionButton}>
              <Droplet size={24} color="#64D2FF" />
              <Text style={styles.quickActionText}>FLUIDS</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickActionButton}>
              <Pill size={24} color="#FFD60A" />
              <Text style={styles.quickActionText}>DRUGS</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickActionButton}>
              <AlertTriangle size={24} color="#C8F53C" />
              <Text style={styles.quickActionText}>ALERTS</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom spacing for one-handed reach */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </EmergencyMeshGradient>
  );
}

const styles = {
  container: {
    flex: 1,
  },
  emergencyHeader: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    flex: 1,
    marginLeft: 20,
  },
  emergencyTitle: {
    fontSize: 28,
    fontFamily: 'Geist-ExtraBold',
    color: '#FF453A',
    marginBottom: 4,
  },
  emergencySubtitle: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#B8B8BE',
  },
  emergencyCallButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF453A',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 69, 58, 0.3)',
  },
  emergencyCallText: {
    marginLeft: 12,
    fontSize: 18,
    fontFamily: 'Geist-Bold',
    color: '#FFFFFF',
  },
  protocolsSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Geist-Bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  protocolCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  protocolContent: {
    flex: 1,
  },
  protocolHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  protocolIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  protocolInfo: {
    flex: 1,
  },
  protocolTitle: {
    fontSize: 20,
    fontFamily: 'Geist-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  protocolSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: '#B8B8BE',
  },
  criticalInfo: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoLabel: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: '#7A7A80',
  },
  infoValue: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: '#FFFFFF',
  },
  quickActionsSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionButton: {
    width: (screenWidth - 64) / 2,
    height: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionText: {
    marginTop: 8,
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: '#FFFFFF',
  },
  bottomSpacing: {
    height: 120, // Extra space for one-handed reach
  },
};
