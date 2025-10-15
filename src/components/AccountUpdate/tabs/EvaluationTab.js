import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { colors } from 'src/constants';
import { scaledWidth, scaledHeight, normaliseFont } from 'src/util/dimensions';

class EvaluationTab extends Component {
  constructor(props) {
    super(props);
    
    this.riskToleranceOptions = [
      { 
        id: 'conservative', 
        label: 'Conservative', 
        subtitle: 'Capital Preservation',
        description: 'I prefer stable, predictable returns even if they are lower', 
        icon: '🛡️',
        color: colors.success,
        characteristics: ['Low volatility', 'Stable income', 'Capital preservation']
      },
      { 
        id: 'moderate', 
        label: 'Moderate', 
        subtitle: 'Balanced Growth',
        description: 'I want some growth but with limited risk', 
        icon: '⚖️',
        color: colors.info,
        characteristics: ['Balanced approach', 'Moderate growth', 'Some volatility tolerance']
      },
      { 
        id: 'aggressive', 
        label: 'Aggressive', 
        subtitle: 'Growth Focused',
        description: 'I am willing to take significant risks for higher returns', 
        icon: '🚀',
        color: colors.warning,
        characteristics: ['High growth potential', 'Higher volatility', 'Long-term focus']
      },
      { 
        id: 'speculative', 
        label: 'Speculative', 
        subtitle: 'High Risk/High Reward',
        description: 'I understand and accept the possibility of significant losses', 
        icon: '🎲',
        color: colors.error,
        characteristics: ['Maximum growth potential', 'High risk', 'Possible significant losses']
      },
    ];

    this.investmentHorizonOptions = [
      { id: 'short', label: 'Short-term (< 2 years)', description: 'Need funds within 2 years', icon: '📅' },
      { id: 'medium', label: 'Medium-term (2-7 years)', description: 'Goals within 2-7 years', icon: '📆' },
      { id: 'long', label: 'Long-term (7+ years)', description: 'Long-term wealth building', icon: '🗓️' },
      { id: 'mixed', label: 'Mixed Timeline', description: 'Multiple goals with different timelines', icon: '⏰' },
    ];

    this.priorityGoalsOptions = [
      { id: 'retirement', label: 'Retirement Planning', icon: '🏖️' },
      { id: 'education', label: 'Education Funding', icon: '🎓' },
      { id: 'home', label: 'Home Purchase', icon: '🏠' },
      { id: 'emergency', label: 'Emergency Fund', icon: '🆘' },
      { id: 'income', label: 'Passive Income', icon: '💰' },
      { id: 'travel', label: 'Travel & Leisure', icon: '✈️' },
      { id: 'business', label: 'Start a Business', icon: '🏢' },
      { id: 'legacy', label: 'Legacy/Estate', icon: '👨‍👩‍👧‍👦' },
    ];

    this.riskScenarios = [
      {
        id: 'scenario1',
        question: 'Your investment loses 20% in the first year. What would you do?',
        options: [
          { id: 'sell_all', label: 'Sell everything immediately', risk: 'conservative' },
          { id: 'sell_some', label: 'Sell some to reduce exposure', risk: 'moderate' },
          { id: 'hold', label: 'Hold and wait for recovery', risk: 'aggressive' },
          { id: 'buy_more', label: 'Buy more at the lower price', risk: 'speculative' },
        ]
      },
      {
        id: 'scenario2',
        question: 'How much portfolio volatility can you comfortably handle?',
        options: [
          { id: 'minimal', label: 'Minimal fluctuations (±5%)', risk: 'conservative' },
          { id: 'moderate', label: 'Moderate fluctuations (±15%)', risk: 'moderate' },
          { id: 'significant', label: 'Significant fluctuations (±25%)', risk: 'aggressive' },
          { id: 'extreme', label: 'Extreme fluctuations (±40%+)', risk: 'speculative' },
        ]
      },
    ];
  }

