import React from 'react';
import { Canvas, useImage, Image, Rect, LinearGradient, vec, RoundedRect } from '@shopify/react-native-skia';
import { View, StyleSheet } from 'react-native';

interface MeshGradientProps {
  style?: any;
  children?: React.ReactNode;
}

export function ClinicalMeshGradient({ style, children }: MeshGradientProps) {
  return (
    <View style={[styles.container, style]}>
      <Canvas style={styles.canvas}>
        {/* Deep forest green to dark charcoal mesh gradient */}
        <LinearGradient
          start={vec(0, 0)}
          end={vec(400, 400)}
          colors={[
            { position: 0, color: '#0a2e0a' }, // Deep forest green
            { position: 0.3, color: '#1a1a1a' }, // Dark charcoal
            { position: 0.6, color: '#0d1f0d' }, // Forest green
            { position: 0.8, color: '#161616' }, // Medium charcoal
            { position: 1, color: '#0a2e0a' }, // Deep forest green
          ]}
        />
        {/* Secondary mesh layer for depth */}
        <LinearGradient
          start={vec(200, 0)}
          end={vec(200, 400)}
          colors={[
            { position: 0, color: 'rgba(10, 46, 10, 0.3)' },
            { position: 0.5, color: 'rgba(26, 26, 26, 0.5)' },
            { position: 1, color: 'rgba(10, 46, 10, 0.3)' },
          ]}
        />
      </Canvas>
      {children && <View style={styles.content}>{children}</View>}
    </View>
  );
}

export function AmbientMeshGradient({ style, children }: MeshGradientProps) {
  return (
    <View style={[styles.container, style]}>
      <Canvas style={styles.canvas}>
        {/* Organic ambient background with mint accent */}
        <LinearGradient
          start={vec(0, 0)}
          end={vec(350, 350)}
          colors={[
            { position: 0, color: '#000000' }, // Pure matte black
            { position: 0.2, color: '#0d1f0d' }, // Forest green
            { position: 0.4, color: '#1a1a1a' }, // Dark charcoal
            { position: 0.6, color: '#0a1a0a' }, // Dark green
            { position: 0.8, color: '#121212' }, // Surface dark
            { position: 1, color: '#000000' }, // Pure matte black
          ]}
        />
        {/* Subtle mint glow overlay */}
        <LinearGradient
          start={vec(100, 100)}
          end={vec(300, 300)}
          colors={[
            { position: 0, color: 'rgba(184, 255, 210, 0.05)' },
            { position: 0.5, color: 'rgba(184, 255, 210, 0.1)' },
            { position: 1, color: 'rgba(184, 255, 210, 0.05)' },
          ]}
        />
      </Canvas>
      {children && <View style={styles.content}>{children}</View>}
    </View>
  );
}

export function EmergencyMeshGradient({ style, children }: MeshGradientProps) {
  return (
    <View style={[styles.container, style]}>
      <Canvas style={styles.canvas}>
        {/* Emergency mode with red accents */}
        <LinearGradient
          start={vec(0, 0)}
          end={vec(400, 400)}
          colors={[
            { position: 0, color: '#1a0000' }, // Dark red
            { position: 0.3, color: '#000000' }, // Pure black
            { position: 0.6, color: '#1a0505' }, // Dark red
            { position: 0.8, color: '#0a0000' }, // Very dark red
            { position: 1, color: '#000000' }, // Pure black
          ]}
        />
        {/* Emergency pulse overlay */}
        <LinearGradient
          start={vec(200, 0)}
          end={vec(200, 400)}
          colors={[
            { position: 0, color: 'rgba(255, 69, 58, 0.1)' },
            { position: 0.5, color: 'rgba(255, 69, 58, 0.2)' },
            { position: 1, color: 'rgba(255, 69, 58, 0.1)' },
          ]}
        />
      </Canvas>
      {children && <View style={styles.content}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  canvas: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flex: 1,
    position: 'relative',
    zIndex: 1,
  },
});
