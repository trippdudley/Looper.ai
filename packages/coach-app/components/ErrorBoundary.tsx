import { Component, type ReactNode } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: { componentStack?: string | null }): void {
    // In production, send to error reporting service (Sentry, etc.)
    console.error('ErrorBoundary caught:', error, info.componentStack);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <View style={styles.card}>
            <Text style={styles.title}>Something went wrong</Text>
            <Text style={styles.message}>
              {this.state.error?.message ?? 'An unexpected error occurred'}
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={this.handleReset}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C1117',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: '#151D28',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2A3A4A',
    padding: 24,
    alignItems: 'center',
    gap: 16,
    maxWidth: 340,
    width: '100%',
  },
  title: {
    fontFamily: 'DMSans',
    fontSize: 20,
    fontWeight: '700',
    color: '#E8ECF1',
  },
  message: {
    fontFamily: 'DMSans',
    fontSize: 14,
    color: '#8B99A8',
    textAlign: 'center',
    lineHeight: 20,
  },
  button: {
    backgroundColor: '#10B981',
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginTop: 4,
  },
  buttonText: {
    fontFamily: 'DMSans',
    fontSize: 15,
    fontWeight: '700',
    color: '#0C1117',
  },
});
