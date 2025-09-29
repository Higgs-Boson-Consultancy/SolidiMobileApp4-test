// Stub for react-native-progress
import React from 'react';
import { View, Text } from 'react-native';

const ProgressStub = ({ style, progress = 0, ...props }) => (
  <View style={[{ 
    padding: 8, 
    backgroundColor: '#e9ecef', 
    borderRadius: 4,
    minHeight: 20,
    justifyContent: 'center',
    alignItems: 'center'
  }, style]}>
    <Text style={{ fontSize: 12, color: '#666' }}>
      Progress: {Math.round(progress * 100)}%
    </Text>
  </View>
);

export const Bar = ProgressStub;
export const Circle = ProgressStub;
export const CircleSnail = ProgressStub; 
export const Pie = ProgressStub;

export default {
  Bar,
  Circle,
  CircleSnail,
  Pie,
};