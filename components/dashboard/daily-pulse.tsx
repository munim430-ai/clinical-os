import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import {
  BookOpen,
  X,
  ArrowRight,
  ChevronRight,
  Scale,
  Droplets,
  Baby,
  CalendarDays,
  Pill,
  Clock,
  Stethoscope,
} from 'lucide-react';
import { triggerSelectionHaptic } from '@/lib/clinical-haptics';
import {
  PEARLS,
  SPONSORS,
  CATEGORY_COLORS,
  getDailyIndex,
  type Pearl,
  type Sponsor,
} from '@/lib/daily-pulse-data';

const TEAL = '#0693A4';
const EMERALD = '#10B981';

interface CalcDef {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
}

const CALCS: CalcDef[] = [
  { id: 'bmi',  label: 'BMI',      icon: null, color: '#0693A4' },
  { id: 'egfr', label: 'eGFR',     icon: null, color: '#3B82F6' },
  { id: 'peds', label: 'Ped Dose', icon: null, color: '#10B981' },
  { id: 'preg', label: 'Preg Whl', icon: null, color: '#8B5CF6' },
];

function calcIcon(id: string, color: string, size = 18) {
  switch (id) {
    case 'bmi':  return <Scale   size={size} color={color} strokeWidth={1.8} />;
    case 'egfr': return <Droplets size={size} color={color} strokeWidth={1.8} />;
    case 'peds': return <Baby    size={size} color={color} strokeWidth={1.8} />;
    case 'preg': return <CalendarDays size={size} color={color} strokeWidth={1.8} />;
    default: return null;
  }
}

/* ── BMI Calculator ────────────────────────────────── */
function BMICalc({ color }: { color: string }) {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [result, setResult] = useState<{ bmi: string; cat: string; catColor: string } | null>(null);

  const calculate = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100;
    if (w > 0 && h > 0) {
      const bmi = (w / (h * h)).toFixed(1);
      const n = parseFloat(bmi);
      const cat = n < 18.5 ? 'Underweight' : n < 23.0 ? 'Normal weight' : n < 27.5 ? 'Overweight' : 'Obese';
      const catColor = n < 18.5 ? '#3B82F6' : n < 23.0 ? '#10B981' : n < 27.5 ? '#F59E0B' : '#EF4444';
      setResult({ bmi, cat, catColor });
    }
  };

  return (
    <View style={{ padding: 20, gap: 16 }}>
      <View style={{ flexDirection: 'row', gap: 12 }}>
        {[
          { label: 'Weight (kg)', val: weight, set: setWeight, ph: '70' },
          { label: 'Height (cm)', val: height, set: setHeight, ph: '170' },
        ].map(f => (
          <View key={f.label} style={{ flex: 1 }}>
            <Text style={{ fontSize: 11, fontFamily: 'Inter_600SemiBold', color: '#7A7A80', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.8 }}>
              {f.label}
            </Text>
            <TextInput
              value={f.val}
              onChangeText={f.set}
              placeholder={f.ph}
              placeholderTextColor="#505058"
              keyboardType="numeric"
              style={{
                backgroundColor: '#1C1C1E',
                borderRadius: 12,
                paddingHorizontal: 12,
                paddingVertical: 10,
                fontSize: 15,
                fontFamily: 'Inter_600SemiBold',
                color: '#FFFFFF',
                borderWidth: 1,
                borderColor: '#2C2C2E',
              }}
            />
          </View>
        ))}
      </View>

      <TouchableOpacity
        onPress={() => { triggerSelectionHaptic(); calculate(); }}
        activeOpacity={0.8}
        style={{
          borderRadius: 12,
          paddingVertical: 14,
          alignItems: 'center',
          backgroundColor: color,
        }}
      >
        <Text style={{ fontSize: 14, fontFamily: 'Inter_600SemiBold', color: '#FFFFFF' }}>
          Calculate BMI
        </Text>
      </TouchableOpacity>

      {result && (
        <View style={{ borderRadius: 16, padding: 16, alignItems: 'center', backgroundColor: result.catColor + '18', borderWidth: 1, borderColor: result.catColor + '30' }}>
          <Text style={{ fontSize: 48, fontFamily: 'Geist-ExtraBold', color: result.catColor, lineHeight: 56 }}>
            {result.bmi}
          </Text>
          <Text style={{ fontSize: 14, fontFamily: 'Inter_600SemiBold', color: result.catColor, marginTop: 4 }}>
            {result.cat}
          </Text>
          <Text style={{ fontSize: 10, color: '#7A7A80', marginTop: 4, fontFamily: 'Inter_400Regular' }}>
            WHO Asia-Pacific cut-offs · Normal: 18.5–22.9
          </Text>
        </View>
      )}
    </View>
  );
}

