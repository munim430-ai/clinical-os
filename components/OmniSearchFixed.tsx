import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Vibration,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Layout, Components } from '../constants/theme';

interface SearchResult {
  id: string;
  type: 'drug' | 'protocol' | 'lab';
  title: string;
  subtitle?: string;
  category?: string;
  price?: string;
  route: string;
}

interface QuickAction {
  id: string;
  title: string;
  icon: string;
  color: string;
  route: string;
  isCritical?: boolean;
}

const OmniSearch: React.FC = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [backgroundOpacity] = useState(new Animated.Value(1));
  const [searchBarScale] = useState(new Animated.Value(1));

  // Quick actions for bento grid
  const quickActions: QuickAction[] = [
    {
      id: 'er',
      title: 'ER Mode',
      icon: '⚡',
      color: Colors.accentCritical,
      route: '/(tabs)/er',
      isCritical: true,
    },
    {
      id: 'scribe',
      title: 'Scribe Lens',
      icon: '📷',
      color: Colors.accent,
      route: '/(tabs)/profile',
    },
    {
      id: 'calculators',
      title: 'Calculators',
      icon: '🧮',
      color: Colors.accentSecondary,
      route: '/(tabs)/profile',
    },
    {
      id: 'protocols',
      title: 'Protocols',
      icon: '📖',
      color: Colors.accent,
      route: '/(tabs)/gp',
    },
  ];

  // Mock search data
  const mockSearchResults: SearchResult[] = [
    {
      id: '1',
      type: 'drug',
      title: 'Napa',
      subtitle: 'Paracetamol 500mg',
      category: 'Analgesic',
      price: '৳25',
      route: '/(tabs)/dims',
    },
    {
      id: '2',
      type: 'drug',
      title: 'Ace',
      subtitle: 'Paracetamol 325mg',
      category: 'Analgesic',
      price: '৳20',
      route: '/(tabs)/dims',
    },
    {
      id: '3',
      type: 'protocol',
      title: 'Dengue Management',
      subtitle: 'DGHS 2025 Guidelines',
      category: 'Infectious Disease',
      route: '/(tabs)/gp',
    },
    {
      id: '4',
      type: 'lab',
      title: 'Interpret CBC',
      subtitle: 'Complete Blood Count',
      category: 'Laboratory',
      route: '/(tabs)/gp',
    },
  ];

  // Handle search focus
  const handleSearchFocus = useCallback(() => {
    setIsSearching(true);
    Vibration.vibrate(10);
    
    Animated.timing(backgroundOpacity, {
      toValue: 0.3,
      duration: 300,
      useNativeDriver: true,
    }).start();

    Animated.spring(searchBarScale, {
      toValue: 1.02,
      useNativeDriver: true,
    }).start();
  }, [backgroundOpacity, searchBarScale]);

  // Handle search blur
  const handleSearchBlur = useCallback(() => {
    setIsSearching(false);
    
    Animated.timing(backgroundOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    Animated.spring(searchBarScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, [backgroundOpacity, searchBarScale]);

  // Handle search input
  const handleSearch = useCallback((text: string) => {
    setSearchQuery(text);
    
    if (text.trim()) {
      const filtered = mockSearchResults.filter(item =>
        item.title.toLowerCase().includes(text.toLowerCase()) ||
        item.subtitle?.toLowerCase().includes(text.toLowerCase()) ||
        item.category?.toLowerCase().includes(text.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  }, []);

  // Handle result selection
  const handleResultPress = useCallback((result: SearchResult) => {
    Vibration.vibrate(15);
    router.push(result.route as any);
  }, [router]);

  // Handle quick action press
  const handleQuickActionPress = useCallback((action: QuickAction) => {
    if (action.isCritical) {
      Vibration.vibrate(50);
    } else {
      Vibration.vibrate(20);
    }
    router.push(action.route as any);
  }, [router]);

  // Render search result item
  const renderSearchResult = (result: SearchResult) => (
    <TouchableOpacity
      key={result.id}
      style={styles.searchResultCard}
      onPress={() => handleResultPress(result)}
      activeOpacity={0.7}
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.resultTitle}>{result.title}</Text>
        <Text style={styles.resultSubtitle}>{result.subtitle}</Text>
        {result.category && (
          <Text style={styles.resultCategory}>{result.category}</Text>
        )}
      </View>
      
      {result.price && (
        <View style={styles.priceBadge}>
          <Text style={styles.priceText}>{result.price}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  // Render quick action bento grid item
  const renderQuickAction = (action: QuickAction) => (
    <TouchableOpacity
      key={action.id}
      style={[
        styles.quickActionCard,
        action.isCritical && styles.erModeCard
      ]}
      onPress={() => handleQuickActionPress(action)}
      activeOpacity={0.7}
    >
      {action.isCritical && (
        <View style={styles.erBorder} />
      )}
      
      <Text style={styles.quickActionIcon}>{action.icon}</Text>
      
      <Text style={[
        styles.quickActionTitle,
        { color: action.isCritical ? Colors.accentCritical : Colors.text }
      ]}>
        {action.title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.container}>
        {/* Frosted glass background overlay */}
        <Animated.View
          style={[
            styles.backgroundOverlay,
            { opacity: backgroundOpacity }
          ]}
        />
        
        {/* Main content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Omni-Search Command Bar */}
          <Animated.View
            style={{ transform: [{ scale: searchBarScale }] }}
          >
            <View
              style={[
                styles.searchBar,
                isSearching && styles.searchBarFocused
              ]}
            >
              <Text style={styles.searchIcon}>🔍</Text>
              
              <TextInput
                style={styles.searchInput}
                placeholder="Search drugs, protocols, labs..."
                placeholderTextColor={Colors.textTertiary}
                value={searchQuery}
                onChangeText={handleSearch}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
                returnKeyType="search"
                clearButtonMode="while-editing"
              />
            </View>
          </Animated.View>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Results</Text>
              {searchResults.map(renderSearchResult)}
            </View>
          )}

          {/* Quick Actions Bento Grid */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            
            <View style={styles.bentoGrid}>
              {quickActions.map(renderQuickAction)}
            </View>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  backgroundOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.background,
    zIndex: 1,
  },
  scrollView: {
    flex: 1,
    zIndex: 2,
  },
  scrollContent: {
    padding: Layout.safeArea.horizontal,
    paddingTop: Layout.safeArea.top + 20,
  },
  searchBar: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 28,
    height: 56,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  searchBarFocused: {
    borderColor: Colors.accent,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  searchIcon: {
    fontSize: 20,
    marginRight: 12,
    color: Colors.textSecondary,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  searchResultCard: {
    backgroundColor: Colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    marginVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  resultSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  resultCategory: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
  priceBadge: {
    borderWidth: 1,
    borderColor: Colors.accent,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  priceText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.accent,
  },
  bentoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  quickActionCard: {
    backgroundColor: Colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    width: '48%',
  },
  erModeCard: {
    backgroundColor: Colors.erBackground,
    borderColor: Colors.erBorder,
  },
  erBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 2,
    borderColor: Colors.erBorder,
    borderRadius: 8,
    opacity: 0.5,
  },
  quickActionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default OmniSearch;
