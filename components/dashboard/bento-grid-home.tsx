import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { 
  Heart, 
  Wind, 
  Activity, 
  Brain, 
  Baby, 
  FlaskConical, 
  Stethoscope, 
  Syringe, 
  AlertTriangle,
  BookOpen,
  Clock,
  TrendingUp,
  Calendar,
  Pill,
  FileText,
} from 'lucide-react';
import { MotiView } from 'moti';
import { GlassCard, FrostedGlass } from '@/components/ui/glassmorphism';
import { AmbientMeshGradient } from '@/components/backgrounds/mesh-gradient';
import { triggerSelectionHaptic } from '@/lib/clinical-haptics';
import { useDatabase } from '@/db/provider';
import { systems, conditions } from '@/db/schema';
import { getTotalCases } from '@/lib/surveillance';

const { width: screenWidth } = Dimensions.get('window');
const cardSpacing = 12;

interface BentoCardProps {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  color: string;
  size: 'small' | 'medium' | 'large' | 'wide' | 'tall';
  onPress: () => void;
  badge?: string;
  value?: string | number;
  trend?: 'up' | 'down' | 'neutral';
}

function BentoCard({ 
  title, 
  subtitle, 
  icon, 
  color, 
  size, 
  onPress, 
  badge, 
  value, 
  trend 
}: BentoCardProps) {
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { width: (screenWidth - 48) / 2, height: 120 };
      case 'medium':
        return { width: (screenWidth - 48) / 2, height: 160 };
      case 'large':
        return { width: screenWidth - 24, height: 200 };
      case 'wide':
        return { width: screenWidth - 24, height: 120 };
      case 'tall':
        return { width: (screenWidth - 48) / 2, height: 200 };
      default:
        return { width: (screenWidth - 48) / 2, height: 160 };
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <MotiView
      from={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <TouchableOpacity
        style={[sizeStyles]}
        onPress={() => {
          triggerSelectionHaptic();
          onPress();
        }}
        activeOpacity={0.7}
      >
        <GlassCard 
          elevated 
          style={[
            styles.card,
            { borderLeftWidth: 3, borderLeftColor: color }
          ]}
        >
          <View style={styles.cardContent}>
            {/* Header */}
            <View style={styles.cardHeader}>
              <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
                {icon}
              </View>
              {badge && (
                <View style={[styles.badge, { backgroundColor: color }]}>
                  <Text style={[styles.badgeText, { color: '#FFFFFF' }]}>
                    {badge}
                  </Text>
                </View>
              )}
            </View>

            {/* Content */}
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>{title}</Text>
              {subtitle && (
                <Text style={styles.cardSubtitle}>{subtitle}</Text>
              )}
              
              {value !== undefined && (
                <View style={styles.valueContainer}>
                  <Text style={[styles.cardValue, { color }]}>{value}</Text>
                  {trend && (
                    <TrendingUp 
                      size={16} 
                      color={trend === 'up' ? '#00D7B5' : trend === 'down' ? '#FF453A' : '#7A7A80'} 
                    />
                  )}
                </View>
              )}
            </View>
          </View>
        </GlassCard>
      </TouchableOpacity>
    </MotiView>
  );
}

