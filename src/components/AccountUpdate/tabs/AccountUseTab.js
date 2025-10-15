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

class AccountUseTab extends Component {
  constructor(props) {
    super(props);
    
    // Empty default options - this makes it clear when API options are not loaded
    // If you see no options in the UI, it means the API call failed or returned empty data
    this.defaultAccountUseOptions = [];
  }

  getOptionsToDisplay = () => {
    // Use API options if available, otherwise fall back to defaults (which are now empty)
    const apiOptions = this.props.data.options || this.props.data.availableOptions;
    console.log('🎯 [AccountUseTab] getOptionsToDisplay: this.props.data =', this.props.data);
    console.log('🎯 [AccountUseTab] getOptionsToDisplay: apiOptions =', apiOptions);
    console.log('🎯 [AccountUseTab] Looking for options in:', {
      'data.options': this.props.data.options,
      'data.availableOptions': this.props.data.availableOptions
    });
    
    if (apiOptions && apiOptions.length > 0) {
      console.log('🎯 [AccountUseTab] ✅ Using API options:', apiOptions);
      return apiOptions;
    } else {
      console.log('🎯 [AccountUseTab] ❌ Using empty default options (API options not available or empty)');
      console.log('🎯 [AccountUseTab] Empty default options:', this.defaultAccountUseOptions);
      return this.defaultAccountUseOptions;
    }
  };

  handleMultiSelect = (optionValue) => {
    console.log('🎯 [AccountUseTab] handleMultiSelect: optionValue =', optionValue);
    const currentValues = this.props.data.selectedOptions || [];
    console.log('🎯 [AccountUseTab] handleMultiSelect: currentValues =', currentValues);
    let newValues;
    
    if (currentValues.includes(optionValue)) {
      newValues = currentValues.filter(value => value !== optionValue);
      console.log('🎯 [AccountUseTab] handleMultiSelect: removing option');
    } else {
      newValues = [...currentValues, optionValue];
      console.log('🎯 [AccountUseTab] handleMultiSelect: adding option');
    }
    
    console.log('🎯 [AccountUseTab] handleMultiSelect: newValues =', newValues);
    
    // Notify parent component of the change
    const updateData = { selectedOptions: newValues };
    this.props.onDataChange(updateData);
    
    // Also trigger validation update if callback exists
    if (this.props.onValidationChange) {
      this.props.onValidationChange(newValues.length > 0);
    }
  };

  renderOptions = () => {
    const selectedValues = this.props.data.selectedOptions || [];
    const optionsToDisplay = this.getOptionsToDisplay();
    const sectionTitle = this.props.data.description || 'Account Use';
    const sectionSubtitle = this.props.data.prompt || 'Select all that apply';
    
    console.log('🎯 [AccountUseTab] renderOptions: selectedValues =', selectedValues);
    console.log('🎯 [AccountUseTab] renderOptions: optionsToDisplay =', optionsToDisplay);
    console.log('🎯 [AccountUseTab] renderOptions: sectionTitle =', sectionTitle);
    console.log('🎯 [AccountUseTab] renderOptions: sectionSubtitle =', sectionSubtitle);
    
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{sectionTitle}</Text>
        <Text style={styles.sectionSubtitle}>{sectionSubtitle}</Text>
        {optionsToDisplay.map((option) => {
          // Handle both API format (description, option_name) and potential legacy format (label, value)
          const optionValue = option.option_name || option.value || option.id;
          const optionLabel = option.description || option.label || `Option ${option.id}`;
          const isSelected = selectedValues.includes(optionValue);
          
          console.log('🎯 [AccountUseTab] Rendering option:', {
            id: option.id,
            value: optionValue,
            label: optionLabel,
            isSelected
          });
          
          return (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.option,
                isSelected ? styles.selectedOption : null
              ]}
              onPress={() => this.handleMultiSelect(optionValue)}
            >
              <View style={styles.optionContent}>
                <Text style={[
                  styles.optionLabel,
                  isSelected ? styles.selectedOptionText : null
                ]}>
                  {optionLabel}
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

export default AccountUseTab;