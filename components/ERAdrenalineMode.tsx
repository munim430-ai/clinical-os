import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Vibration,
  Animated,
  Alert,
  Dimensions,
} from 'react-native';

interface ERDrug {
  id: string;
  name: string;
  dose: string;
  concentration: string;
  maxDose: string;
  indication: string;
  route: string;
}

const { width: screenWidth } = Dimensions.get('window');

const ERAdrenalineMode: React.FC = () => {
  const [patientWeight, setPatientWeight] = useState('');
  const [isActivated, setIsActivated] = useState(false);
  const [calculatedDoses, setCalculatedDoses] = useState<ERDrug[]>([]);
  const [pulseAnimation] = useState(new Animated.Value(1));
  const [borderAnimation] = useState(new Animated.Value(1));
  const inputRef = useRef<TextInput>(null);

  // ER drug database with dosing
  const erDrugs: ERDrug[] = [
    {
      id: '1',
      name: 'Adrenaline (Epinephrine)',
      dose: '0.01 mg/kg',
      concentration: '1:10,000',
      maxDose: '1 mg',
      indication: 'Cardiac arrest',
      route: 'IV/IO',
    },
    {
      id: '2',
      name: 'Atropine',
      dose: '0.02 mg/kg',
      concentration: '0.1 mg/mL',
      maxDose: '0.5 mg',
      indication: 'Bradycardia',
      route: 'IV/IO',
    },
    {
      id: '3',
      name: 'Amiodarone',
      dose: '5 mg/kg',
      concentration: '50 mg/mL',
      maxDose: '300 mg',
      indication: 'VF/VT',
      route: 'IV',
    },
    {
      id: '4',
      name: 'Lidocaine',
      dose: '1 mg/kg',
      concentration: '20 mg/mL',
      maxDose: '100 mg',
      indication: 'VF/VT',
      route: 'IV',
    },
    {
      id: '5',
      name: 'Magnesium Sulfate',
      dose: '25-50 mg/kg',
      concentration: '50 mg/mL',
      maxDose: '2 g',
      indication: 'Torsades',
      route: 'IV',
    },
    {
      id: '6',
      name: 'Dextrose 50%',
      dose: '0.5 g/kg',
      concentration: '50% solution',
      maxDose: '25 g',
      indication: 'Hypoglycemia',
      route: 'IV',
    },
    {
      id: '7',
      name: 'Naloxone',
      dose: '0.1 mg/kg',
      concentration: '0.4 mg/mL',
      maxDose: '2 mg',
      indication: 'Opioid overdose',
      route: 'IV/IO/IM',
    },
    {
      id: '8',
      name: 'Flumazenil',
      dose: '0.01 mg/kg',
      concentration: '0.1 mg/mL',
      maxDose: '1 mg',
      indication: 'Benzodiazepine overdose',
      route: 'IV',
    },
  ];

  // Calculate doses based on weight
  const calculateDoses = useCallback((weight: number) => {
    const doses = erDrugs.map(drug => {
      let calculatedDose = '';
      let calculatedVolume = '';

      switch (drug.id) {
        case '1': // Adrenaline
          calculatedDose = (weight * 0.01).toFixed(2);
          calculatedVolume = (weight * 0.01 * 10).toFixed(1); // 1:10,000 concentration
          break;
        case '2': // Atropine
          calculatedDose = (weight * 0.02).toFixed(2);
          calculatedVolume = (weight * 0.02 / 0.1).toFixed(1);
          break;
        case '3': // Amiodarone
          calculatedDose = (weight * 5).toFixed(0);
          calculatedVolume = (weight * 5 / 50).toFixed(1);
          break;
        case '4': // Lidocaine
          calculatedDose = (weight * 1).toFixed(0);
          calculatedVolume = (weight * 1 / 20).toFixed(1);
          break;
        case '5': // Magnesium
          calculatedDose = (weight * 25).toFixed(0);
          calculatedVolume = (weight * 25 / 50).toFixed(1);
          break;
        case '6': // Dextrose
          calculatedDose = (weight * 0.5).toFixed(1);
          calculatedVolume = (weight * 0.5 / 0.5).toFixed(1);
          break;
        case '7': // Naloxone
          calculatedDose = (weight * 0.1).toFixed(2);
          calculatedVolume = (weight * 0.1 / 0.4).toFixed(1);
          break;
        case '8': // Flumazenil
          calculatedDose = (weight * 0.01).toFixed(2);
          calculatedVolume = (weight * 0.01 / 0.1).toFixed(1);
          break;
      }

      return {
        ...drug,
        calculatedDose,
        calculatedVolume,
      };
    });

    setCalculatedDoses(doses);
  }, []);

  // Handle ER mode activation (long press prevention)
  const handleERActivation = useCallback(() => {
    Vibration.vibrate(50); // Heavy haptic for critical action
    
    Alert.alert(
      'Activate ER Mode',
      'This will activate emergency drug calculations. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Activate', 
          style: 'destructive',
          onPress: () => {
            setIsActivated(true);
            startPulseAnimation();
            Vibration.vibrate([100, 50, 100]); // Triple vibration
            setTimeout(() => {
              inputRef.current?.focus();
            }, 500);
          }
        }
      ]
    );
  }, []);

  // Start pulse animation for ER mode
  const startPulseAnimation = useCallback(() => {
    const pulse = Animated.sequence([
      Animated.timing(borderAnimation, {
        toValue: 1.2,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(borderAnimation, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]);
    
    Animated.loop(pulse).start();
  }, [borderAnimation]);

  // Handle weight input
  const handleWeightInput = useCallback((text: string) => {
    const weight = parseFloat(text);
    if (!isNaN(weight) && weight > 0 && weight <= 200) {
      calculateDoses(weight);
    }
    setPatientWeight(text);
  }, [calculateDoses]);

  // Handle deactivation
  const handleDeactivate = useCallback(() => {
    Vibration.vibrate(30);
    setIsActivated(false);
    setPatientWeight('');
    setCalculatedDoses([]);
    borderAnimation.stopAnimation();
    borderAnimation.setValue(1);
  }, [borderAnimation]);

  // Render ER drug card
  const renderERDrug = (drug: ERDrug & { calculatedDose?: string; calculatedVolume?: string }) => (
    <View key={drug.id} style={styles.drugCard}>
      <View style={styles.drugHeader}>
        <Text style={styles.drugName}>{drug.name}</Text>
        <View style={styles.drugIndication}>
          <Text style={styles.drugIndicationText}>{drug.indication}</Text>
        </View>
      </View>
      
      <View style={styles.drugDosing}>
        <View style={styles.doseRow}>
          <Text style={styles.doseLabel}>Dose:</Text>
          <Text style={styles.doseValue}>{drug.calculatedDose || drug.dose}</Text>
        </View>
        
        <View style={styles.doseRow}>
          <Text style={styles.doseLabel}>Volume:</Text>
          <Text style={styles.doseValue}>{drug.calculatedVolume || '—'} mL</Text>
        </View>
        
        <View style={styles.doseRow}>
          <Text style={styles.doseLabel}>Max:</Text>
          <Text style={styles.doseValue}>{drug.maxDose}</Text>
        </View>
      </View>
    </View>
  );

  if (!isActivated) {
    return (
      <View style={styles.container}>
        {/* Warning screen */}
        <View style={styles.warningContainer}>
          <Animated.View
            style={[
              styles.warningBorder,
              {
                transform: [{ scale: borderAnimation }],
              }
            ]}
          />
          
          <View style={styles.warningContent}>
            <Text style={styles.warningIcon}>⚡</Text>
            <Text style={styles.warningTitle}>ER Adrenaline Mode</Text>
            <Text style={styles.warningSubtitle}>
              Emergency drug calculations for critical care
            </Text>
            
            <TouchableOpacity
              style={styles.activateButton}
              onPress={handleERActivation}
              activeOpacity={0.7}
            >
              <Text style={styles.activateButtonText}>ACTIVATE</Text>
            </TouchableOpacity>
            
            <View style={styles.warningNotes}>
              <Text style={styles.warningNote}>
                • For emergency situations only
              </Text>
              <Text style={styles.warningNote}>
                • Double-tap to prevent accidental activation
              </Text>
              <Text style={styles.warningNote}>
                • Verify all calculations before administration
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Active ER mode */}
      <View style={styles.activeContainer}>
        {/* Header with deactivation */}
        <View style={styles.activeHeader}>
          <View style={styles.activeHeaderContent}>
            <Text style={styles.activeTitle}>ER MODE ACTIVE</Text>
            <Text style={styles.activeSubtitle}>Emergency Drug Calculator</Text>
          </View>
          
          <TouchableOpacity
            style={styles.deactivateButton}
            onPress={handleDeactivate}
            activeOpacity={0.7}
          >
            <Text style={styles.deactivateButtonText}>EXIT</Text>
          </TouchableOpacity>
        </View>

        {/* Weight input */}
        <View style={styles.weightContainer}>
          <Text style={styles.weightLabel}>Enter Weight (kg)</Text>
          <TextInput
            ref={inputRef}
            style={styles.weightInput}
            value={patientWeight}
            onChangeText={handleWeightInput}
            placeholder="Patient weight in kg"
            placeholderTextColor="#555555"
            keyboardType="numeric"
            returnKeyType="done"
            maxLength={3}
            selectTextOnFocus
          />
        </View>

        {/* Calculated doses */}
        {calculatedDoses.length > 0 && (
          <View style={styles.dosesContainer}>
            <Text style={styles.dosesTitle}>Calculated Doses</Text>
            {calculatedDoses.map(renderERDrug)}
          </View>
        )}

        {/* Quick reference */}
        <View style={styles.quickReference}>
          <Text style={styles.quickReferenceTitle}>Quick Reference</Text>
          <View style={styles.referenceItem}>
            <Text style={styles.referenceLabel}>Adrenaline:</Text>
            <Text style={styles.referenceValue}>1:10,000 for cardiac arrest</Text>
          </View>
          <View style={styles.referenceItem}>
            <Text style={styles.referenceLabel}>Atropine:</Text>
            <Text style={styles.referenceValue}>0.02 mg/kg for bradycardia</Text>
          </View>
          <View style={styles.referenceItem}>
            <Text style={styles.referenceLabel}>Amiodarone:</Text>
            <Text style={styles.referenceValue}>5 mg/kg for VF/VT</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  warningContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  warningBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 4,
    borderColor: '#FF3B30',
    borderRadius: 16,
  },
  warningContent: {
    alignItems: 'center',
  },
  warningIcon: {
    fontSize: 64,
    marginBottom: 24,
  },
  warningTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  warningSubtitle: {
    fontSize: 16,
    color: '#888888',
    textAlign: 'center',
    marginBottom: 48,
  },
  activateButton: {
    backgroundColor: '#FF3B30',
    borderWidth: 2,
    borderColor: '#FF3B30',
    borderRadius: 12,
    paddingHorizontal: 48,
    paddingVertical: 16,
    marginBottom: 32,
  },
  activateButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  warningNotes: {
    alignItems: 'flex-start',
    width: '100%',
  },
  warningNote: {
    fontSize: 12,
    color: '#888888',
    marginBottom: 4,
  },
  activeContainer: {
    flex: 1,
  },
  activeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 64,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#FF3B30',
  },
  activeHeaderContent: {
    flex: 1,
  },
  activeTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FF3B30',
    marginBottom: 4,
  },
  activeSubtitle: {
    fontSize: 14,
    color: '#888888',
  },
  deactivateButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#888888',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  deactivateButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#888888',
  },
  weightContainer: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  weightLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  weightInput: {
    backgroundColor: '#080808',
    borderWidth: 2,
    borderColor: '#FF3B30',
    borderRadius: 12,
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 20,
    textAlign: 'center',
  },
  dosesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  dosesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  drugCard: {
    backgroundColor: '#080808',
    borderWidth: 1,
    borderColor: '#1A1A1A',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  drugHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  drugName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
  },
  drugIndication: {
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  drugIndicationText: {
    fontSize: 10,
    color: '#888888',
    fontWeight: '600',
  },
  drugDosing: {
    gap: 8,
  },
  doseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  doseLabel: {
    fontSize: 14,
    color: '#888888',
  },
  doseValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  quickReference: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#1A1A1A',
  },
  quickReferenceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  referenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  referenceLabel: {
    fontSize: 14,
    color: '#888888',
    fontWeight: '500',
  },
  referenceValue: {
    fontSize: 14,
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'right',
    marginLeft: 16,
  },
});

export default ERAdrenalineMode;