export function BentoGridHome({ navigation }: any) {
  const { db } = useDatabase();
  const [sysList, setSysList] = useState<any[]>([]);
  const [condCount, setCondCount] = useState(0);
  const [totalCases, setTotalCases] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) return;
    
    const loadData = async () => {
      try {
        const systems = await db.select().from(systems);
        setSysList(systems);
        
        const conditions = await db.select().from(conditions);
        setCondCount(conditions.length);
        
        const cases = await getTotalCases();
        setTotalCases(cases);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [db]);

  const handleSystemPress = (system: any) => {
    navigation.navigate('gp/[system]', { id: system.id });
  };

  const handleERPress = () => {
    navigation.navigate('er');
  };

  const handleDIMSPress = () => {
    navigation.navigate('dims');
  };

  const handleQuizPress = () => {
    navigation.navigate('gp/quiz');
  };

  if (loading) {
    return (
      <AmbientMeshGradient>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#B8FFD2" />
          <Text style={styles.loadingText}>Loading Clinical OS...</Text>
        </View>
      </AmbientMeshGradient>
    );
  }

  return (
    <AmbientMeshGradient>
      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Clinical OS</Text>
          <Text style={styles.headerSubtitle}>Premium Medical Dashboard</Text>
        </View>

        {/* Bento Grid */}
        <View style={styles.grid}>
          {/* Large Stats Card */}
          <BentoCard
            title="Total Cases Logged"
            subtitle="Clinical activity tracking"
            icon={<Activity size={24} color="#B8FFD2" />}
            color="#B8FFD2"
            size="large"
            onPress={() => {}}
            value={totalCases}
            trend="up"
          />

          {/* System Cards Row */}
          <View style={styles.row}>
            {sysList.slice(0, 2).map((system, index) => {
              const IconComponent = {
                Heart, Wind, Activity, Brain, Baby, FlaskConical, Stethoscope, Syringe
              }[system.icon] || Stethoscope;
              
              return (
                <BentoCard
                  key={system.id}
                  title={system.name}
                  subtitle={`${system.conditions || 0} conditions`}
                  icon={<IconComponent size={20} color={system.color || "#B8FFD2"} />}
                  color={system.color || "#B8FFD2"}
                  size="medium"
                  onPress={() => handleSystemPress(system)}
                />
              );
            })}
          </View>

          {/* Quick Actions Row */}
          <View style={styles.row}>
            <BentoCard
              title="Emergency Mode"
              subtitle="Critical protocols"
              icon={<AlertTriangle size={20} color="#FF453A" />}
              color="#FF453A"
              size="medium"
              onPress={handleERPress}
              badge="ER"
            />
            
            <BentoCard
              title="Drug Index"
              subtitle="Medicines & dosage"
              icon={<Pill size={20} color="#00D7B5" />}
              color="#00D7B5"
              size="medium"
              onPress={handleDIMSPress}
              badge="DIMS"
            />
          </View>

          {/* Wide Stats Card */}
          <BentoCard
            title="Medical Knowledge Base"
            subtitle={`${condCount} conditions available`}
            icon={<BookOpen size={24} color="#64D2FF" />}
            color="#64D2FF"
            size="wide"
            onPress={() => {}}
            value={condCount}
          />

          {/* Tools Row */}
          <View style={styles.row}>
            <BentoCard
              title="Clinical Quiz"
              subtitle="Test your knowledge"
              icon={<Brain size={20} color="#FFD60A" />}
              color="#FFD60A"
              size="small"
              onPress={handleQuizPress}
              badge="OSCE"
            />
            
            <BentoCard
              title="Recent Activity"
              subtitle="Last 7 days"
              icon={<Clock size={20} color="#7A7A80" />}
              color="#7A7A80"
              size="small"
              onPress={() => {}}
            />
          </View>

          {/* Tall Card for Additional Info */}
          <BentoCard
            title="Protocol Updates"
            subtitle="Latest clinical guidelines"
            icon={<FileText size={24} color="#00D7B5" />}
            color="#00D7B5"
            size="tall"
            onPress={() => {}
            }
            badge="NEW"
          />
        </View>

        {/* Bottom spacing for one-handed reach */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </AmbientMeshGradient>
  );
}

const styles = {
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 12,
    paddingTop: 60,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: '#B8B8BE',
  },
  header: {
    paddingHorizontal: 12,
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 32,
    fontFamily: 'Geist-ExtraBold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: '#B8B8BE',
  },
  grid: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: cardSpacing,
  },
  card: {
    flex: 1,
    marginHorizontal: cardSpacing / 2,
    padding: 16,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
  },
  cardBody: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#B8B8BE',
    marginBottom: 8,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  cardValue: {
    fontSize: 24,
    fontFamily: 'Geist-Bold',
  },
  bottomSpacing: {
    height: 120, // Extra space for one-handed reach
  },
};
