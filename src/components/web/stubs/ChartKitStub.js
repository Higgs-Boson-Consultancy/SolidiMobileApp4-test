// Comprehensive stub for react-native-chart-kit
import React from 'react';
import { View, Text } from 'react-native';

const ChartStub = ({ style, ...props }) => (
  <View style={[{ padding: 20, alignItems: 'center', backgroundColor: '#f8f9fa', borderRadius: 8 }, style]}>
    <Text style={{ color: '#666', fontSize: 14 }}>📊 Chart (Web Preview)</Text>
    <Text style={{ color: '#999', fontSize: 12, marginTop: 4 }}>Charts displayed on mobile app</Text>
  </View>
);

export const LineChart = ChartStub;
export const BarChart = ChartStub;
export const PieChart = ChartStub;
export const ProgressChart = ChartStub;
export const ContributionGraph = ChartStub;
export const StackedBarChart = ChartStub;
export const AbstractChart = ChartStub;

export default {
  LineChart,
  BarChart, 
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
  AbstractChart,
};