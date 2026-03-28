import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants/theme';

interface LogSavingsModalProps {
  visible: boolean;
  challengeName: string;
  suggestedAmount?: number;
  onSubmit: (amount: number) => void;
  onClose: () => void;
}

export function LogSavingsModal({
  visible,
  challengeName,
  suggestedAmount,
  onSubmit,
  onClose,
}: LogSavingsModalProps) {
  const [amount, setAmount] = useState(suggestedAmount?.toFixed(2) ?? '');

  const handleSubmit = () => {
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) return;
    onSubmit(num);
    setAmount('');
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <View style={styles.modal}>
          <Text style={styles.title}>Log Savings</Text>
          <Text style={styles.subtitle}>{challengeName}</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.dollar}>$</Text>
            <TextInput
              style={styles.input}
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
              placeholder="0.00"
              placeholderTextColor={COLORS.textMuted}
              autoFocus
            />
          </View>

          {suggestedAmount !== undefined && (
            <TouchableOpacity
              style={styles.suggestButton}
              onPress={() => setAmount(suggestedAmount.toFixed(2))}
            >
              <Text style={styles.suggestText}>
                Suggested: ${suggestedAmount.toFixed(2)}
              </Text>
            </TouchableOpacity>
          )}

          <View style={styles.buttons}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
              <Text style={styles.submitText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  title: {
    color: COLORS.text,
    fontSize: FONT_SIZE.xxl,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.md,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: SPACING.lg,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.backgroundLight,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  dollar: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.hero,
    fontWeight: '700',
    marginRight: 4,
  },
  input: {
    color: COLORS.text,
    fontSize: FONT_SIZE.hero,
    fontWeight: '700',
    minWidth: 100,
    textAlign: 'center',
  },
  suggestButton: {
    alignSelf: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.primary + '20',
    borderRadius: BORDER_RADIUS.full,
    marginBottom: SPACING.lg,
  },
  suggestText: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
  },
  buttons: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  cancelBtn: {
    flex: 1,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.backgroundLight,
    alignItems: 'center',
  },
  cancelText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
  },
  submitBtn: {
    flex: 1,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  submitText: {
    color: COLORS.text,
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
  },
});
