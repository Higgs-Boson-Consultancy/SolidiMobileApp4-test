// Enhanced Dynamic QuestionnaireForm
// This shows how to enhance your existing component for API-driven forms

import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Text, Card, Button, TextInput, RadioButton, ActivityIndicator } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';

// Internal imports
import { colors, sharedStyles, sharedColors } from 'src/constants';
import { scaledWidth, scaledHeight, normaliseFont } from 'src/util/dimensions';
import AppStateContext from 'src/application/data';

const DynamicQuestionnaireForm = ({ 
  // NEW: Either provide formData directly OR an API endpoint
  formData = null,           // Static form data (your current approach)
  apiEndpoint = null,        // Dynamic API endpoint
  formId = null,             // Form ID to fetch from API
  onSubmit, 
  onBack 
}) => {
  const appState = useContext(AppStateContext);
  const [answers, setAnswers] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  
  // NEW: State for dynamic loading
  const [dynamicFormData, setDynamicFormData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // NEW: Effect to load form data from API if needed
  useEffect(() => {
    if (apiEndpoint || formId) {
      loadFormFromAPI();
    } else if (formData) {
      setDynamicFormData(formData);
    }
  }, [apiEndpoint, formId]);

  // NEW: Function to load form definition from API
  const loadFormFromAPI = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Construct URL based on what's provided
      let url;
      if (apiEndpoint) {
        url = apiEndpoint;
      } else if (formId) {
        url = `/api/questionnaires/${formId}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch form: ${response.status}`);
      }

      const formDefinition = await response.json();
      setDynamicFormData(formDefinition);
      
    } catch (err) {
      console.error('Error loading form:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Use dynamicFormData if available, fallback to static formData
  const activeFormData = dynamicFormData || formData;

  // Handle answer changes
  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  // Get current questions (for single page forms or multi-page forms)
  const getCurrentQuestions = () => {
    if (!activeFormData) return [];
    
    if (activeFormData.pages) {
      return activeFormData.pages[currentPage]?.questions || [];
    } else {
      return activeFormData.questions || [];
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    const activeFormData = getActiveFormData();
    const submissionData = {
      formId: activeFormData.formid,
      uuid: activeFormData.uuid,
      answers: answers
    };

    // Create the answered form JSON
    const answeredFormJSON = createAnsweredFormJSON();

    // Print the revised JSON to console
    console.log('='.repeat(80));
    console.log('📋 FORM SUBMISSION - REVISED JSON');
    console.log('='.repeat(80));
    console.log(JSON.stringify(answeredFormJSON, null, 2));
    console.log('='.repeat(80));

    // Upload the revised JSON to /private_upload/ using AppState
    let uploadSuccess = false;
    try {
      console.log('📤 Uploading revised JSON to /private_upload/...');
      
      // Convert form answers to the expected format
      const submitData = {
        formData: answeredFormJSON,
        formType: 'self_categorisation',
        uuid: activeFormData.uuid,
        answers: answers
      };
      
      // Use AppState privateMethod for proper API authentication and routing
      console.log('� Using AppState.privateMethod for upload...');
      const uploadResult = await appState.privateMethod({
        apiRoute: 'private_upload',
        params: submitData,
        functionName: 'uploadQuestionnaireJSON',
        httpMethod: 'POST'
      });

      console.log('✅ Successfully uploaded revised JSON to /private_upload/');
      console.log('📥 Upload response body:', JSON.stringify(uploadResult, null, 2));
      
      // Test upload success
      if (uploadResult && (uploadResult.result === 'success' || uploadResult.success || uploadResult.error === null)) {
        uploadSuccess = true;
        console.log('🎉 UPLOAD TEST PASSED: Server confirmed successful submission');
      } else {
        console.log('⚠️ UPLOAD TEST WARNING: Uncertain success status from server');
        uploadSuccess = false;
      }

    } catch (uploadError) {
      console.error('❌ UPLOAD TEST FAILED:', uploadError.message);
      console.error('📋 Full error details:', uploadError);
      uploadSuccess = false;
    }

    // Log final upload test result
    console.log('='.repeat(50));
    console.log(`🔍 UPLOAD TEST RESULT: ${uploadSuccess ? 'SUCCESS ✅' : 'FAILED ❌'}`);
    console.log('='.repeat(50));

    // NEW: If form has a submiturl, post to API
    if (activeFormData.submiturl) {
      try {
        const response = await fetch(activeFormData.submiturl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submissionData)
        });

        if (!response.ok) {
          throw new Error('Failed to submit form');
        }

        const result = await response.json();
        console.log('✅ Form submitted successfully to API');
        
        if (onSubmit) {
          onSubmit({ 
            ...submissionData, 
            serverResponse: result, 
            filledFormJSON: answeredFormJSON,
            uploadSuccess: uploadSuccess
          });
        }
      } catch (err) {
        console.error('❌ Failed to submit form:', err.message);
      }
    } else {
      console.log('✅ Form completed (no submit URL provided)');
      
      if (onSubmit) {
        onSubmit({ 
          ...submissionData, 
          filledFormJSON: answeredFormJSON,
          uploadSuccess: uploadSuccess
        });
      }
    }
  };

  // NEW: Render loading state
  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading questionnaire...</Text>
      </View>
    );
  }

  // NEW: Render error state
  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error loading form: {error}</Text>
        <Button mode="outlined" onPress={loadFormFromAPI} style={styles.retryButton}>
          Retry
        </Button>
      </View>
    );
  }

  // Show message if no form data available
  if (!activeFormData) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>No form data available</Text>
      </View>
    );
  }

  // Helper functions (must be defined before JSX)
  const renderQuestion = (question, index, allQuestions) => {
    const questionKey = `${currentPage}_${question.id}`;
    const currentAnswer = answers[question.id] || question.answer || '';

    switch (question.type) {
      case 'legend':
        return (
          <View key={questionKey} style={styles.questionContainer}>
            <Text style={styles.legendText}>{question.label}</Text>
            {question.guidance ? (
              <Text style={styles.questionGuidance}>{question.guidance}</Text>
            ) : null}
          </View>
        );

      case 'text':
      case 'email':
      case 'password':
        return (
          <View key={questionKey} style={styles.questionContainer}>
            <Text style={styles.questionLabel}>{question.label}</Text>
            {question.guidance ? (
              <Text style={styles.questionGuidance}>{question.guidance}</Text>
            ) : null}
            <TextInput
              style={styles.textInput}
              value={currentAnswer}
              placeholder={question.placeholder || ''}
              secureTextEntry={question.type === 'password'}
              keyboardType={question.type === 'email' ? 'email-address' : 'default'}
              onChangeText={(text) => updateAnswer(question.id, text)}
              mode="outlined"
            />
          </View>
        );

      case 'textarea':
        return (
          <View key={questionKey} style={styles.questionContainer}>
            <Text style={styles.questionLabel}>{question.label}</Text>
            {question.guidance ? (
              <Text style={styles.questionGuidance}>{question.guidance}</Text>
            ) : null}
            <TextInput
              style={styles.textInput}
              value={currentAnswer}
              placeholder={question.placeholder || ''}
              onChangeText={(text) => updateAnswer(question.id, text)}
              mode="outlined"
              multiline
              numberOfLines={4}
            />
          </View>
        );

      case 'radio':
        return (
          <View key={questionKey} style={styles.questionContainer}>
            <Text style={styles.questionLabel}>{question.label}</Text>
            {question.guidance ? (
              <Text style={styles.questionGuidance}>{question.guidance}</Text>
            ) : null}
            <View style={styles.radioGroupContainer}>
              {question.values?.map((option, optionIndex) => (
                <TouchableOpacity 
                  key={`${questionKey}_${option.id}`}
                  style={[
                    styles.radioOptionContainer,
                    currentAnswer === option.id && styles.radioOptionSelected
                  ]}
                  onPress={() => updateAnswer(question.id, option.id)}
                  activeOpacity={0.7}
                >
                  <RadioButton
                    value={option.id}
                    status={currentAnswer === option.id ? 'checked' : 'unchecked'}
                    onPress={() => updateAnswer(question.id, option.id)}
                    color="#1976D2"
                    uncheckedColor="#757575"
                  />
                  <Text style={[
                    styles.radioLabel,
                    currentAnswer === option.id && styles.radioLabelSelected
                  ]}>
                    {option.text}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      default:
        console.warn('Unknown question type:', question.type);
        return (
          <View key={questionKey} style={styles.questionContainer}>
            <Text style={styles.questionLabel}>
              Unsupported question type: {question.type}
            </Text>
          </View>
        );
    }
  };

  const updateAnswer = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const getActiveFormData = () => {
    // Return formData prop if available, otherwise return dynamicFormData from state
    return formData || dynamicFormData;
  };

  // Function to create a copy of the form JSON with filled answers
  const createAnsweredFormJSON = () => {
    const activeFormData = getActiveFormData();
    if (!activeFormData) return null;

    // Create a deep copy of the form data
    const answeredForm = JSON.parse(JSON.stringify(activeFormData));

    // Helper function to recursively fill answers in questions
    const fillAnswersInQuestions = (questions) => {
      if (!Array.isArray(questions)) return;
      
      questions.forEach(question => {
        if (question.id && answers[question.id] !== undefined) {
          question.answer = answers[question.id];
        }
      });
    };

    // Fill answers in top-level questions
    if (answeredForm.questions) {
      fillAnswersInQuestions(answeredForm.questions);
    }

    // Fill answers in page-based questions
    if (answeredForm.pages) {
      answeredForm.pages.forEach(page => {
        if (page.questions) {
          fillAnswersInQuestions(page.questions);
        }
      });
    }

    return answeredForm;
  };

  const isLastPage = () => {
    const activeFormData = getActiveFormData();
    if (activeFormData?.pages) {
      return currentPage >= activeFormData.pages.length - 1;
    }
    return true;
  };

  const handleNext = () => {
    const activeFormData = getActiveFormData();
    if (activeFormData?.pages && currentPage < activeFormData.pages.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Your existing rendering logic remains the same!
  const currentQuestions = getCurrentQuestions();

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <Text variant="headlineSmall" style={styles.formTitle}>
              {activeFormData.formtitle}
            </Text>
            
            {activeFormData.formintro && (
              <Text variant="bodyMedium" style={styles.formIntro}>
                {activeFormData.formintro}
              </Text>
            )}

            {/* Page indicator for multi-page forms */}
            {activeFormData.pages && activeFormData.pages.length > 1 && (
              <Text variant="bodySmall" style={styles.pageIndicator}>
                Page {currentPage + 1} of {activeFormData.pages.length}
              </Text>
            )}

            {/* Render questions */}
            {currentQuestions.map((question, index) => 
              renderQuestion(question, index, currentQuestions)
            )}
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Navigation buttons */}
      <View style={styles.navigationContainer}>
        {currentPage > 0 && (
          <Button 
            mode="outlined" 
            onPress={handlePrevious}
            style={styles.navButton}
            icon="arrow-left"
          >
            Previous
          </Button>
        )}
        
        <Button 
          mode="contained" 
          onPress={handleNext}
          style={styles.navButton}
          icon={isLastPage() ? "check" : "arrow-right"}
          contentStyle={{ flexDirection: 'row-reverse' }}
        >
          {isLastPage() ? (activeFormData.submittext || 'Submit') : 'Next'}
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    marginTop: 16,
  },
  contentContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  card: {
    margin: 16,
    elevation: 4,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1976D2',
  },
  pageIndicator: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  navButton: {
    minWidth: 100,
  },
  questionContainer: {
    marginBottom: 20,
  },
  questionLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  questionGuidance: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  textInput: {
    marginBottom: 8,
  },
  radioGroupContainer: {
    marginTop: 8,
  },
  radioOptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#ffffff',
  },
  radioOptionSelected: {
    borderColor: '#1976D2',
    backgroundColor: '#f3f8ff',
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  radioLabel: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  radioLabelSelected: {
    color: '#1976D2',
    fontWeight: '500',
  },
  legendText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
});

export default DynamicQuestionnaireForm;