  handleDataChange = (field, value) => {
    this.props.onDataChange({ [field]: value });
  };

  handleMultiSelect = (field, optionId) => {
    const currentValues = this.props.data[field] || [];
    let newValues;
    
    if (currentValues.includes(optionId)) {
      newValues = currentValues.filter(id => id !== optionId);
    } else {
      newValues = [...currentValues, optionId];
    }
    
    this.handleDataChange(field, newValues);
  };

  handleScenarioAnswer = (scenarioId, answerId, riskLevel) => {
    const scenarios = this.props.data.scenarioAnswers || {};
    scenarios[scenarioId] = { answer: answerId, riskLevel };
    this.handleDataChange('scenarioAnswers', scenarios);
  };

  calculateRiskProfile = () => {
    const { data } = this.props;
    const scenarios = data.scenarioAnswers || {};
    const scenarioCount = Object.keys(scenarios).length;
    
    if (scenarioCount === 0) return null;

    // Count risk level preferences
    const riskCounts = {
      conservative: 0,
      moderate: 0,
      aggressive: 0,
      speculative: 0
    };

    Object.values(scenarios).forEach(scenario => {
      if (scenario.riskLevel) {
        riskCounts[scenario.riskLevel]++;
      }
    });

    // Add primary risk tolerance selection
    if (data.riskTolerance) {
      riskCounts[data.riskTolerance]++;
    }

    // Find the most selected risk level
    const maxCount = Math.max(...Object.values(riskCounts));
    const suggestedRisk = Object.keys(riskCounts).find(key => riskCounts[key] === maxCount);

    return suggestedRisk;
  };

