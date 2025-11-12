import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { colors } from 'src/constants';
import { scaledWidth, scaledHeight, normaliseFont } from 'src/util/dimensions';

class IncomeTab extends Component {
  constructor(props) {
    super(props);
    
    // Empty default options - this makes it clear when API options are not loaded
    // If you see no options in the UI, it means the API call failed or returned empty data
    this.defaultIncomeOptions = [];
  }

  getOptionsToDisplay = () => {
    // Use API options if available, otherwise fall back to defaults (which are now empty)
    const apiOptions = this.props.data.options;
    console.log('🎯 [IncomeTab] getOptionsToDisplay: apiOptions =', apiOptions);
    
    if (apiOptions && apiOptions.length > 0) {
      console.log('🎯 [IncomeTab] ✅ Using API options:', apiOptions);
      return apiOptions;
    } else {
      console.log('🎯 [IncomeTab] ❌ Using empty default options (API options not available or empty)');
      return this.defaultIncomeOptions;
    }
  };

  handleMultiSelect = (optionValue) => {
    console.log('🎯 [IncomeTab] handleMultiSelect: optionValue =', optionValue);
    console.log('🎯 [IncomeTab] FULL props.data =', JSON.stringify(this.props.data, null, 2));
    const currentValues = this.props.data.selectedOptions || [];
    const multipleChoice = this.props.data.multiple_choice !== false; // Default to true if not specified
    
    console.log('🎯 [IncomeTab] handleMultiSelect: currentValues =', currentValues);
    console.log('🎯 [IncomeTab] handleMultiSelect: multipleChoice =', multipleChoice);
    console.log('🎯 [IncomeTab] handleMultiSelect: this.props.data.multiple_choice RAW VALUE =', this.props.data.multiple_choice);
    console.log('🎯 [IncomeTab] handleMultiSelect: currentValues is Array?', Array.isArray(currentValues));
    console.log('🎯 [IncomeTab] handleMultiSelect: currentValues.length =', currentValues.length);
    let newValues;
    
    if (multipleChoice) {
      // Multi-select behavior (checkbox)
      if (currentValues.includes(optionValue)) {
        newValues = currentValues.filter(value => value !== optionValue);
        console.log('🎯 [IncomeTab] handleMultiSelect: removing option, newValues =', newValues);
      } else {
        newValues = [...currentValues, optionValue];
        console.log('🎯 [IncomeTab] handleMultiSelect: adding option, newValues =', newValues);
      }
    } else {
      // Single-select behavior (radio button)
      newValues = [optionValue];
      console.log('🎯 [IncomeTab] handleMultiSelect: single-select, newValues =', newValues);
    }
    
    console.log('🎯 [IncomeTab] handleMultiSelect: final newValues =', newValues);
    console.log('🎯 [IncomeTab] handleMultiSelect: newValues is Array?', Array.isArray(newValues));
    console.log('🎯 [IncomeTab] handleMultiSelect: newValues.length =', newValues.length);
    
    const updateData = { selectedOptions: newValues };
    console.log('🎯 [IncomeTab] handleMultiSelect: calling onDataChange with:', updateData);
    this.props.onDataChange(updateData);
    
    // Call validation callback if provided
    if (this.props.onValidationChange) {
      this.props.onValidationChange(newValues.length > 0);
    }
  };

  renderOptions = () => {
    const selectedValues = this.props.data.selectedOptions || [];
    const optionsToDisplay = this.getOptionsToDisplay();
    const multipleChoice = this.props.data.multiple_choice !== false; // Default to true if not specified
    const defaultSubtitle = multipleChoice ? 'Select all that apply' : 'Select one option';
    const sectionSubtitle = this.props.data.prompt || defaultSubtitle;
    
    console.log('🎯 [IncomeTab] renderOptions - multiple_choice =', this.props.data.multiple_choice);
    console.log('🎯 [IncomeTab] renderOptions - multipleChoice (computed) =', multipleChoice);
    console.log('🎯 [IncomeTab] renderOptions - sectionSubtitle =', sectionSubtitle);
    
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{this.props.data.description || 'Income'}</Text>
        <Text style={styles.sectionSubtitle}>{sectionSubtitle}</Text>
        {optionsToDisplay.map((option) => {
          const isSelected = selectedValues.includes(option.option_name || option.id);
          return (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.option,
                isSelected ? styles.selectedOption : null
              ]}
              onPress={() => this.handleMultiSelect(option.option_name || option.id)}
            >
              <View style={styles.optionContent}>
                <Text style={[
                  styles.optionLabel,
                  isSelected ? styles.selectedOptionText : null
                ]}>
                  {option.description}
                </Text>
              </View>
              <View style={[
                styles.checkbox,
                isSelected ? styles.checkboxSelected : null
              ]}>
                {isSelected && <Text style={styles.checkmark}>✓</Text>}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  render() {
    const optionsToDisplay = this.getOptionsToDisplay();
    
    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {optionsToDisplay.length === 0 ? (
            <View style={styles.noOptionsContainer}>
              <Text style={styles.noOptionsText}>
                No options available. Waiting for API data to load...
              </Text>
            </View>
          ) : (
            this.renderOptions()
          )}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightBackground,
  },
  content: {
    padding: scaledWidth(20),
  },
  section: {
    marginBottom: scaledHeight(30),
  },
  sectionTitle: {
    fontSize: normaliseFont(20),
    fontWeight: 'bold',
    color: colors.darkText,
    marginBottom: scaledHeight(8),
  },
  sectionSubtitle: {
    fontSize: normaliseFont(14),
    color: colors.gray,
    marginBottom: scaledHeight(16),
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    padding: scaledWidth(16),
    marginBottom: scaledHeight(8),
    borderRadius: scaledWidth(8),
    borderWidth: 1,
    borderColor: colors.lightGray,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  selectedOption: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  optionContent: {
    flex: 1,
  },
  optionLabel: {
    fontSize: normaliseFont(16),
    color: colors.darkText,
    fontWeight: '500',
  },
  selectedOptionText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  checkbox: {
    width: scaledWidth(24),
    height: scaledWidth(24),
    borderRadius: scaledWidth(4),
    borderWidth: 2,
    borderColor: colors.lightGray,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  checkmark: {
    color: colors.white,
    fontSize: normaliseFont(16),
    fontWeight: 'bold',
  },
  noOptionsContainer: {
    padding: scaledWidth(20),
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: scaledHeight(100),
  },
  noOptionsText: {
    fontSize: normaliseFont(16),
    color: colors.gray,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default IncomeTab;