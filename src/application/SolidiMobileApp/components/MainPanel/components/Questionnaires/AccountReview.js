import React, { useContext, useState, useEffect } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, Alert } from 'react-native';
import AppStateContext from 'src/application/data';
import DynamicQuestionnaireForm from 'src/components/Questionnaire/DynamicQuestionnaireForm';

const AccountReview = ({ navigation }) => {
  const appState = useContext(AppStateContext);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form UUID for Self Categorisation
  const SELF_CATEGORISATION_UUID = '12312cc5-a949-49ed-977e-c81fecc2476f';

  // Load form data on component mount
  useEffect(() => {
    loadCategorisationForm();
  }, []);

  const loadCategorisationForm = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('=== AccountReview Component Debug ===');
      console.log('Loading form with UUID:', SELF_CATEGORISATION_UUID);
      console.log('Using complete hard-coded form data for testing');
      console.log('Form will have 3 pages: intro, investortype, complete');
      
      // Complete Self Categorisation form data with all pages
      const hardCodedFormData = {
        "formtitle": "Self Categorisation",
        "formintro": "",
        "formid": "customer-categorisation",
        "uuid": "12312cc5-a949-49ed-977e-c81fecc2476f",
        "js": "finprom-categorisation.js",
        "submittext": "Submit",
        "submiturl": "/submitquestions",
        "startpage": "intro",
        "pages": [
          {
            "pageid": "intro",
            "nextbutton": "Continue",
            "prevbutton": null,
            "nextpage": "investortype",
            "questions": [
              {
                "type": "legend",
                "id": "intro_text",
                "label": "The UK Financial Conduct Authority (FCA) requires that we ask you some additional questions to better understand your financial circumstances and serve you.\n\nThe FCA prescribes three investor categories. Most customers will fit into the Restricted Investor category - please don't let the name put you off - this category is sufficient for most customers.\n\nThe questions are about your current circumstances so you can disregard anything you have told us previously.\n\nThis categorisation is entirely self declared - Solidi will not be asking for proof / documentation of these statements.",
                "prepend-icon": "",
                "placeholder": "",
                "guidance": "",
                "answer": ""
              }
            ]
          },
          {
            "pageid": "investortype",
            "nextbutton": "Continue",
            "nextpage": "complete",
            "questions": [
              {
                "type": "legend",
                "id": "investor_title",
                "label": "Which type of investor are you?",
                "prepend-icon": "",
                "placeholder": "",
                "guidance": "Please choose the investor type which best describes you.",
                "answer": ""
              },
              {
                "type": "legend",
                "id": "investor_subtitle",
                "label": "The UK Financial Conduct Authority (FCA) divide investors into three categories. Please choose the investor type which best describes you.",
                "prepend-icon": "",
                "placeholder": "",
                "guidance": "",
                "answer": ""
              },
              {
                "type": "radio",
                "id": "investor_category",
                "label": "",
                "values": [
                  {
                    "id": "restricted",
                    "text": "Restricted investor - You've invested less than 10% of your net worth in high risk assets (such as Crypto) over the last 12 months, and you intend to limit such investments to less than 10% in the year ahead."
                  },
                  {
                    "id": "hnw",
                    "text": "High-Net-Worth investor - You've an annual income of at least £100,000 or assets of at least £250,000."
                  },
                  {
                    "id": "certified",
                    "text": "Certified-Sophisticated investor - You're received a certificate in the last three years from an authorised firm confirming that you understand the risks of crypto investing."
                  },
                  {
                    "id": "none",
                    "text": "None of the above - If none of the above apply then unfortunately the FCA will not allow us to provide you with an account."
                  }
                ],
                "answer": ""
              }
            ]
          },
          {
            "pageid": "complete",
            "nextbutton": "Submit Categorisation",
            "nextpage": null,
            "questions": [
              {
                "type": "legend",
                "id": "complete_title",
                "label": "Categorisation Complete",
                "prepend-icon": "",
                "placeholder": "",
                "guidance": "",
                "answer": ""
              },
              {
                "type": "legend",
                "id": "complete_text",
                "label": "Thank you for completing the self-categorisation questionnaire. Please review your selections and click Submit to finalize your investor categorisation.\n\nThis information helps us ensure we provide appropriate investment services in compliance with FCA regulations.",
                "prepend-icon": "",
                "placeholder": "",
                "guidance": "",
                "answer": ""
              },
              {
                "type": "textarea",
                "id": "additional_comments",
                "label": "Additional Comments (Optional)",
                "prepend-icon": "",
                "placeholder": "Any additional information you'd like to provide...",
                "guidance": "Please provide any additional comments or information that may be relevant to your investor categorisation.",
                "answer": ""
              }
            ]
          }
        ]
      };
      
      console.log('Hard-coded form data loaded successfully');
      console.log('Form pages:', hardCodedFormData.pages.length);
      console.log('Page IDs:', hardCodedFormData.pages.map(p => p.pageid));
      setFormData(hardCodedFormData);
      
    } catch (err) {
      console.error('Error loading categorisation form:', err);
      setError(err.message || 'Failed to load form');
      Alert.alert('Error', 'Failed to load categorisation form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (submissionData) => {
    console.log('Account Review Form Submitted:', submissionData);
    // Handle form submission - could save to appState, send to API, etc.
    // For now, just navigate back
    navigation.goBack();
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  // Show loading state
  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#1976D2" />
        <Text style={styles.loadingText}>Loading categorisation form...</Text>
      </View>
    );
  }

  // Show error state
  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <Text style={styles.retryText} onPress={loadCategorisationForm}>
          Tap to retry
        </Text>
      </View>
    );
  }

  // Show form if data is loaded
  if (formData) {
    return (
      <View style={styles.container}>
        <DynamicQuestionnaireForm
          formData={formData}
          onSubmit={handleFormSubmit}
          onBack={handleGoBack}
        />
      </View>
    );
  }

  // Fallback empty state
  return (
    <View style={[styles.container, styles.centerContent]}>
      <Text style={styles.errorText}>No form data available</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryText: {
    fontSize: 16,
    color: '#1976D2',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});

export default AccountReview;
