import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { PET_TYPE_EMOJIS, COLORS, BORDER_RADIUS } from '../constants/theme';

interface PetAvatarProps {
  name: string;
  petType: string;
  photoUri?: string;
  size?: number;
  color?: string;
  onPress?: () => void;
  selected?: boolean;
}

export function PetAvatar({
  name,
  petType,
  photoUri,
  size = 60,
  color = COLORS.primary,
  onPress,
  selected,
}: PetAvatarProps) {
  const content = (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: photoUri ? undefined : color + '20',
          borderWidth: selected ? 3 : 0,
          borderColor: color,
        },
      ]}
    >
      {photoUri ? (
        <Image
          source={{ uri: photoUri }}
          style={{ width: size, height: size, borderRadius: size / 2 }}
        />
      ) : (
        <Text style={{ fontSize: size * 0.45 }}>
          {PET_TYPE_EMOJIS[petType] || '🐾'}
        </Text>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
        <Text style={[styles.name, { maxWidth: size + 10 }]} numberOfLines={1}>
          {name}
        </Text>
      </TouchableOpacity>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  name: {
    color: COLORS.text,
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 4,
  },
});
