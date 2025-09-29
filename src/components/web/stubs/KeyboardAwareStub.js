// Stub for react-native-keyboard-aware-scroll-view
import React from 'react';
import { ScrollView } from 'react-native';

export const KeyboardAwareScrollView = ({ children, ...props }) => (
  <ScrollView {...props}>
    {children}
  </ScrollView>
);

export default { KeyboardAwareScrollView };