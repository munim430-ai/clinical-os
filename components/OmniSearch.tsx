import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Vibration,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Layout, Components, Spacing, BorderRadius } from '../constants/theme';

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

const { width: screenWidth } = Dimensions.get('window');

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
      route: '/er',
      isCritical: true,
    },
    {
      id: 'scribe',
      title: 'Scribe Lens',
      icon: '📷',
      color: Colors.accent,
      route: '/scribe',
    },
    {
      id: 'calculators',
      title: 'Calculators',
      icon: '🧮',
      color: Colors.accentSecondary,
      route: '/calculators',
    },
    {
      id: 'protocols',
      title: 'Protocols',
      icon: '📖',
      color: Colors.accent,
      route: '/gp',
    },
  ];

  // Mock search data - replace with actual database queries
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

  // Handle search focus with glassmorphism effect
  const handleSearchFocus = useCallback(() => {
    setIsSearching(true);
    Vibration.vibrate(10); // Light haptic feedback
    
    // Animate background blur
    Animated.timing(backgroundOpacity, {
      toValue: 0.3,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Scale search bar slightly
    Animated.spring(searchBarScale, {
      toValue: 1.02,
      useNativeDriver: true,
    }).start();
  }, [backgroundOpacity, searchBarScale]);

  // Handle search blur
  const handleSearchBlur = useCallback(() => {
    setIsSearching(false);
    
    // Restore background
    Animated.timing(backgroundOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Reset search bar scale
    Animated.spring(searchBarScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, [backgroundOpacity, searchBarScale]);

  // Handle search input
  const handleSearch = useCallback((text: string) => {
    setSearchQuery(text);
    
    // Filter mock results
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
    Vibration.vibrate(15); // Medium haptic feedback
    router.push(result.route);
  }, [router]);

  // Handle quick action press
  const handleQuickActionPress = useCallback((action: QuickAction) => {
    if (action.isCritical) {
      Vibration.vibrate(50); // Heavy haptic for critical actions
    } else {
      Vibration.vibrate(20); // Medium haptic
    }
    router.push(action.route);
  }, [router]);

  // Render search result item
  const renderSearchResult = (result: SearchResult) => (
    <TouchableOpacity
      key={result.id}
      style={{
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        borderColor: Colors.border,
        padding: Layout.card.padding,
        marginVertical: 4,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
      onPress={() => handleResultPress(result)}
      activeOpacity={0.7}
    >
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontFamily: Typography.heading,
            fontSize: Typography.sizes.lg,
            fontWeight: Typography.weights.bold,
            color: Colors.text,
            marginBottom: 4,
          }}
        >
          {result.title}
        </Text>
        <Text
          style={{
            fontFamily: Typography.body,
            fontSize: Typography.sizes.sm,
            color: Colors.textSecondary,
            marginBottom: 2,
          }}
        >
          {result.subtitle}
        </Text>
        {result.category && (
          <Text
            style={{
              fontFamily: Typography.body,
              fontSize: Typography.sizes.xs,
              color: Colors.textTertiary,
            }}
          >
            {result.category}
          </Text>
        )}
      </View>
      
      {result.price && (
        <View
          style={{
            borderWidth: 1,
            borderColor: Colors.accent,
            borderRadius: BorderRadius.sm,
            paddingHorizontal: 8,
            paddingVertical: 4,
          }}
        >
          <Text
            style={{
              fontFamily: Typography.heading,
              fontSize: Typography.sizes.sm,
              fontWeight: Typography.weights.semibold,
              color: Colors.accent,
            }}
          >
            {result.price}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  // Render quick action bento grid item
  const renderQuickAction = (action: QuickAction) => (
    <TouchableOpacity
      key={action.id}
      style={{
        backgroundColor: action.isCritical ? Colors.erBackground : Colors.surface,
        borderRadius: BorderRadius.md,
        borderWidth: action.isCritical ? 2 : 1,
        borderColor: action.isCritical ? Colors.erBorder : Colors.border,
        height: Components.bentoGrid.itemHeight,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
      onPress={() => handleQuickActionPress(action)}
      activeOpacity={0.7}
    >
      {action.isCritical && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderWidth: 2,
            borderColor: Colors.erBorder,
            borderRadius: BorderRadius.md,
            opacity: 0.5,
          }}
        />
      )}
      
      <Text
        style={{
          fontSize: 32,
          marginBottom: 8,
        }}
      >
        {action.icon}
      </Text>
      
      <Text
        style={{
          fontFamily: Typography.heading,
          fontSize: Typography.sizes.sm,
          fontWeight: Typography.weights.semibold,
          color: action.isCritical ? Colors.accentCritical : Colors.text,
          textAlign: 'center',
        }}
      >
        {action.title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={{ flex: 1, backgroundColor: Colors.background }}>
        {/* Frosted glass background overlay */}
        <Animated.View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: Colors.background,
            opacity: backgroundOpacity,
            zIndex: 1,
          }}
        />
        
        {/* Main content */}
        <ScrollView
          style={{ flex: 1, zIndex: 2 }}
          contentContainerStyle={{
            padding: Layout.safeArea.horizontal,
            paddingTop: Layout.safeArea.top + 20,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Omni-Search Command Bar */}
          <Animated.View
            style={{
              transform: [{ scale: searchBarScale }],
            }}
          >
            {isSearching && (
              <BlurView
                intensity={Components.commandBar.blur}
                tint="dark"
                style={{
                  position: 'absolute',
                  top: -10,
                  left: -10,
                  right: -10,
                  bottom: -10,
                  borderRadius: BorderRadius.xl,
                }}
              />
            )}
            
            <View
              style={{
                backgroundColor: isSearching ? Components.commandBar.background : Colors.surface,
                borderWidth: 1,
                borderColor: isSearching ? Colors.accent : Colors.border,
                borderRadius: Components.commandBar.borderRadius,
                height: Components.commandBar.height,
                paddingHorizontal: Components.commandBar.padding,
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: Spacing.lg,
              }}
            >
              <Text style={{ fontSize: 20, marginRight: 12, color: Colors.textSecondary }}>
                🔍
              </Text>
              
              <TextInput
                style={{
                  flex: 1,
                  fontFamily: Typography.body,
                  fontSize: Typography.sizes.base,
                  color: Colors.text,
                  fontWeight: Typography.weights.medium,
                }}
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
            <View style={{ marginBottom: Spacing.lg }}>
              <Text
                style={{
                  fontFamily: Typography.heading,
                  fontSize: Typography.sizes.sm,
                  fontWeight: Typography.weights.semibold,
                  color: Colors.textSecondary,
                  marginBottom: Spacing.md,
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                }}
              >
                Results
              </Text>
              {searchResults.map(renderSearchResult)}
            </View>
          )}

          {/* Quick Actions Bento Grid */}
          <View>
            <Text
              style={{
                fontFamily: Typography.heading,
                fontSize: Typography.sizes.sm,
                fontWeight: Typography.weights.semibold,
                color: Colors.textSecondary,
                marginBottom: Spacing.md,
                textTransform: 'uppercase',
                letterSpacing: 1,
              }}
            >
              Quick Actions
            </Text>
            
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                gap: Components.bentoGrid.gap,
              }}
            >
              {quickActions.map(renderQuickAction)}
            </View>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

export default OmniSearch;