/* ── Calculator placeholder ────────────────────────── */
function CalcPlaceholder({ calc }: { calc: CalcDef }) {
  return (
    <View style={{ padding: 20, alignItems: 'center', paddingVertical: 48 }}>
      <View style={{ width: 64, height: 64, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: calc.color + '18', marginBottom: 16 }}>
        {calcIcon(calc.id, calc.color, 32)}
      </View>
      <Text style={{ fontSize: 16, fontFamily: 'Inter_600SemiBold', color: '#FFFFFF', marginBottom: 8 }}>
        {calc.label} Calculator
      </Text>
      <Text style={{ fontSize: 13, color: '#7A7A80', fontFamily: 'Inter_400Regular', textAlign: 'center', maxWidth: 240, lineHeight: 20 }}>
        Full calculator coming in the next update.
      </Text>
      <View style={{ marginTop: 16, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: calc.color }}>
        <Text style={{ fontSize: 11, fontFamily: 'Inter_600SemiBold', color: '#FFFFFF' }}>Coming Soon</Text>
      </View>
    </View>
  );
}

/* ── Sheet modal wrapper ───────────────────────────── */
function SheetModal({ visible, onClose, title, children }: { visible: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' }} onPress={onClose}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <Pressable>
            <View style={{ backgroundColor: '#121212', borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: 520 }}>
              {/* Handle */}
              <View style={{ alignItems: 'center', paddingTop: 12, paddingBottom: 4 }}>
                <View style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: '#2C2C2E' }} />
              </View>
              {/* Header */}
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 }}>
                <Text style={{ fontSize: 17, fontFamily: 'Inter_600SemiBold', color: '#FFFFFF' }}>{title}</Text>
                <TouchableOpacity onPress={onClose} activeOpacity={0.7} style={{ width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: '#1C1C1E' }}>
                  <X size={16} color="#7A7A80" strokeWidth={2} />
                </TouchableOpacity>
              </View>
              {/* Divider */}
              <View style={{ height: 1, backgroundColor: '#1C1C1E' }} />
              <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                {children}
              </ScrollView>
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}

