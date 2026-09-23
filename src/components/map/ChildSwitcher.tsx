import { useGlobalStore } from '@/store';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(p => p.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

const ChildSwitcher = () => {
  const {
    theme: { colors },
  } = useUnistyles();
  const [open, setOpen] = useState(false);
  const children = useGlobalStore(s => s.children);
  const currentChildIndex = useGlobalStore(s => s.currentChildIndex);
  const setCurrentChildIndex = useGlobalStore(s => s.setCurrentChildIndex);
  const child = children[currentChildIndex];

  if (!child) return null;

  const handleSelect = (index: number) => {
    setCurrentChildIndex(index);
    setOpen(false);
  };

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity style={styles.trigger} activeOpacity={0.7} onPress={() => setOpen(o => !o)}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{getInitials(child.name)}</Text>
        </View>
        <View style={styles.triggerTextCol}>
          <Text style={styles.triggerName} numberOfLines={1}>
            {child.name}
          </Text>
          <Text style={styles.triggerGrade} numberOfLines={1}>
            {child.grade}
          </Text>
        </View>
        <Ionicons
          name={open ? 'chevron-up' : 'chevron-down'}
          size={14}
          color={styles.chevron.color}
        />
      </TouchableOpacity>

      {open && (
        <View style={styles.dropdown}>
          {children.map((c, i) => (
            <TouchableOpacity
              key={c.id}
              style={[styles.item, i === currentChildIndex && styles.itemActive]}
              activeOpacity={0.7}
              onPress={() => handleSelect(i)}>
              <View style={[styles.avatarSmall, { backgroundColor: colors.primaryTint }]}>
                <Text style={styles.avatarSmallText}>{getInitials(c.name)}</Text>
              </View>
              <View style={styles.itemTextCol}>
                <Text
                  style={[styles.itemName, i === currentChildIndex && styles.itemNameActive]}
                  numberOfLines={1}>
                  {c.name}
                </Text>
                <Text style={styles.itemGrade} numberOfLines={1}>
                  {c.grade}
                </Text>
              </View>
              {i === currentChildIndex && (
                <Ionicons name='checkmark' size={16} color={colors.primaryTint} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create(({ colors }) => ({
  wrapper: {
    position: 'relative',
    zIndex: 100,
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    gap: 10,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 12,
    fontFamily: 'RubikSemiBold',
    color: colors.light,
  },
  triggerTextCol: {
    flexShrink: 1,
    gap: 1,
  },
  triggerName: {
    fontSize: 14,
    fontFamily: 'RubikSemiBold',
    color: colors.text,
  },
  triggerGrade: {
    fontSize: 11,
    fontFamily: 'Rubik',
    color: colors.placeholderText,
  },
  chevron: {
    color: colors.placeholderText,
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: 4,
    backgroundColor: colors.light,
    borderRadius: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 10,
  },
  itemActive: {
    backgroundColor: colors.surface,
  },
  avatarSmall: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarSmallText: {
    fontSize: 11,
    fontFamily: 'RubikSemiBold',
    color: colors.light,
  },
  itemTextCol: {
    flex: 1,
    gap: 1,
  },
  itemName: {
    fontSize: 14,
    fontFamily: 'Rubik',
    color: colors.text,
  },
  itemNameActive: {
    fontFamily: 'RubikMedium',
    color: colors.primaryTint,
  },
  itemGrade: {
    fontSize: 11,
    fontFamily: 'Rubik',
    color: colors.placeholderText,
  },
}));

export default ChildSwitcher;
