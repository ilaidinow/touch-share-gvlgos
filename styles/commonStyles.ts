
import { StyleSheet } from 'react-native';
import { Theme } from '../contexts/ThemeContext';

export const createStyles = (theme: Theme) => {
  const buttonStyles = StyleSheet.create({
    primary: {
      backgroundColor: theme.primary,
      borderRadius: 12,
      paddingVertical: 16,
      paddingHorizontal: 24,
      alignItems: 'center',
      justifyContent: 'center',
    },
    secondary: {
      backgroundColor: theme.backgroundAlt,
      borderRadius: 12,
      paddingVertical: 16,
      paddingHorizontal: 24,
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      fontSize: 17,
      fontWeight: '600',
      color: theme.background,
    },
    textSecondary: {
      fontSize: 17,
      fontWeight: '600',
      color: theme.text,
    },
  });

  const commonStyles = StyleSheet.create({
    wrapper: {
      backgroundColor: theme.background,
      width: '100%',
      height: '100%',
    },
    container: {
      flex: 1,
      backgroundColor: theme.background,
      width: '100%',
      height: '100%',
    },
    content: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 20,
      maxWidth: 800,
      width: '100%',
      alignSelf: 'center',
    },
    title: {
      fontSize: 34,
      fontWeight: '700',
      textAlign: 'center',
      color: theme.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 22,
      fontWeight: '600',
      textAlign: 'center',
      color: theme.text,
      marginBottom: 16,
    },
    text: {
      fontSize: 17,
      fontWeight: '400',
      color: theme.text,
      marginBottom: 8,
      lineHeight: 22,
      textAlign: 'center',
    },
    textSecondary: {
      fontSize: 15,
      fontWeight: '400',
      color: theme.textSecondary,
      marginBottom: 8,
      lineHeight: 20,
      textAlign: 'center',
    },
    section: {
      width: '100%',
      alignItems: 'center',
      paddingHorizontal: 20,
      marginBottom: 32,
    },
    card: {
      backgroundColor: theme.card,
      borderRadius: 16,
      padding: 20,
      marginVertical: 8,
      width: '100%',
      boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)',
      elevation: 3,
      borderWidth: 1,
      borderColor: theme.border,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
    },
    center: {
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

  return { commonStyles, buttonStyles };
};

// Legacy exports for backward compatibility
export const colors = {
  primary: '#007AFF',
  secondary: '#5856D6',
  accent: '#34C759',
  background: '#FFFFFF',
  backgroundAlt: '#F2F2F7',
  text: '#000000',
  textSecondary: '#8E8E93',
  grey: '#C7C7CC',
  card: '#FFFFFF',
  border: '#E5E5EA',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
};

export const buttonStyles = StyleSheet.create({
  primary: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondary: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.background,
  },
  textSecondary: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
  },
});

export const commonStyles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    maxWidth: 800,
    width: '100%',
    alignSelf: 'center',
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    textAlign: 'center',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
    color: colors.text,
    marginBottom: 16,
  },
  text: {
    fontSize: 17,
    fontWeight: '400',
    color: colors.text,
    marginBottom: 8,
    lineHeight: 22,
    textAlign: 'center',
  },
  textSecondary: {
    fontSize: 15,
    fontWeight: '400',
    color: colors.textSecondary,
    marginBottom: 8,
    lineHeight: 20,
    textAlign: 'center',
  },
  section: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginVertical: 8,
    width: '100%',
    boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)',
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
