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
  FlatList,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Search, Pill, ClipboardList, AlertTriangle, Calculator, Bookmark, Sparkles } from 'lucide-react';
import { MotiView } from 'moti';
import { FrostedGlass, GlassCard } from '@/components/ui/glassmorphism';
import { AmbientMeshGradient } from '@/components/backgrounds/mesh-gradient';
import { triggerSelectionHaptic } from '@/lib/clinical-haptics';
import { cn } from '@/lib/utils';

interface SearchResult {
  id: string;
  title: string;
  subtitle?: string;
  category: 'medicine' | 'protocol' | 'er' | 'calculator' | 'saved' | 'ai';
  icon: React.ReactNode;
}

interface OmniSearchCockpitProps {
  visible: boolean;
  onClose: () => void;
  onSelect?: (result: SearchResult) => void;
}

export function OmniSearchCockpit({ visible, onClose, onSelect }: OmniSearchCockpitProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(100)).current;

  // Sample data for demonstration
  const sampleResults: SearchResult[] = [
    {
      id: '1',
      title: 'Paracetamol 500mg',
      subtitle: 'Analgesic - Antipyretic',
      category: 'medicine',
      icon: <Pill size={20} color="#B8FFD2" />,
    },
    {
      id: '2',
      title: 'CPR Protocol',
      subtitle: 'Emergency resuscitation',
      category: 'protocol',
      icon: <ClipboardList size={20} color="#00D7B5" />,
    },
    {
      id: '3',
      title: 'Anaphylaxis Management',
      subtitle: 'Emergency treatment',
      category: 'er',
      icon: <AlertTriangle size={20} color="#FF453A" />,
    },
    {
      id: '4',
      title: 'Drug Dosage Calculator',
      subtitle: 'Pediatric calculations',
      category: 'calculator',
      icon: <Calculator size={20} color="#64D2FF" />,
    },
    {
      id: '5',
      title: 'Saved Protocols',
      subtitle: 'Your bookmarked items',
      category: 'saved',
      icon: <Bookmark size={20} color="#FFD60A" />,
    },
  ];

  useEffect(() => {
    if (visible) {
      // Animate in
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Animate out
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 100,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  useEffect(() => {
    // Filter results based on query
    if (query.trim()) {
      const filtered = sampleResults.filter(result =>
        result.title.toLowerCase().includes(query.toLowerCase()) ||
        result.subtitle?.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults(sampleResults);
    }
  }, [query]);

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
    switch (category) {
      case 'medicine': return '#B8FFD2';
      case 'protocol': return '#00D7B5';
      case 'er': return '#FF453A';
      case 'calculator': return '#64D2FF';
      case 'saved': return '#FFD60A';
      case 'ai': return '#B8FFD2';
      default: return '#7A7A80';
    }
  };

  const getCategoryBg = (category: string) => {
    switch (category) {
      case 'medicine': return 'bg-accent-primarySoft/20';
      case 'protocol': return 'bg-accent-successSoft/20';
      case 'er': return 'bg-accent-criticalSoft/20';
      case 'calculator': return 'bg-accent-info/20';
      case 'saved': return 'bg-accent-warning/20';
      case 'ai': return 'bg-accent-primarySoft/20';
      default: return 'bg-surface-elevated';
    }
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
                  <Sparkles size={16} color="#B8FFD2" />
                </TouchableOpacity>
              </View>

              {/* Results */}
              <ScrollView
                style={styles.resultsContainer}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                {results.length > 0 ? (
                  results.map((result, index) => (
                    <TouchableOpacity
                      key={result.id}
                      style={styles.resultItem}
                      onPress={() => handleSelect(result)}
                      activeOpacity={0.7}
                    >
                      <GlassCard elevated style={styles.resultCard}>
                        <View style={styles.resultContent}>
                          <View style={styles.resultIcon}>
                            {result.icon}
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
