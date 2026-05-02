import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { GlassCard } from '@/components/ui/glassmorphism';

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  style?: any;
}

export function Skeleton({ width = '100%', height = 20, borderRadius = 8, style }: SkeletonProps) {
  return (
    <MotiView
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: '#1A1A1A',
        },
        style,
      ]}
      animate={{
        backgroundColor: ['#1A1A1A', '#2A2A2A', '#1A1A1A'],
      }}
      transition={{
        type: 'timing',
        duration: 1500,
        repeat: Infinity,
      }}
    />
  );
}

export function BentoCardSkeleton({ size = 'medium' }: { size?: 'small' | 'medium' | 'large' | 'wide' | 'tall' }) {
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { width: '47%', height: 120 };
      case 'medium':
        return { width: '47%', height: 160 };
      case 'large':
        return { width: '100%', height: 200 };
      case 'wide':
        return { width: '100%', height: 120 };
      case 'tall':
        return { width: '47%', height: 200 };
      default:
        return { width: '47%', height: 160 };
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <GlassCard elevated style={[sizeStyles, styles.skeletonCard]}>
      <View style={styles.cardContent}>
        {/* Icon skeleton */}
        <Skeleton width={40} height={40} borderRadius={12} />
        
        {/* Text skeletons */}
        <View style={styles.textContainer}>
          <Skeleton width="80%" height={20} borderRadius={4} style={styles.titleSkeleton} />
          <Skeleton width="60%" height={14} borderRadius={4} style={styles.subtitleSkeleton} />
        </View>
      </View>
    </GlassCard>
  );
}

export function MedicineCardSkeleton() {
  return (
    <GlassCard elevated style={styles.medicineCard}>
      <View style={styles.medicineContent}>
        {/* Left side - icon and text */}
        <View style={styles.medicineLeft}>
          <Skeleton width={48} height={48} borderRadius={16} />
          <View style={styles.medicineText}>
            <Skeleton width={120} height={20} borderRadius={4} />
            <Skeleton width={80} height={14} borderRadius={4} style={styles.medicineSubtitle} />
          </View>
        </View>
        
        {/* Right side - dosage */}
        <View style={styles.medicineRight}>
          <Skeleton width={60} height={24} borderRadius={4} />
        </View>
      </View>
    </GlassCard>
  );
}

export function ProtocolCardSkeleton() {
  return (
    <GlassCard elevated style={styles.protocolCard}>
      <View style={styles.protocolContent}>
        {/* Header */}
        <View style={styles.protocolHeader}>
          <Skeleton width={40} height={40} borderRadius={12} />
          <View style={styles.protocolText}>
            <Skeleton width={140} height={20} borderRadius={4} />
            <Skeleton width={100} height={14} borderRadius={4} style={styles.protocolSubtitle} />
          </View>
        </View>
        
        {/* Progress skeleton */}
        <View style={styles.progressContainer}>
          <Skeleton width="100%" height={8} borderRadius={4} />
        </View>
        
        {/* Stats */}
        <View style={styles.statsContainer}>
          <Skeleton width={40} height={16} borderRadius={4} />
          <Skeleton width={40} height={16} borderRadius={4} />
        </View>
      </View>
    </GlassCard>
  );
}

export function ListSkeleton({ items = 3 }: { items?: number }) {
  return (
    <View style={styles.listContainer}>
      {Array.from({ length: items }).map((_, index) => (
        <GlassCard key={index} style={styles.listItem}>
          <View style={styles.listContent}>
            <Skeleton width={40} height={40} borderRadius={12} />
            <View style={styles.listText}>
              <Skeleton width={150} height={18} borderRadius={4} />
              <Skeleton width={100} height={14} borderRadius={4} style={styles.listSubtitle} />
            </View>
            <Skeleton width={24} height={24} borderRadius={12} />
          </View>
        </GlassCard>
      ))}
    </View>
  );
}

