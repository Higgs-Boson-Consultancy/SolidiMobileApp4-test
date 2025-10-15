// React imports
import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Alert, TouchableOpacity } from 'react-native';

// Material Design imports
import { Text, Card, Button, TextInput, RadioButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';

// Internal imports
import { colors, sharedStyles, sharedColors } from 'src/constants';
import { scaledWidth, scaledHeight, normaliseFont } from 'src/util/dimensions';

// Logger
import logger from 'src/util/logger';
let logger2 = logger.extend('QuestionnaireForm');
let {deb, dj, log, lj} = logger.getShortcuts(logger2);

// Simple HTML renderer for basic tags
const renderHtmlText = (htmlString) => {
  if (!htmlString) return '';
  
  // Split by HTML tags and render accordingly
  const parts = htmlString.split(/(<[^>]*>)/);
  let result = [];
  let key = 0;
  
  const processText = (text, style = {}) => {
    // Handle <br> tags by splitting on them
    if (text.includes('<br>')) {
      return text.split('<br>').map((part, index) => (
        <React.Fragment key={`br-${key++}`}>
          {index > 0 && '\n'}
          {part}
        </React.Fragment>
      ));
    }
    return text;
  };
  
  let currentStyle = {};
  let skipNext = false;
  
  for (let i = 0; i < parts.length; i++) {
    if (skipNext) {
      skipNext = false;
      continue;
    }
    
    const part = parts[i];
    
    if (part.startsWith('<') && part.endsWith('>')) {
      const tag = part.toLowerCase();
      
      if (tag === '<h2>') {
        currentStyle = { fontSize: 24, fontWeight: 'bold', marginBottom: 10 };
      } else if (tag === '</h2>') {
        currentStyle = {};
      } else if (tag === '<h5>') {
        currentStyle = { fontSize: 16, fontWeight: '600', marginBottom: 8 };
      } else if (tag === '</h5>') {
        currentStyle = {};
      } else if (tag === '<b>') {
        currentStyle = { ...currentStyle, fontWeight: 'bold' };
      } else if (tag === '</b>') {
        currentStyle = { ...currentStyle, fontWeight: 'normal' };
      } else if (tag.startsWith('<a ')) {
        // Extract href for links
        const hrefMatch = part.match(/href="([^"]*)"/);
        if (hrefMatch) {
          currentStyle = { ...currentStyle, color: sharedColors.primaryMain, textDecorationLine: 'underline' };
        }
      } else if (tag === '</a>') {
        currentStyle = { ...currentStyle, color: undefined, textDecorationLine: undefined };
      }
    } else if (part.trim()) {
      result.push(
        <Text key={key++} style={currentStyle}>
          {processText(part)}
        </Text>
      );
    }
  }
  
  return result.length > 0 ? result : htmlString.replace(/<[^>]*>/g, '');
};