/* ── MAIN DailyPulse card ──────────────────────────── */
export function DailyPulse() {
  const [pearlIdx, setPearlIdx] = useState(() => getDailyIndex(PEARLS));
  const [activeCalc, setActiveCalc]         = useState<CalcDef | null>(null);
  const [showPearlDetail, setShowPearlDetail] = useState(false);
  const [showSponsor, setShowSponsor]         = useState(false);

  const pearl   = PEARLS[pearlIdx];
  const sponsor = SPONSORS[getDailyIndex(SPONSORS)];
  const catColor = CATEGORY_COLORS[pearl.category] ?? TEAL;

  return (
    <>
      {/* ── Card ────────────────────────────────────── */}
      <View style={{
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: '#121212',
        borderWidth: 1,
        borderColor: '#1C1C1E',
        marginBottom: 12,
        flexDirection: 'row',
      }}>
        {/* Gradient left strip — teal→emerald */}
        <View style={{ width: 3, backgroundColor: TEAL }} />

        <View style={{ flex: 1, padding: 14, paddingBottom: 10 }}>
          <View style={{ flexDirection: 'row', gap: 12 }}>

            {/* LEFT 60% — Pearl */}
            <TouchableOpacity
              style={{ flex: 3 }}
              onPress={() => { triggerSelectionHaptic(); setShowPearlDetail(true); }}
              activeOpacity={0.7}
            >
              {/* Label row */}
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: TEAL }} />
                <Text style={{ fontSize: 9, fontFamily: 'Inter_600SemiBold', color: TEAL, textTransform: 'uppercase', letterSpacing: 1.2 }}>
                  Clinical Pearl
                </Text>
                <ChevronRight size={10} color={TEAL} strokeWidth={2} />
              </View>

              {/* Category badge */}
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 6 }}>
                <View style={{ width: 5, height: 5, borderRadius: 2.5, backgroundColor: catColor }} />
                <Text style={{ fontSize: 9, fontFamily: 'Inter_600SemiBold', color: catColor, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                  {pearl.category}
                </Text>
              </View>

              {/* Pearl text */}
              <Text style={{ fontSize: 12, lineHeight: 18, color: '#B8B8BE', fontFamily: 'Inter_400Regular' }} numberOfLines={4}>
                {pearl.text}
              </Text>

              {/* Source */}
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8 }}>
                <BookOpen size={9} color='#505058' strokeWidth={2} />
                <Text style={{ fontSize: 10, color: '#505058', fontFamily: 'Inter_400Regular', flex: 1 }} numberOfLines={1}>
                  {pearl.source}
                </Text>
              </View>
            </TouchableOpacity>

            {/* RIGHT 40% — Calculators */}
            <View style={{ flex: 2, justifyContent: 'center' }}>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
                {CALCS.map(calc => (
                  <View key={calc.id} style={{ alignItems: 'center', gap: 4, width: 44 }}>
                    <TouchableOpacity
                      onPress={() => { triggerSelectionHaptic(); setActiveCalc(calc); }}
                      activeOpacity={0.7}
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 14,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: calc.color + '18',
                        borderWidth: 1.5,
                        borderColor: calc.color + '30',
                      }}
                    >
                      {calcIcon(calc.id, calc.color)}
                    </TouchableOpacity>
                    <Text style={{ fontSize: 8.5, fontFamily: 'Inter_600SemiBold', color: '#505058', textAlign: 'center', lineHeight: 11 }} numberOfLines={2}>
                      {calc.label}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Sponsor chip */}
          <View style={{ alignItems: 'flex-end', marginTop: 8 }}>
            <TouchableOpacity
              onPress={() => { triggerSelectionHaptic(); setShowSponsor(true); }}
              activeOpacity={0.7}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 5,
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 20,
                backgroundColor: sponsor.color + '12',
                borderWidth: 1,
                borderColor: sponsor.color + '30',
              }}
            >
              <View style={{ width: 5, height: 5, borderRadius: 2.5, backgroundColor: sponsor.color }} />
              <Text style={{ fontSize: 9, color: '#7A7A80', fontFamily: 'Inter_400Regular' }}>Featured:</Text>
              <Text style={{ fontSize: 9, fontFamily: 'Inter_600SemiBold', color: sponsor.color }}>{sponsor.brand}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* ── Pearl detail sheet ──────────────────────── */}
      <SheetModal visible={showPearlDetail} onClose={() => setShowPearlDetail(false)} title="Clinical Pearl">
        <View style={{ padding: 20, gap: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={{ paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, backgroundColor: catColor }}>
              <Text style={{ fontSize: 11, fontFamily: 'Inter_600SemiBold', color: '#FFFFFF' }}>{pearl.category}</Text>
            </View>
          </View>

          <Text style={{ fontSize: 15, lineHeight: 24, color: '#E0E0E0', fontFamily: 'Inter_400Regular' }}>
            {pearl.text}
          </Text>

          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12, padding: 14, borderRadius: 16, backgroundColor: '#1C1C1E' }}>
            <BookOpen size={18} color={TEAL} strokeWidth={1.8} style={{ marginTop: 2, flexShrink: 0 }} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 10, fontFamily: 'Inter_600SemiBold', color: '#505058', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 }}>
                Source
              </Text>
              <Text style={{ fontSize: 13, color: '#B8B8BE', fontFamily: 'Inter_400Regular', lineHeight: 20 }}>
                {pearl.source}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => { triggerSelectionHaptic(); setPearlIdx(i => (i + 1) % PEARLS.length); }}
            activeOpacity={0.7}
            style={{ borderRadius: 14, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: TEAL + '18', borderWidth: 1, borderColor: TEAL + '30' }}
          >
            <ArrowRight size={16} color={TEAL} strokeWidth={2} />
            <Text style={{ fontSize: 14, fontFamily: 'Inter_600SemiBold', color: TEAL }}>Next Pearl</Text>
          </TouchableOpacity>
        </View>
      </SheetModal>

      {/* ── Sponsor sheet ───────────────────────────── */}
      <SheetModal visible={showSponsor} onClose={() => setShowSponsor(false)} title="Featured Drug">
        <View style={{ padding: 20, gap: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, borderRadius: 16, backgroundColor: sponsor.color + '10' }}>
            <View style={{ width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: sponsor.color + '20', flexShrink: 0 }}>
              <Pill size={24} color={sponsor.color} strokeWidth={1.8} />
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={{ fontSize: 18, fontFamily: 'Geist-Bold', color: '#FFFFFF', lineHeight: 24 }}>{sponsor.brand}</Text>
              <Text style={{ fontSize: 12, color: '#7A7A80', fontFamily: 'Inter_400Regular' }}>{sponsor.drug}</Text>
              <Text style={{ fontSize: 11, fontFamily: 'Inter_600SemiBold', color: sponsor.color, marginTop: 2 }}>{sponsor.company}</Text>
            </View>
          </View>

          <Text style={{ fontSize: 13, color: '#7A7A80', fontFamily: 'Inter_400Regular', fontStyle: 'italic', lineHeight: 20 }}>
            "{sponsor.tagline}"
          </Text>

          {[
            { icon: <Stethoscope size={16} color={TEAL} strokeWidth={1.8} />, label: 'Indication', val: sponsor.indication },
            { icon: <Clock       size={16} color={TEAL} strokeWidth={1.8} />, label: 'Dosing',     val: sponsor.dosing },
          ].map(row => (
            <View key={row.label} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
              <View style={{ marginTop: 2 }}>{row.icon}</View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 10, fontFamily: 'Inter_600SemiBold', color: '#505058', textTransform: 'uppercase', letterSpacing: 0.8 }}>{row.label}</Text>
                <Text style={{ fontSize: 13, color: '#B8B8BE', fontFamily: 'Inter_400Regular', marginTop: 2, lineHeight: 20 }}>{row.val}</Text>
              </View>
            </View>
          ))}

          <Text style={{ fontSize: 10, color: '#2C2C2E', textAlign: 'center', fontFamily: 'Inter_400Regular', paddingTop: 4 }}>
            Sponsored content · Always verify with current prescribing information.
          </Text>
        </View>
      </SheetModal>

      {/* ── Calculator sheet ────────────────────────── */}
      <SheetModal visible={!!activeCalc} onClose={() => setActiveCalc(null)} title={activeCalc ? `${activeCalc.label} Calculator` : ''}>
        {activeCalc?.id === 'bmi' ? (
          <BMICalc color={activeCalc.color} />
        ) : activeCalc ? (
          <CalcPlaceholder calc={activeCalc} />
        ) : null}
      </SheetModal>
    </>
  );
}