export function SearchSkeleton() {
  return (
    <View style={styles.searchContainer}>
      {/* Search bar skeleton */}
      <GlassCard style={styles.searchBar}>
        <View style={styles.searchContent}>
          <Skeleton width={20} height={20} borderRadius={4} />
          <Skeleton width="80%" height={20} borderRadius={4} />
        </View>
      </GlassCard>
      
      {/* Results skeleton */}
      <View style={styles.resultsContainer}>
        {Array.from({ length: 3 }).map((_, index) => (
          <GlassCard key={index} style={styles.resultItem}>
            <View style={styles.resultContent}>
              <View style={styles.resultLeft}>
                <Skeleton width={48} height={48} borderRadius={16} />
                <View style={styles.resultText}>
                  <Skeleton width={120} height={18} borderRadius={4} />
                  <Skeleton width={80} height={14} borderRadius={4} style={styles.resultSubtitle} />
                </View>
              </View>
              <Skeleton width={60} height={24} borderRadius={12} />
            </View>
          </GlassCard>
        ))}
      </View>
    </View>
  );
}

export function DashboardSkeleton() {
  return (
    <View style={styles.dashboardContainer}>
      {/* Header skeleton */}
      <View style={styles.header}>
        <Skeleton width={200} height={32} borderRadius={4} />
        <Skeleton width={150} height={16} borderRadius={4} style={styles.subtitle} />
      </View>
      
      {/* Stats skeleton */}
      <View style={styles.statsRow}>
        <GlassCard style={styles.statCard}>
          <Skeleton width={80} height={16} borderRadius={4} />
          <Skeleton width={60} height={32} borderRadius={4} style={styles.statValue} />
        </GlassCard>
        <GlassCard style={styles.statCard}>
          <Skeleton width={80} height={16} borderRadius={4} />
          <Skeleton width={60} height={32} borderRadius={4} style={styles.statValue} />
        </GlassCard>
      </View>
      
      {/* Bento grid skeleton */}
      <View style={styles.bentoGrid}>
        <BentoCardSkeleton size="large" />
        <View style={styles.bentoRow}>
          <BentoCardSkeleton size="medium" />
          <BentoCardSkeleton size="medium" />
        </View>
        <BentoCardSkeleton size="wide" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  skeletonCard: {
    padding: 16,
  },
  cardContent: {
    flex: 1,
  },
  textContainer: {
    marginTop: 16,
    flex: 1,
  },
  titleSkeleton: {
    marginBottom: 8,
  },
  subtitleSkeleton: {
    marginBottom: 4,
  },
  medicineCard: {
    padding: 16,
    marginBottom: 12,
  },
  medicineContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  medicineLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  medicineText: {
    marginLeft: 16,
    flex: 1,
  },
  medicineSubtitle: {
    marginTop: 4,
  },
  medicineRight: {
    alignItems: 'flex-end',
  },
  protocolCard: {
    padding: 16,
    marginBottom: 12,
  },
  protocolContent: {
    flex: 1,
  },
  protocolHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  protocolText: {
    marginLeft: 16,
    flex: 1,
  },
  protocolSubtitle: {
    marginTop: 4,
  },
  progressContainer: {
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  listContainer: {
    flex: 1,
  },
  listItem: {
    padding: 16,
    marginBottom: 12,
  },
  listContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listText: {
    marginLeft: 16,
    flex: 1,
  },
  listSubtitle: {
    marginTop: 4,
  },
  searchContainer: {
    flex: 1,
  },
  searchBar: {
    padding: 16,
    marginBottom: 16,
  },
  searchContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultsContainer: {
    flex: 1,
  },
  resultItem: {
    padding: 16,
    marginBottom: 12,
  },
  resultContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  resultLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  resultText: {
    marginLeft: 16,
    flex: 1,
  },
  resultSubtitle: {
    marginTop: 4,
  },
  dashboardContainer: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  subtitle: {
    marginTop: 8,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    marginTop: 8,
  },
  bentoGrid: {
    flex: 1,
  },
  bentoRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
});
