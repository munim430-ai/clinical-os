import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import { 
  BookOpen, 
  ChevronRight, 
  Minus, 
  Plus, 
  Bookmark, 
  Share2,
  Moon,
  Sun,
  Type,
} from 'lucide-react';
import { BlurView } from 'expo-blur';
import { MotiView } from 'moti';
import { AmbientMeshGradient } from '@/components/backgrounds/mesh-gradient';
import { FrostedGlass, GlassCard } from '@/components/ui/glassmorphism';
import { triggerSelectionHaptic, triggerSuccessHaptic } from '@/lib/clinical-haptics';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface TableOfContentsItem {
  id: string;
  title: string;
  level: number;
  section: string;
}

interface ClinicalContent {
  title: string;
  subtitle?: string;
  content: string;
  toc: TableOfContentsItem[];
}

export function ClinicalReaderMode({ 
  content, 
  onClose, 
  onBookmark 
}: { 
  content: ClinicalContent;
  onClose: () => void;
  onBookmark?: () => void;
}) {
  const [activeSection, setActiveSection] = useState<string>('');
  const [fontSize, setFontSize] = useState(16);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showTOC, setShowTOC] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  const scrollY = useRef(new Animated.Value(0)).current;
  const tocOpacity = useRef(new Animated.Value(0)).current;
  const tocTranslate = useRef(new Animated.Value(100)).current;

  // Sample clinical content
  const sampleContent: ClinicalContent = {
    title: "Hypertension Management Protocol",
    subtitle: "Evidence-based guidelines for clinical practice",
    content: `
# Hypertension Management Protocol

## Overview

Hypertension is one of the most common medical conditions affecting approximately 1.13 billion people worldwide. It is a major risk factor for cardiovascular disease, stroke, and kidney disease.

## Classification

### Blood Pressure Categories

- **Normal**: SBP < 120 mmHg and DBP < 80 mmHg
- **Elevated**: SBP 120-129 mmHg and DBP < 80 mmHg
- **Stage 1 Hypertension**: SBP 130-139 mmHg or DBP 80-89 mmHg
- **Stage 2 Hypertension**: SBP ≥ 140 mmHg or DBP ≥ 90 mmHg

## Diagnostic Approach

### Initial Assessment

1. **Confirm diagnosis** with multiple readings
2. **Identify secondary causes** when appropriate
3. **Assess cardiovascular risk**
4. **Evaluate for target organ damage**

### Required Investigations

- **Basic**: CBC, CMP, fasting glucose, lipid profile
- **Advanced**: Urinalysis, ECG, echocardiogram
- **Secondary causes**: Aldosterone/renin ratio, thyroid function

## Treatment Strategy

### Lifestyle Modifications

- **Diet**: DASH diet, sodium restriction < 2g/day
- **Exercise**: 150 minutes moderate intensity per week
- **Weight loss**: Target BMI < 25 kg/m²
- **Alcohol**: Limit to ≤ 2 drinks/day for men, ≤ 1 for women

### Pharmacological Treatment

#### First-line Agents

1. **ACE Inhibitors**
   - Lisinopril 10-40 mg daily
   - Contraindicated in pregnancy

2. **ARBs**
   - Losartan 25-100 mg daily
   - Alternative to ACE inhibitors

3. **Calcium Channel Blockers**
   - Amlodipine 2.5-10 mg daily
   - Effective in African American patients

4. **Thiazide Diuretics**
   - HCTZ 12.5-25 mg daily
   - Monitor electrolytes

#### Combination Therapy

- **Preferred combinations**: ACEI/ARB + CCB, ACEI/ARB + Thiazide
- **Avoid**: ACEI + ARB (increased risk of adverse effects)

## Special Populations

### Diabetes Mellitus

- Target BP < 130/80 mmHg
- ACEI or ARB preferred (renal protection)

### Chronic Kidney Disease

- Target BP < 130/80 mmHg
- ACEI or ARB first-line
- Monitor potassium and creatinine

### Elderly Patients

- Start low, go slow
- Consider orthostatic hypotension
- Target SBP 130-140 mmHg in patients > 65 years

## Monitoring and Follow-up

### Schedule

- **Stage 1**: Every 1 month until controlled
- **Stage 2**: Every 2 weeks until controlled
- **Controlled**: Every 3-6 months

### Monitoring Parameters

- Blood pressure readings
- Medication adherence
- Adverse effects
- Laboratory parameters

## Complications and Management

### Hypertensive Emergency

- **Definition**: BP > 180/120 mmHg with end-organ damage
- **Management**: IV antihypertensives, ICU admission
- **Goal reduction**: 25% in first hour, then 160/100-110 mmHg

### Resistant Hypertension

- **Definition**: Uncontrolled BP on 3+ antihypertensives
- **Evaluation**: Medication adherence, secondary causes
- **Management**: Add mineralocorticoid receptor antagonist

## References

1. ACC/AHA Guideline for the Prevention, Detection, Evaluation, and Management of High Blood Pressure in Adults (2023)
2. NICE Guidelines NG136: Hypertension in adults (2022)
3. ESC/ESH Guidelines for the management of arterial hypertension (2023)
    `,
    toc: [
      { id: 'overview', title: 'Overview', level: 1, section: 'Hypertension Management Protocol' },
      { id: 'classification', title: 'Classification', level: 1, section: 'Hypertension Management Protocol' },
      { id: 'bp-categories', title: 'Blood Pressure Categories', level: 2, section: 'Classification' },
      { id: 'diagnostic', title: 'Diagnostic Approach', level: 1, section: 'Hypertension Management Protocol' },
      { id: 'initial-assessment', title: 'Initial Assessment', level: 2, section: 'Diagnostic Approach' },
      { id: 'investigations', title: 'Required Investigations', level: 2, section: 'Diagnostic Approach' },
      { id: 'treatment', title: 'Treatment Strategy', level: 1, section: 'Hypertension Management Protocol' },
      { id: 'lifestyle', title: 'Lifestyle Modifications', level: 2, section: 'Treatment Strategy' },
      { id: 'pharmacological', title: 'Pharmacological Treatment', level: 2, section: 'Treatment Strategy' },
      { id: 'first-line', title: 'First-line Agents', level: 3, section: 'Pharmacological Treatment' },
      { id: 'combination', title: 'Combination Therapy', level: 3, section: 'Pharmacological Treatment' },
      { id: 'special', title: 'Special Populations', level: 1, section: 'Hypertension Management Protocol' },
      { id: 'diabetes', title: 'Diabetes Mellitus', level: 2, section: 'Special Populations' },
      { id: 'ckd', title: 'Chronic Kidney Disease', level: 2, section: 'Special Populations' },
      { id: 'elderly', title: 'Elderly Patients', level: 2, section: 'Special Populations' },
      { id: 'monitoring', title: 'Monitoring and Follow-up', level: 1, section: 'Hypertension Management Protocol' },
      { id: 'complications', title: 'Complications and Management', level: 1, section: 'Hypertension Management Protocol' },
      { id: 'references', title: 'References', level: 1, section: 'Hypertension Management Protocol' },
    ]
  };

  const currentContent = content || sampleContent;

  useEffect(() => {
    // Animate TOC visibility
    if (showTOC) {
      Animated.parallel([
        Animated.timing(tocOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(tocTranslate, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(tocOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(tocTranslate, {
          toValue: 100,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [showTOC]);

  const handleSectionPress = (sectionId: string) => {
    triggerSelectionHaptic();
    setActiveSection(sectionId);
    setShowTOC(false);
  };

  const handleBookmark = () => {
    triggerSuccessHaptic();
    setIsBookmarked(!isBookmarked);
    onBookmark?.();
  };

  const handleFontSizeChange = (delta: number) => {
    triggerSelectionHaptic();
    setFontSize(prev => Math.max(12, Math.min(24, prev + delta)));
  };

  const getSectionIndent = (level: number) => {
    return level * 16;
  };

  return (
    <AmbientMeshGradient>
      <View style={styles.container}>
        {/* Header */}
        <MotiView
          animate={{
            translateY: scrollY.interpolate({
              inputRange: [0, 100],
              outputRange: [0, -100],
              extrapolate: 'clamp',
            }),
          }}
          style={styles.header}
        >
          <BlurView intensity={100} tint="dark" style={styles.headerBlur}>
            <View style={styles.headerContent}>
              <View style={styles.headerLeft}>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <ChevronRight size={24} color="#FFFFFF" style={{ transform: [{ rotate: '180deg' }] }} />
                </TouchableOpacity>
                <View style={styles.headerText}>
                  <Text style={styles.headerTitle}>{currentContent.title}</Text>
                  {currentContent.subtitle && (
                    <Text style={styles.headerSubtitle}>{currentContent.subtitle}</Text>
                  )}
                </View>
              </View>
              
              <View style={styles.headerActions}>
                <TouchableOpacity onPress={handleBookmark} style={styles.actionButton}>
                  <Bookmark size={20} color={isBookmarked ? "#FFD60A" : "#FFFFFF"} fill={isBookmarked ? "#FFD60A" : "none"} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Share2 size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          </BlurView>
        </MotiView>

        {/* Content */}
        <Animated.ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
        >
          <View style={styles.readerContent}>
            <Text style={[styles.readerText, { fontSize }]}>
              {currentContent.content}
            </Text>
          </View>
        </Animated.ScrollView>

        {/* Floating Controls */}
        <View style={styles.floatingControls}>
          {/* Font Size Controls */}
          <GlassCard style={styles.fontSizeControl}>
            <TouchableOpacity onPress={() => handleFontSizeChange(-1)} style={styles.fontSizeButton}>
              <Minus size={16} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.fontSizeIndicator}>
              <Type size={16} color="#B8FFD2" />
              <Text style={styles.fontSizeText}>{fontSize}</Text>
            </View>
            <TouchableOpacity onPress={() => handleFontSizeChange(1)} style={styles.fontSizeButton}>
              <Plus size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </GlassCard>

          {/* TOC Toggle */}
          <TouchableOpacity
            style={styles.tocToggle}
            onPress={() => {
              triggerSelectionHaptic();
              setShowTOC(!showTOC);
            }}
          >
            <GlassCard style={styles.tocButton}>
              <BookOpen size={20} color="#B8FFD2" />
              <Text style={styles.tocButtonText}>TOC</Text>
            </GlassCard>
          </TouchableOpacity>
        </View>

        {/* Table of Contents Overlay */}
        {showTOC && (
          <Animated.View
            style={[
              styles.tocOverlay,
              {
                opacity: tocOpacity,
                transform: [{ translateX: tocTranslate }],
              },
            ]}
          >
            <FrostedGlass style={styles.tocContainer}>
              <View style={styles.tocHeader}>
                <Text style={styles.tocTitle}>Table of Contents</Text>
                <TouchableOpacity onPress={() => setShowTOC(false)} style={styles.tocClose}>
                  <ChevronRight size={20} color="#FFFFFF" style={{ transform: [{ rotate: '90deg' }] }} />
                </TouchableOpacity>
              </View>
              
              <ScrollView style={styles.tocList} showsVerticalScrollIndicator={false}>
                {currentContent.toc.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.tocItem,
                      { marginLeft: getSectionIndent(item.level) },
                      activeSection === item.id && styles.tocItemActive,
                    ]}
                    onPress={() => handleSectionPress(item.id)}
                  >
                    <View style={styles.tocItemContent}>
                      <Text style={[
                        styles.tocItemText,
                        activeSection === item.id && styles.tocItemTextActive,
                      ]}>
                        {item.title}
                      </Text>
                      {activeSection === item.id && (
                        <MotiView
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        >
                          <ChevronRight size={16} color="#B8FFD2" />
                        </MotiView>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </FrostedGlass>
          </Animated.View>
        )}
      </View>
    </AmbientMeshGradient>
  );
}

const styles = {
  container: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  headerBlur: {
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Geist-Bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: '#B8B8BE',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    marginTop: 120,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  readerContent: {
    flex: 1,
  },
  readerText: {
    fontFamily: 'Inter_400Regular',
    color: '#FFFFFF',
    lineHeight: 24,
  },
  floatingControls: {
    position: 'absolute',
    right: 20,
    bottom: 100,
    gap: 12,
  },
  fontSizeControl: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 20,
  },
  fontSizeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fontSizeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  fontSizeText: {
    marginLeft: 6,
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: '#FFFFFF',
  },
  tocToggle: {
    alignSelf: 'flex-end',
  },
  tocButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  tocButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: '#B8FFD2',
  },
  tocOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2000,
  },
  tocContainer: {
    flex: 1,
    margin: 20,
    marginTop: 120,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  tocHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  tocTitle: {
    fontSize: 20,
    fontFamily: 'Geist-Bold',
    color: '#FFFFFF',
  },
  tocClose: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tocList: {
    flex: 1,
    padding: 8,
  },
  tocItem: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 4,
  },
  tocItemActive: {
    backgroundColor: 'rgba(184, 255, 210, 0.1)',
  },
  tocItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tocItemText: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: '#FFFFFF',
    flex: 1,
  },
  tocItemTextActive: {
    color: '#B8FFD2',
    fontFamily: 'Inter_600SemiBold',
  },
};