  renderRiskTolerance = () => {
    const { data } = this.props;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What is your risk tolerance?</Text>
        <Text style={styles.sectionSubtitle}>
          Choose the approach that best describes your investment philosophy
        </Text>
        
        {this.riskToleranceOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.riskOption,
              data.riskTolerance === option.id ? [styles.selectedRiskOption, { borderColor: option.color }] : null
            ]}
            onPress={() => this.handleDataChange('riskTolerance', option.id)}
          >
            <View style={styles.riskHeader}>
              <Text style={styles.riskIcon}>{option.icon}</Text>
              <View style={styles.riskTitleContainer}>
                <Text style={[
                  styles.riskLabel,
                  data.riskTolerance === option.id ? { color: option.color } : null
                ]}>
                  {option.label}
                </Text>
                <Text style={[
                  styles.riskSubtitle,
                  data.riskTolerance === option.id ? { color: option.color } : null
                ]}>
                  {option.subtitle}
                </Text>
              </View>
              <View style={[
                styles.radioButton,
                data.riskTolerance === option.id ? { borderColor: option.color } : null
              ]}>
                {data.riskTolerance === option.id && (
                  <View style={[styles.radioButtonInner, { backgroundColor: option.color }]} />
                )}
              </View>
            </View>
            <Text style={[
              styles.riskDescription,
              data.riskTolerance === option.id ? styles.selectedRiskDescription : null
            ]}>
              {option.description}
            </Text>
            <View style={styles.characteristicsContainer}>
              {option.characteristics.map((char, index) => (
                <View key={index} style={styles.characteristic}>
                  <Text style={[
                    styles.characteristicText,
                    data.riskTolerance === option.id ? { color: option.color } : null
                  ]}>
                    • {char}
                  </Text>
                </View>
              ))}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  renderRiskScenarios = () => {
    const { data } = this.props;
    const scenarios = data.scenarioAnswers || {};

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Risk Assessment Scenarios</Text>
        <Text style={styles.sectionSubtitle}>
          How would you react in these situations?
        </Text>
        
        {this.riskScenarios.map((scenario, index) => (
          <View key={scenario.id} style={styles.scenarioContainer}>
            <Text style={styles.scenarioQuestion}>
              {index + 1}. {scenario.question}
            </Text>
            {scenario.options.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.scenarioOption,
                  scenarios[scenario.id]?.answer === option.id ? styles.selectedScenarioOption : null
                ]}
                onPress={() => this.handleScenarioAnswer(scenario.id, option.id, option.risk)}
              >
                <Text style={[
                  styles.scenarioOptionText,
                  scenarios[scenario.id]?.answer === option.id ? styles.selectedScenarioOptionText : null
                ]}>
                  {option.label}
                </Text>
                <View style={[
                  styles.radioButton,
                  scenarios[scenario.id]?.answer === option.id ? styles.radioButtonSelected : null
                ]}>
                  {scenarios[scenario.id]?.answer === option.id && (
                    <View style={styles.radioButtonInner} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    );
  };

  renderInvestmentHorizon = () => {
    const { data } = this.props;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Investment Time Horizon</Text>
        <Text style={styles.sectionSubtitle}>
          When do you expect to need these funds?
        </Text>
        
        {this.investmentHorizonOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.option,
              data.investmentHorizon === option.id ? styles.selectedOption : null
            ]}
            onPress={() => this.handleDataChange('investmentHorizon', option.id)}
          >
            <Text style={styles.optionIcon}>{option.icon}</Text>
            <View style={styles.optionContent}>
              <Text style={[
                styles.optionLabel,
                data.investmentHorizon === option.id ? styles.selectedOptionText : null
              ]}>
                {option.label}
              </Text>
              <Text style={[
                styles.optionDescription,
                data.investmentHorizon === option.id ? styles.selectedOptionDescription : null
              ]}>
                {option.description}
              </Text>
            </View>
            <View style={[
              styles.radioButton,
              data.investmentHorizon === option.id ? styles.radioButtonSelected : null
            ]}>
              {data.investmentHorizon === option.id && <View style={styles.radioButtonInner} />}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  renderPriorityGoals = () => {
    const { data } = this.props;
    const selectedGoals = data.priorityGoals || [];

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Priority Investment Goals</Text>
        <Text style={styles.sectionSubtitle}>Select your top 3 financial goals</Text>
        <View style={styles.gridContainer}>
          {this.priorityGoalsOptions.map((option) => {
            const isSelected = selectedGoals.includes(option.id);
            const isDisabled = !isSelected && selectedGoals.length >= 3;
            
            return (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.gridItem,
                  isSelected ? styles.selectedGridItem : null,
                  isDisabled ? styles.disabledGridItem : null
                ]}
                onPress={() => {
                  if (!isDisabled || isSelected) {
                    this.handleMultiSelect('priorityGoals', option.id);
                  }
                }}
                disabled={isDisabled}
              >
                <Text style={styles.gridIcon}>{option.icon}</Text>
                <Text style={[
                  styles.gridLabel,
                  isSelected ? styles.selectedGridLabel : null,
                  isDisabled ? styles.disabledGridLabel : null
                ]}>
                  {option.label}
                </Text>
                {isSelected && (
                  <View style={styles.selectedIndicator}>
                    <Text style={styles.checkmark}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
        <Text style={styles.goalCounter}>
          Selected: {selectedGoals.length}/3
        </Text>
      </View>
    );
  };

  renderRiskProfileSummary = () => {
    const suggestedRisk = this.calculateRiskProfile();
    if (!suggestedRisk) return null;

    const riskOption = this.riskToleranceOptions.find(opt => opt.id === suggestedRisk);
    if (!riskOption) return null;

    return (
      <View style={[styles.summaryBox, { borderLeftColor: riskOption.color }]}>
        <Text style={styles.summaryTitle}>📊 Your Risk Profile Assessment</Text>
        <View style={styles.summaryContent}>
          <Text style={styles.summaryIcon}>{riskOption.icon}</Text>
          <View style={styles.summaryText}>
            <Text style={[styles.summaryLabel, { color: riskOption.color }]}>
              Suggested Profile: {riskOption.label}
            </Text>
            <Text style={styles.summaryDescription}>
              Based on your responses, you appear to have a {riskOption.label.toLowerCase()} risk tolerance. 
              This suggests you may be comfortable with {riskOption.subtitle.toLowerCase()}.
            </Text>
          </View>
        </View>
      </View>
    );
  };

  render() {
    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.tabTitle}>Investment Evaluation</Text>
          <Text style={styles.tabDescription}>
            This assessment helps us understand your investment preferences, 
            risk tolerance, and financial goals to provide personalized recommendations.
          </Text>

          {this.renderRiskTolerance()}
          {this.renderRiskScenarios()}
          {this.renderInvestmentHorizon()}
          {this.renderPriorityGoals()}
          {this.renderRiskProfileSummary()}

          {/* Disclaimer */}
          <View style={styles.disclaimerBox}>
            <Text style={styles.disclaimerTitle}>⚠️ Important Disclaimer</Text>
            <Text style={styles.disclaimerText}>
              This assessment is for informational purposes only and does not constitute 
              investment advice. Past performance does not guarantee future results. 
              All investments carry risk, including potential loss of principal.
            </Text>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: scaledWidth(20),
  },
  tabTitle: {
    fontSize: normaliseFont(24),
    fontWeight: 'bold',
    color: colors.darkGray,
    marginBottom: scaledHeight(10),
  },
  tabDescription: {
    fontSize: normaliseFont(16),
    color: colors.gray,
    marginBottom: scaledHeight(30),
    lineHeight: scaledHeight(22),
  },
  section: {
    marginBottom: scaledHeight(30),
  },
  sectionTitle: {
    fontSize: normaliseFont(18),
    fontWeight: 'bold',
    color: colors.darkGray,
    marginBottom: scaledHeight(5),
  },
  sectionSubtitle: {
    fontSize: normaliseFont(14),
    color: colors.gray,
    marginBottom: scaledHeight(15),
    fontStyle: 'italic',
  },
  riskOption: {
    backgroundColor: colors.white,
    padding: scaledWidth(15),
    marginBottom: scaledHeight(15),
    borderRadius: scaledWidth(10),
    borderWidth: 2,
    borderColor: colors.lightGray,
  },
  selectedRiskOption: {
    backgroundColor: colors.primaryLight,
  },
  riskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scaledHeight(10),
  },
  riskIcon: {
    fontSize: normaliseFont(28),
    marginRight: scaledWidth(12),
  },
  riskTitleContainer: {
    flex: 1,
  },
  riskLabel: {
    fontSize: normaliseFont(18),
    fontWeight: 'bold',
    color: colors.darkGray,
  },
  riskSubtitle: {
    fontSize: normaliseFont(14),
    color: colors.gray,
    fontWeight: '500',
  },
  riskDescription: {
    fontSize: normaliseFont(15),
    color: colors.gray,
    marginBottom: scaledHeight(10),
  },
  selectedRiskDescription: {
    color: colors.darkGray,
  },
  characteristicsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  characteristic: {
    marginRight: scaledWidth(15),
  },
  characteristicText: {
    fontSize: normaliseFont(13),
    color: colors.gray,
    fontStyle: 'italic',
  },
  scenarioContainer: {
    marginBottom: scaledHeight(25),
    backgroundColor: colors.lightBackground,
    padding: scaledWidth(15),
    borderRadius: scaledWidth(10),
  },
  scenarioQuestion: {
    fontSize: normaliseFont(16),
    fontWeight: 'bold',
    color: colors.darkGray,
    marginBottom: scaledHeight(12),
  },
  scenarioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: scaledWidth(12),
    marginBottom: scaledHeight(8),
    borderRadius: scaledWidth(8),
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  selectedScenarioOption: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  scenarioOptionText: {
    flex: 1,
    fontSize: normaliseFont(14),
    color: colors.darkGray,
  },
  selectedScenarioOptionText: {
    color: colors.primary,
    fontWeight: '500',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: scaledWidth(15),
    marginBottom: scaledHeight(10),
    borderRadius: scaledWidth(10),
    borderWidth: 2,
    borderColor: colors.lightGray,
  },
  selectedOption: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  optionIcon: {
    fontSize: normaliseFont(24),
    marginRight: scaledWidth(12),
  },
  optionContent: {
    flex: 1,
  },
  optionLabel: {
    fontSize: normaliseFont(16),
    fontWeight: '600',
    color: colors.darkGray,
    marginBottom: scaledHeight(3),
  },
  selectedOptionText: {
    color: colors.primary,
  },
  optionDescription: {
    fontSize: normaliseFont(14),
    color: colors.gray,
  },
  selectedOptionDescription: {
    color: colors.primaryDark,
  },
  radioButton: {
    width: scaledWidth(24),
    height: scaledWidth(24),
    borderRadius: scaledWidth(12),
    borderWidth: 2,
    borderColor: colors.gray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    borderColor: colors.primary,
  },
  radioButtonInner: {
    width: scaledWidth(12),
    height: scaledWidth(12),
    borderRadius: scaledWidth(6),
    backgroundColor: colors.primary,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%',
    backgroundColor: colors.white,
    padding: scaledWidth(15),
    marginBottom: scaledHeight(10),
    borderRadius: scaledWidth(10),
    borderWidth: 2,
    borderColor: colors.lightGray,
    alignItems: 'center',
    position: 'relative',
    minHeight: scaledHeight(80),
  },
  selectedGridItem: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  disabledGridItem: {
    opacity: 0.5,
    borderColor: colors.lightGray,
  },
  gridIcon: {
    fontSize: normaliseFont(24),
    marginBottom: scaledHeight(8),
  },
  gridLabel: {
    fontSize: normaliseFont(14),
    fontWeight: '600',
    color: colors.darkGray,
    textAlign: 'center',
  },
  selectedGridLabel: {
    color: colors.primary,
  },
  disabledGridLabel: {
    color: colors.gray,
  },
  selectedIndicator: {
    position: 'absolute',
    top: scaledHeight(5),
    right: scaledWidth(5),
    backgroundColor: colors.primary,
    borderRadius: scaledWidth(10),
    width: scaledWidth(20),
    height: scaledWidth(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: colors.white,
    fontSize: normaliseFont(12),
    fontWeight: 'bold',
  },
  goalCounter: {
    fontSize: normaliseFont(14),
    color: colors.gray,
    textAlign: 'center',
    marginTop: scaledHeight(10),
    fontStyle: 'italic',
  },
  summaryBox: {
    backgroundColor: colors.infoBackground,
    padding: scaledWidth(15),
    borderRadius: scaledWidth(10),
    borderLeftWidth: 4,
    marginBottom: scaledHeight(20),
  },
  summaryTitle: {
    fontSize: normaliseFont(16),
    fontWeight: 'bold',
    color: colors.darkGray,
    marginBottom: scaledHeight(10),
  },
  summaryContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  summaryIcon: {
    fontSize: normaliseFont(32),
    marginRight: scaledWidth(12),
  },
  summaryText: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: normaliseFont(16),
    fontWeight: 'bold',
    marginBottom: scaledHeight(5),
  },
  summaryDescription: {
    fontSize: normaliseFont(14),
    color: colors.gray,
    lineHeight: scaledHeight(20),
  },
  disclaimerBox: {
    backgroundColor: colors.warningBackground,
    padding: scaledWidth(15),
    borderRadius: scaledWidth(10),
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
    marginTop: scaledHeight(20),
  },
  disclaimerTitle: {
    fontSize: normaliseFont(16),
    fontWeight: 'bold',
    color: colors.warning,
    marginBottom: scaledHeight(8),
  },
  disclaimerText: {
    fontSize: normaliseFont(14),
    color: colors.gray,
    lineHeight: scaledHeight(20),
  },
});

export default EvaluationTab;