const QuestionnaireForm = ({ questionnaire, onSubmit, loading, submitButtonText }) => {
  const [answers, setAnswers] = useState({});
  const [currentPage, setCurrentPage] = useState(0);

  // Handle answer changes
  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  // Get current questions (for single page forms or multi-page forms)
  const getCurrentQuestions = () => {
    if (questionnaire.pages) {
      // Multi-page form
      return questionnaire.pages[currentPage]?.questions || [];
    } else {
      // Single page form
      return questionnaire.questions || [];
    }
  };

  // Get current page info
  const getCurrentPageInfo = () => {
    if (questionnaire.pages) {
      return questionnaire.pages[currentPage] || {};
    }
    return {};
  };

  // Handle next page navigation
  const handleNext = () => {
    if (questionnaire.pages && currentPage < questionnaire.pages.length - 1) {
      setCurrentPage(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  // Handle previous page navigation
  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    } else if (onBack) {
      onBack();
    }
  };

  // Handle form submission
  const handleSubmit = () => {
    log('Submitting questionnaire', { formId: questionnaire.formid, answers });
    
    if (onSubmit) {
      onSubmit({
        formId: questionnaire.formid,
        uuid: questionnaire.uuid,
        answers: answers
      });
    } else {
      Alert.alert('Form Submitted', 'Your responses have been recorded.');
    }
  };

  // Render different question types
  const renderQuestion = (question, index, questionsArray) => {
    const currentAnswer = answers[question.id] || question.answer || '';
    const isLastQuestion = index === questionsArray.length - 1;

    switch (question.type) {
      case 'legend':
        return (
          <View key={question.id} style={[styles.questionSection, isLastQuestion && styles.lastQuestionSection]}>
            <View style={styles.legendText}>
              {renderHtmlText(question.label)}
            </View>
          </View>
        );

      case 'text':
        return (
          <View key={question.id} style={[styles.questionSection, isLastQuestion && styles.lastQuestionSection]}>
            <View style={styles.questionHeader}>
              {question['prepend-icon'] && (
                <Icon name={question['prepend-icon'].replace('fa-', '')} size={16} color={colors.primary} style={styles.questionIcon} />
              )}
              <Text variant="titleMedium" style={styles.questionLabel}>
                {question.label}
              </Text>
            </View>
            {question.guidance && (
              <Text variant="bodySmall" style={styles.questionGuidance}>
                {question.guidance}
              </Text>
            )}
            <TextInput
              mode="outlined"
              value={currentAnswer}
              placeholder={question.placeholder}
              onChangeText={(text) => handleAnswerChange(question.id, text)}
              style={styles.textInput}
            />
          </View>
        );

      case 'textarea':
        return (
          <View key={question.id} style={[styles.questionSection, isLastQuestion && styles.lastQuestionSection]}>
            <View style={styles.questionHeader}>
              {question['prepend-icon'] && (
                <Icon name={question['prepend-icon'].replace('fa-', '')} size={16} color={colors.primary} style={styles.questionIcon} />
              )}
              <Text variant="titleMedium" style={styles.questionLabel}>
                {question.label}
              </Text>
            </View>
            {question.guidance && (
              <Text variant="bodySmall" style={styles.questionGuidance}>
                {question.guidance}
              </Text>
            )}
            <TextInput
              mode="outlined"
              value={currentAnswer}
              placeholder={question.placeholder}
              onChangeText={(text) => handleAnswerChange(question.id, text)}
              multiline
              numberOfLines={4}
              style={styles.textInput}
            />
          </View>
        );

      case 'radio':
        return (
          <View key={question.id} style={[styles.questionSection, isLastQuestion && styles.lastQuestionSection]}>
            {question.label && (
              <Text variant="titleMedium" style={styles.questionLabel}>
                {question.label}
              </Text>
            )}
            {question.guidance && (
              <Text variant="bodySmall" style={styles.questionGuidance}>
                {question.guidance}
              </Text>
            )}
            <RadioButton.Group
              onValueChange={(value) => handleAnswerChange(question.id, value)}
              value={currentAnswer}
            >
              <View style={styles.optionsContainer}>
                {question.values?.map((option) => (
                  <TouchableOpacity 
                    key={option.id} 
                    style={[
                      styles.radioOption,
                      currentAnswer === option.id && styles.selectedRadioOption
                    ]}
                    onPress={() => handleAnswerChange(question.id, option.id)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.radioRow}>
                      <RadioButton value={option.id} />
                      <View 
                        style={[
                          styles.radioText,
                          currentAnswer === option.id && styles.selectedRadioText
                        ]}
                      >
                        {renderHtmlText(option.text)}
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </RadioButton.Group>
          </View>
        );

      case 'upload':
        return (
          <View key={question.id} style={[styles.questionSection, isLastQuestion && styles.lastQuestionSection]}>
            <Text variant="titleMedium" style={styles.questionLabel}>
              {question.label}
            </Text>
            {question.guidance && (
              <Text variant="bodySmall" style={styles.questionGuidance}>
                {question.guidance}
              </Text>
            )}
            <Button
              mode="outlined"
              onPress={() => {
                Alert.alert('File Upload', 'File upload functionality would be implemented here.');
                handleAnswerChange(question.id, 'file_placeholder.pdf');
              }}
              style={styles.uploadButton}
              icon="upload"
            >
              {currentAnswer ? `Selected: ${currentAnswer}` : 'Choose File'}
            </Button>
          </View>
        );

      default:
        return null;
    }
  };

  const currentQuestions = getCurrentQuestions();
  const pageInfo = getCurrentPageInfo();
  const isLastPage = !questionnaire.pages || currentPage === questionnaire.pages.length - 1;
  const isFirstPage = currentPage === 0;

  return (
    <ScrollView style={[sharedStyles.container, { backgroundColor: sharedColors.background }]}>
      <View style={styles.container}>
        
        {/* Form Header */}
        <Card style={styles.headerCard}>
          <Card.Content>
            <Text variant="headlineSmall" style={styles.formTitle}>
              {questionnaire.formtitle}
            </Text>
            {questionnaire.formintro && (
              <Text variant="bodyMedium" style={styles.formIntro}>
                {questionnaire.formintro}
              </Text>
            )}
            {questionnaire.pages && (
              <Text variant="bodySmall" style={styles.pageIndicator}>
                Page {currentPage + 1} of {questionnaire.pages.length}
              </Text>
            )}
          </Card.Content>
        </Card>

        {/* Questions */}
        <Card style={styles.questionsContainer}>
          <Card.Content style={styles.questionsContent}>
            {currentQuestions.map((question, index) => renderQuestion(question, index, currentQuestions))}
          </Card.Content>
        </Card>

        {/* Navigation Buttons */}
        <View style={styles.navigationContainer}>
          {(!isFirstPage || onBack) && (
            <Button
              mode="outlined"
              onPress={handlePrevious}
              style={[styles.navButton, styles.backButton]}
            >
              {pageInfo.prevbutton || 'Back'}
            </Button>
          )}
          
          <Button
            mode="contained"
            onPress={handleNext}
            style={[styles.navButton, styles.nextButton]}
          >
            {isLastPage ? (formData.submittext || 'Submit') : (pageInfo.nextbutton || 'Next')}
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  headerCard: {
    marginBottom: 16,
  },
  formTitle: {
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 8,
  },
  formIntro: {
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  pageIndicator: {
    color: '#888',
    textAlign: 'right',
  },
  questionsContainer: {
    flex: 1,
    marginBottom: 16,
  },
  questionsContent: {
    padding: 20,
  },
  questionSection: {
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  lastQuestionSection: {
    borderBottomWidth: 0,
    marginBottom: 0,
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  questionIcon: {
    marginRight: 8,
  },
  questionLabel: {
    fontWeight: '600',
    flex: 1,
    marginBottom: 8,
  },
  legendText: {
    fontSize: normaliseFont(16),
    lineHeight: 24,
    color: '#333',
    fontWeight: '500',
  },
  questionGuidance: {
    color: '#666',
    marginBottom: 12,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  textInput: {
    backgroundColor: '#fff',
    marginTop: 8,
  },
  optionsContainer: {
    marginTop: 12,
  },
  radioOption: {
    marginBottom: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedRadioOption: {
    backgroundColor: '#f8f9fa',
    borderColor: '#e9ecef',
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 4,
    minHeight: 40,
  },
  radioText: {
    flex: 1,
    marginLeft: 12,
    lineHeight: 22,
    fontSize: normaliseFont(15),
    color: '#333',
  },
  selectedRadioText: {
    fontWeight: '500',
    color: colors.primary,
  },
  uploadButton: {
    marginTop: 8,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  navButton: {
    flex: 0.45,
  },
  backButton: {
    marginRight: 8,
  },
  nextButton: {
    marginLeft: 8,
  },
});

export default QuestionnaireForm;