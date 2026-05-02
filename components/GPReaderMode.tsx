import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Vibration,
  Animated,
} from 'react-native';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';

interface ProtocolStep {
  id: string;
  stepNumber: number;
  heading: string;
  body: string;
  subSteps: string[];
  severity: 'low' | 'moderate' | 'high' | 'critical';
  completed: boolean;
}

interface TableOfContentsItem {
  id: string;
  title: string;
  stepNumber: number;
}

const GPReaderMode: React.FC = () => {
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [selectedStep, setSelectedStep] = useState<string | null>(null);
  const [isReaderMode, setIsReaderMode] = useState(true);
  const [bottomSheetModalRef, setBottomSheetModalRef] = useState<BottomSheetModal | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const [fadeAnim] = useState(new Animated.Value(1));

  // Mock Dengue protocol data - replace with actual database query
  const protocolSteps: ProtocolStep[] = [
    {
      id: '1',
      stepNumber: 1,
      heading: 'Initial Assessment',
      body: 'Complete clinical evaluation and laboratory confirmation of suspected dengue cases',
      subSteps: [
        'Take detailed history including fever onset, warning signs, bleeding manifestations',
        'Perform complete physical examination with vital signs',
        'Check for warning signs: severe abdominal pain, persistent vomiting, clinical fluid accumulation',
        'Assess hydration status and hemodynamic stability',
        'Order baseline investigations: CBC, liver function tests, coagulation profile'
      ],
      severity: 'moderate',
      completed: false,
    },
    {
      id: '2',
      stepNumber: 2,
      heading: 'Laboratory Diagnosis',
      body: 'Confirm dengue infection through appropriate laboratory tests',
      subSteps: [
        'NS1 antigen test - positive from day 1-5 of fever',
        'IgM ELISA - positive from day 5-7 of fever',
        'IgG ELISA - indicates past infection or secondary dengue',
        'RT-PCR - gold standard, expensive, limited availability',
        'Repeat CBC daily for 3-5 days to monitor platelet count and hematocrit'
      ],
      severity: 'moderate',
      completed: false,
    },
    {
      id: '3',
      stepNumber: 3,
      heading: 'Disease Classification',
      body: 'Classify dengue according to WHO 2009 classification',
      subSteps: [
        'Dengue without warning signs: fever plus 2 of: nausea/vomiting, rash, aches/pains, leukopenia, positive tourniquet test',
        'Dengue with warning signs: fever plus any warning sign plus thrombocytopenia (<100,000) and rising hematocrit',
        'Severe dengue: any of: severe plasma leakage, severe bleeding, severe organ impairment',
        'Monitor for progression from one category to next'
      ],
      severity: 'moderate',
      completed: false,
    },
    {
      id: '4',
      stepNumber: 4,
      heading: 'Warning Signs Assessment',
      body: 'Identify patients at high risk for complications',
      subSteps: [
        'Abdominal pain or tenderness',
        'Persistent vomiting (≥3 times in 24 hours)',
        'Clinical fluid accumulation (ascites, pleural effusion)',
        'Mucosal bleed (gum bleed, nose bleed)',
        'Lethargy or restlessness',
        'Liver enlargement >2 cm',
        'Rapid increase in hematocrit with rapid decrease in platelet count'
      ],
      severity: 'high',
      completed: false,
    },
    {
      id: '5',
      stepNumber: 5,
      heading: 'Outpatient Management',
      body: 'Home care for mild cases without warning signs',
      subSteps: [
        'Ensure adequate oral fluid intake: 2-3 liters/day or 75 mL/kg/day for children',
        'Paracetamol for fever: 10-15 mg/kg/dose every 6 hours (max 4 doses/day)',
        'Avoid NSAIDs (ibuprofen, aspirin) due to bleeding risk',
        'Monitor temperature twice daily',
        'Watch for warning signs - return immediately if any develop',
        'Daily CBC until platelet count shows rising trend'
      ],
      severity: 'low',
      completed: false,
    },
    {
      id: '6',
      stepNumber: 6,
      heading: 'Discharge Criteria',
      body: 'When patients can be safely discharged',
      subSteps: [
        'Afebrile for 48 hours without antipyretics',
        'Platelet count >50,000 cells/mm³ with rising trend',
        'No warning signs present',
        'Adequate oral intake maintained',
        'Hematocrit stable and decreasing',
        'Patient able to follow up if needed'
      ],
      severity: 'low',
      completed: false,
    },
  ];

  // Table of contents for quick navigation
  const tableOfContents: TableOfContentsItem[] = protocolSteps.map(step => ({
    id: step.id,
    title: step.heading,
    stepNumber: step.stepNumber,
  }));

  // Handle step completion toggle
  const handleStepToggle = useCallback((stepId: string) => {
    Vibration.vibrate(10);
    setCompletedSteps(prev => {
      const newSet = new Set(prev);
      if (newSet.has(stepId)) {
        newSet.delete(stepId);
      } else {
        newSet.add(stepId);
      }
      return newSet;
    });
  }, []);

  // Handle sub-step completion
  const handleSubStepToggle = useCallback((stepId: string, subStepIndex: number) => {
    Vibration.vibrate(5);
    // In a real implementation, you'd track sub-step completion separately
  }, []);

  // Handle table of contents navigation
  const handleTOCPress = useCallback((stepId: string) => {
    Vibration.vibrate(8);
    setSelectedStep(stepId);
    bottomSheetModalRef?.dismiss();
    
    // Scroll to the step
    setTimeout(() => {
      // In a real implementation, you'd scroll to the specific step
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }, 300);
  }, [bottomSheetModalRef]);

  // Handle reader mode toggle
  const handleReaderModeToggle = useCallback(() => {
    Vibration.vibrate(10);
    setIsReaderMode(prev => !prev);
    
    Animated.timing(fadeAnim, {
      toValue: isReaderMode ? 0.8 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isReaderMode, fadeAnim]);

  // Get severity color
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#FF3B30';
      case 'high': return '#FF9500';
      case 'moderate': return '#FFCC00';
      case 'low': return '#34C759';
      default: return '#8E8E93';
    }
  };

  // Render protocol step
  const renderProtocolStep = (step: ProtocolStep) => {
    const isCompleted = completedSteps.has(step.id);
    const isSelected = selectedStep === step.id;
    
    return (
      <View
        key={step.id}
        style={[
          styles.stepContainer,
          isSelected && styles.stepSelected,
          isCompleted && styles.stepCompleted
        ]}
      >
        <View style={styles.stepHeader}>
          <TouchableOpacity
            style={[styles.stepCheckbox, isCompleted && styles.stepCheckboxCompleted]}
            onPress={() => handleStepToggle(step.id)}
            activeOpacity={0.7}
          >
            <Text style={[styles.stepCheckboxText, isCompleted && styles.stepCheckboxTextCompleted]}>
              {isCompleted ? '✓' : ''}
            </Text>
          </TouchableOpacity>
          
          <View style={styles.stepTitleContainer}>
            <Text style={styles.stepNumber}>Step {step.stepNumber}</Text>
            <Text style={styles.stepHeading}>{step.heading}</Text>
          </View>
          
          <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(step.severity) }]}>
            <Text style={styles.severityText}>{step.severity}</Text>
          </View>
        </View>

        <Text style={styles.stepBody}>{step.body}</Text>

        {step.subSteps.length > 0 && (
          <View style={styles.subStepsContainer}>
            {step.subSteps.map((subStep, index) => (
              <TouchableOpacity
                key={index}
                style={styles.subStepItem}
                onPress={() => handleSubStepToggle(step.id, index)}
                activeOpacity={0.7}
              >
                <View style={styles.subStepCheckbox}>
                  <Text style={styles.subStepCheckboxText}>○</Text>
                </View>
                <Text style={styles.subStepText}>{subStep}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

  // Render table of contents item
  const renderTOCItem = (item: TableOfContentsItem) => (
    <TouchableOpacity
      key={item.id}
      style={styles.tocItem}
      onPress={() => handleTOCPress(item.id)}
      activeOpacity={0.7}
    >
      <Text style={styles.tocStepNumber}>{item.stepNumber}</Text>
      <Text style={styles.tocItemTitle}>{item.title}</Text>
      {completedSteps.has(item.id) && (
        <Text style={styles.tocCheckmark}>✓</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header with reader mode toggle */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dengue Management</Text>
        <Text style={styles.headerSubtitle}>DGHS 2025 Guidelines</Text>
        
        <TouchableOpacity
          style={styles.readerModeToggle}
          onPress={handleReaderModeToggle}
          activeOpacity={0.7}
        >
          <Text style={styles.readerModeToggleText}>
            {isReaderMode ? '📖 Reader' : '📝 Normal'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Floating Table of Contents button */}
      <TouchableOpacity
        style={styles.floatingTOCButton}
        onPress={() => bottomSheetModalRef?.present()}
        activeOpacity={0.7}
      >
        <Text style={styles.floatingTOCText}>📋</Text>
      </TouchableOpacity>

      {/* Protocol content */}
      <Animated.View style={[styles.contentContainer, { opacity: fadeAnim }]}>
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {protocolSteps.map(renderProtocolStep)}
        </ScrollView>
      </Animated.View>

      {/* Table of Contents Bottom Sheet */}
      <BottomSheetModal
        ref={(ref) => setBottomSheetModalRef(ref)}
        index={0}
        snapPoints={['40%', '70%']}
        backgroundStyle={styles.bottomSheetBackground}
        handleStyle={styles.bottomSheetHandle}
        handleIndicatorStyle={styles.bottomSheetIndicator}
      >
        <BottomSheetView style={styles.bottomSheetContent}>
          <View style={styles.tocHeader}>
            <Text style={styles.tocHeaderTitle}>Table of Contents</Text>
            <Text style={styles.tocHeaderSubtitle}>
              {completedSteps.size} of {protocolSteps.length} completed
            </Text>
          </View>
          
          <ScrollView showsVerticalScrollIndicator={false}>
            {tableOfContents.map(renderTOCItem)}
          </ScrollView>
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    paddingTop: 64,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#888888',
    marginBottom: 16,
  },
  readerModeToggle: {
    alignSelf: 'flex-start',
    backgroundColor: '#080808',
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  readerModeToggleText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '600',
  },
  floatingTOCButton: {
    position: 'absolute',
    right: 16,
    top: 100,
    backgroundColor: '#080808',
    borderWidth: 1,
    borderColor: '#1A1A1A',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  floatingTOCText: {
    fontSize: 16,
  },
  contentContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  stepContainer: {
    backgroundColor: '#080808',
    borderWidth: 1,
    borderColor: '#1A1A1A',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  stepSelected: {
    borderColor: '#007AFF',
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  stepCompleted: {
    borderColor: '#34C759',
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepCheckbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#1A1A1A',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepCheckboxCompleted: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  stepCheckboxText: {
    fontSize: 14,
    color: '#888888',
    fontWeight: '600',
  },
  stepCheckboxTextCompleted: {
    color: '#FFFFFF',
  },
  stepTitleContainer: {
    flex: 1,
  },
  stepNumber: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '600',
    marginBottom: 2,
  },
  stepHeading: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  severityText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  stepBody: {
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 24,
    marginBottom: 16,
  },
  subStepsContainer: {
    marginTop: 8,
  },
  subStepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  subStepCheckbox: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    marginTop: 2,
  },
  subStepCheckboxText: {
    fontSize: 14,
    color: '#888888',
  },
  subStepText: {
    flex: 1,
    fontSize: 14,
    color: '#888888',
    lineHeight: 20,
  },
  bottomSheetBackground: {
    backgroundColor: '#121212',
  },
  bottomSheetHandle: {
    backgroundColor: '#1A1A1A',
  },
  bottomSheetIndicator: {
    backgroundColor: '#888888',
  },
  bottomSheetContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  tocHeader: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  tocHeaderTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  tocHeaderSubtitle: {
    fontSize: 14,
    color: '#888888',
  },
  tocItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  tocStepNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    width: 40,
  },
  tocItemTitle: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  tocCheckmark: {
    fontSize: 16,
    color: '#34C759',
    fontWeight: '600',
  },
});

export default GPReaderMode;
