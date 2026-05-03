import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Search, Pill, ClipboardList, Sparkles } from 'lucide-react';
import { MotiView } from 'moti';
import { FrostedGlass, GlassCard } from '@/components/ui/glassmorphism';
import { AmbientMeshGradient } from '@/components/backgrounds/mesh-gradient';
import { triggerSelectionHaptic } from '@/lib/clinical-haptics';
import { useDatabase } from '@/db/provider';
import { medicines, generics, dosageForms, conditions } from '@/db/schema';
import { like, or, eq } from 'drizzle-orm';

export interface SearchResult {
  id: string;
  title: string;
  subtitle?: string;
  category: 'medicine' | 'condition';
  route: string;
}

interface OmniSearchCockpitProps {
  visible: boolean;
  onClose: () => void;
  onSelect?: (result: SearchResult) => void;
}

export function OmniSearchCockpit({ visible, onClose, onSelect }: OmniSearchCockpitProps) {
  const { db } = useDatabase();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(100)).current;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 100, duration: 250, useNativeDriver: true }),
      ]).start();
      setQuery('');
      setResults([]);
    }
  }, [visible]);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    if (!db || query.trim().length < 2) { setResults([]); return; }
    timer.current = setTimeout(async () => {
      const term = `%${query.trim()}%`;
      const [medRows, condRows] = await Promise.all([
        db.select({
          id: medicines.id,
          brandName: medicines.brandName,
          strength: medicines.strength,
          genericName: generics.name,
          dosageForm: dosageForms.name,
        })
          .from(medicines)
          .leftJoin(generics, eq(medicines.genericId, generics.id))
          .leftJoin(dosageForms, eq(medicines.dosageFormId, dosageForms.id))
          .where(or(like(medicines.brandName, term), like(generics.name, term)))
          .limit(6),
        db.select({ id: conditions.id, name: conditions.name, systemId: conditions.systemId })
          .from(conditions)
          .where(like(conditions.name, term))
          .limit(4),
      ]);
      const medResults: SearchResult[] = medRows.map(r => ({
        id: `med-${r.id}`,
        title: r.brandName,
        subtitle: [r.genericName, r.strength, r.dosageForm].filter(Boolean).join(' · '),
        category: 'medicine',
        route: `/dims/brand/${r.id}`,
      }));
      const condResults: SearchResult[] = condRows.map(r => ({
        id: `cond-${r.id}`,
        title: r.name,
        subtitle: 'Clinical condition',
        category: 'condition',
        route: `/gp/condition/${r.id}`,
      }));
      setResults([...medResults, ...condResults]);
    }, 300);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [query, db]);

  const handleFocus = () => {
    setIsFocused(true);
    triggerSelectionHaptic();
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleSelect = (result: SearchResult) => {
    triggerSelectionHaptic();
    onSelect?.(result);
    onClose();
  };

  const getCategoryColor = (category: string) => {
    return category === 'medicine' ? '#C8F53C' : '#00D7B5';
  };

  const getCategoryIcon = (category: string) => {
    return category === 'medicine'
      ? <Pill size={20} color={getCategoryColor(category)} />
      : <ClipboardList size={20} color={getCategoryColor(category)} />;
  };

  if (!visible) return null;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <AmbientMeshGradient>
        <Animated.View
          style={[
            styles.container,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Backdrop */}
          <TouchableOpacity
            style={styles.backdrop}
            activeOpacity={1}
            onPress={onClose}
          />

          {/* Search Cockpit */}
          <MotiView
            animate={{
              scale: isFocused ? 1.02 : 1,
            }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
            }}
            style={styles.searchContainer}
          >
            <FrostedGlass intensity={isFocused ? 120 : 100} style={styles.searchCockpit}>
              {/* Search Header */}
              <View style={styles.searchHeader}>
                <View style={styles.searchInputContainer}>
                  <Search size={20} color="#7A7A80" style={styles.searchIcon} />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search medicines, protocols, ER..."
                    placeholderTextColor="#7A7A80"
                    value={query}
                    onChangeText={setQuery}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
                
                <TouchableOpacity
                  style={styles.aiButton}
                  onPress={() => {
                    triggerSelectionHaptic();
                    // Handle AI search
                  }}
                >
                  <Sparkles size={16} color="#C8F53C" />
                </TouchableOpacity>
              </View>

              {/* Results */}
              <ScrollView
                style={styles.resultsContainer}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                {results.length > 0 ? (
                  results.map((result) => (
                    <TouchableOpacity
                      key={result.id}
                      style={styles.resultItem}
                      onPress={() => handleSelect(result)}
                      activeOpacity={0.7}
                    >
                      <GlassCard elevated style={styles.resultCard}>
                        <View style={styles.resultContent}>
                          <View style={styles.resultIcon}>
                            {getCategoryIcon(result.category)}
                          </View>
                          <View style={styles.resultText}>
                            <Text style={styles.resultTitle}>{result.title}</Text>
                            {result.subtitle && (
                              <Text style={styles.resultSubtitle}>{result.subtitle}</Text>
                            )}
                          </View>
                          <View style={[
                            styles.categoryBadge,
                            { backgroundColor: getCategoryColor(result.category) + '20' }
                          ]}>
                            <Text style={[
                              styles.categoryText,
                              { color: getCategoryColor(result.category) }
                            ]}>
                              {result.category.toUpperCase()}
                            </Text>
                          </View>
                        </View>
                      </GlassCard>
                    </TouchableOpacity>
                  ))
                ) : (
                  <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>No results found</Text>
                    <Text style={styles.emptySubtext}>Try searching for medicines or protocols</Text>
                  </View>
                )}
              </ScrollView>
            </FrostedGlass>
          </MotiView>
        </Animated.View>
      </AmbientMeshGradient>
    </KeyboardAvoidingView>
  );
}

const styles = {
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  searchContainer: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    height: '70%',
    maxHeight: 600,
  },
  searchCockpit: {
    flex: 1,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: '#FFFFFF',
  },
  aiButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(184, 255, 210, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(184, 255, 210, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  resultItem: {
    marginBottom: 12,
  },
  resultCard: {
    padding: 16,
  },
  resultContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  resultText: {
    flex: 1,
  },
  resultTitle: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  resultSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#B8B8BE',
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: '#7A7A80',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#4A4A4F',
    textAlign: 'center',
  },
};
