// React imports
import React, { useContext, useEffect, useRef, useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

// Material Design imports
import {
  Card,
  Text,
  TextInput,
  Checkbox,
  Button,
  HelperText,
  useTheme,
  Portal,
  Modal,
  List,
} from 'react-native-paper';

// Other imports
import _ from 'lodash';
import Big from 'big.js';

// Internal imports
import AppStateContext from 'src/application/data';
import { colors } from 'src/constants';
import { scaledWidth, scaledHeight, normaliseFont } from 'src/util/dimensions';
import { StandardButton, FixedWidthButton, ImageButton, Spinner } from 'src/components/atomic';
import { Title } from 'src/components/shared';
import misc from 'src/util/misc';

// Logger
import logger from 'src/util/logger';
let logger2 = logger.extend('Register');
let {deb, dj, log, lj} = logger.getShortcuts(logger2);

// Shortcuts
let jd = JSON.stringify;


/* Notes

Need to use zIndex values carefully to ensure that the opened dropdown appears above the rest of the data.

*/




let Register = () => {

  let appState = useContext(AppStateContext);
  let [renderCount, triggerRender] = useState(0);
  let firstRender = misc.useFirstRender();
  let stateChangeID = appState.stateChangeID;

  let pageName = appState.pageName;
  let permittedPageNames = 'default'.split(' ');
  misc.confirmItemInArray('permittedPageNames', permittedPageNames, pageName, 'Register');


  /* Notes:
  - TextInput components do not re-render if their value is changed later, so we need to declare their initial values here at the beginning.
  - We directly save the data into and load it from the AppState provider in case the user reads the Terms & Conditions page.
  */


  // We preserve user-entered data only in the case where the user has left this page in order to read the Terms & Conditions page.
  let previousState = appState.previousState;
  let registerData = appState.blankRegisterData;
  if (previousState.mainPanelState === 'ReadArticle') {
    registerData = appState.registerData;
  }
  if (appState.preserveRegistrationData) {
    // This is for use during development. Saves having to re-enter the data every time.
    registerData = appState.registerData;
  }

  // Basic
  let [userData, setUserData] = useState({
    ...registerData,
    emailPreferences: registerData.emailPreferences || {
      systemAnnouncements: true,
      newsAndFeatureUpdates: true,
      promotionsAndSpecialOffers: true,
    }
  });
  let [isLoading, setIsLoading] = useState(true);
  let [errorDisplay, setErrorDisplay] = useState({});
  let [uploadMessage, setUploadMessage] = useState('');
  let [passwordVisible, setPasswordVisible] = useState(false);
  let [disableRegisterButton, setDisableRegisterButton] = useState(false);

  // Gender dropdown
  let [gender, setGender] = useState(registerData.gender || '');
  let generateGenderOptionsList = () => {
    return ['Male', 'Female', 'Other'].map(x => ({label: x, value: x}));
  }
  let [genderOptionsList, setGenderOptionsList] = useState(generateGenderOptionsList());
  let [openGender, setOpenGender] = useState(false);
  let [genderModalVisible, setGenderModalVisible] = useState(false);

  // Citizenship dropdown
  let [citizenship, setCitizenship] = useState(registerData.citizenship || '');
  let [citizenshipModalVisible, setCitizenshipModalVisible] = useState(false);
  let generateCitizenshipOptionsList = () => {
    return [
      {label: 'United Kingdom', value: 'GB'},
      {label: 'United States', value: 'US'},
      {label: 'Canada', value: 'CA'},
      {label: 'Australia', value: 'AU'},
      {label: 'Germany', value: 'DE'},
      {label: 'France', value: 'FR'},
      {label: 'Spain', value: 'ES'},
      {label: 'Italy', value: 'IT'},
      {label: 'Netherlands', value: 'NL'},
    ];
  }
  let [citizenshipOptionsList, setCitizenshipOptionsList] = useState(generateCitizenshipOptionsList());
  let [openCitizenship, setOpenCitizenship] = useState(false);

  // More
  let scrollRefTop = useRef();

  // Initial setup.
  useEffect( () => {
    setup();
  }, []); // Pass empty array so that this only runs once on mount.


  let setup = async () => {
    try {
      // Disabled API calls for design testing
      // await appState.generalSetup({caller: 'Register'});
      // await appState.loadPersonalDetailOptions();
      // await appState.loadCountries();
      if (appState.stateChangeIDHasChanged(stateChangeID)) return;
      setGenderOptionsList(generateGenderOptionsList());
      setCitizenshipOptionsList(generateCitizenshipOptionsList());
      setIsLoading(false);
      //triggerRender(renderCount+1);
    } catch(err) {
      let msg = `Register.setup: Error = ${err}`;
      console.log(msg);
    }
  }


  let submitRegisterRequest = async () => {
    /*
    When the new user clicks "Register":
    - We send the bundle of userData to the server.
    - If the request is successful, this means that a new user account has been created. We then move through the confirmation journey (for email, mobile phone number, and address).
    - If unsuccessful, we update the error display on this particular page, rather than moving to an error page. That's why this function is here instead of in AppState.js.
    */
    setDisableRegisterButton(true);
    // Reset any existing error messages.
    setErrorDisplay({});
    let result;


    // test data:
    /*
    userData = {
      email: 'johnqfish@foo.com',
      password: 'bigFish6',
      firstName: 'John',
      lastName: 'Fish',
      gender: 'Male',
      dateOfBirth: '01/12/1990',
      citizenship: 'GB',
      //mobileNumber: '+34698934194',
      mobileNumber: '07834123123',
      emailPreferences: {
        'newsAndFeatureUpdates': true,
        'promotionsAndSpecialOffers': true
      },
    };
    setUserData(userData);
    setGender('Male')
    setCitizenship('GB');
    */


    let email = userData.email;
    let apiRoute = 'register_new_user';
    apiRoute += '/' + email;
    try {
      log(`API request: Register new user: userData = ${jd(userData)}.`);
      setUploadMessage('Registering your details...');
      // Send the request.
      let functionName = 'submitRegisterRequest';
      // Restructure emailPreferences into a list for transmission.
      let userData2 = {...userData};
      userData2.emailPreferences = _.keys(_.pick(userData2.emailPreferences, _.identity));
      let params = {userData: userData2};
      result = await appState.publicMethod({functionName, apiRoute, params});
      if (appState.stateChangeIDHasChanged(stateChangeID)) return;
    } catch(err) {
      logger.error(err);
    }
    //lj({result});
    if (result === 'DisplayedError') return;
    // Future: The error should be an object with 'code' and 'message' properties.
    if (_.has(result, 'error')) {
      let error = result.error;
      log(`Error returned from API request ${apiRoute}: ${jd(error)}`);
      if (_.isObject(error)) {
        if (_.isEmpty(error)) {
          error = 'Received an empty error object ({}) from the server.'
        } else {
          error = jd(error);
        }
      }
      let detailNameError = 'unknown';
      let errorMessage = error;
      let detailNames = `
unknown
firstName
lastName
email
password
dateOfBirth
mobileNumber
gender
citizenship
emailPreferences
      `
      detailNames = misc.splitStringIntoArray({s: detailNames});
      for (let detailName of detailNames) {
        let selector = `ValidationError: [${detailName}]: `;
        //log(error.startsWith(selector))
        if (error.startsWith(selector)) {
          detailNameError = detailName;
          errorMessage = error.replace(selector, '');
        }
      }
      // If error is a string, display the error message above the specific setting.
      setErrorDisplay({...errorDisplay, [detailNameError]: errorMessage});
      setUploadMessage('');
      setDisableRegisterButton(false);
      // Scroll to top.
     scrollRefTop.current.scrollToPosition(0);
    } else { // No errors.
      // Save some of the userData for use in RegisterConfirm.
      appState.registerConfirmData = {
        email: userData.email,
        password: userData.password,
      };
      // Delete the temporarily stored registerData from the appState.
      appState.registerData = appState.blankRegisterData;
      // Move to next page.
      appState.changeState('RegisterConfirm', 'confirm_email');
    }
  }


  let renderError = (detail) => {
    // We render an error above a detail, if an error has been set for it.
    // Example detail: 'address_1'
    if (_.isNil(errorDisplay[detail])) return;
    return (
      <View style={styles.errorDisplay}>
        <Text style={styles.errorDisplayText}>Error: {detail}: {errorDisplay[detail]}</Text>
      </View>
    )
  }


  let getPasswordButtonTitle = () => {
    let title = passwordVisible ? 'Hide password' : 'Show password';
    return title;
  }




  const materialTheme = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: materialTheme.colors.background }}>
      
      <Title>
        Create Account
      </Title>

      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ 
          padding: 16,
          backgroundColor: materialTheme.colors.background
        }}
        keyboardShouldPersistTaps='handled'
        ref={scrollRefTop}
      >

        { isLoading && <Spinner/> }

        { ! isLoading &&
          <Card style={{ 
            marginHorizontal: 16,
            marginBottom: 24,
            elevation: 3
          }}>
            <Card.Content style={{ padding: 20 }}>
              <Text variant="titleMedium" style={{ 
                marginBottom: 20, 
                color: materialTheme.colors.primary,
                textAlign: 'center',
                fontWeight: '600'
              }}>
                📝 Create Your Account
              </Text>

              {/* Email Field */}
              <TextInput
                mode="outlined"
                label="Email Address"
                value={userData.email}
                onChangeText={(value) => setUserData({...userData, email: value})}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                style={{ marginBottom: 16 }}
                left={<TextInput.Icon icon="email" />}
              />

              {/* Password Field */}
              <TextInput
                mode="outlined"
                label="Password"
                value={userData.password}
                onChangeText={(value) => setUserData({...userData, password: value})}
                secureTextEntry={!passwordVisible}
                autoCapitalize="none"
                style={{ marginBottom: 16 }}
                left={<TextInput.Icon icon="lock" />}
                right={
                  <TextInput.Icon
                    icon={passwordVisible ? "eye-off" : "eye"}
                    onPress={() => setPasswordVisible(!passwordVisible)}
                  />
                }
              />

              {/* First Name Field */}
              <TextInput
                mode="outlined"
                label="First Name"
                value={userData.firstName}
                onChangeText={(value) => setUserData({...userData, firstName: value})}
                autoCapitalize="words"
                autoCorrect={false}
                style={{ marginBottom: 16 }}
                left={<TextInput.Icon icon="account" />}
              />

              {/* Last Name Field */}
              <TextInput
                mode="outlined"
                label="Last Name"
                value={userData.lastName}
                onChangeText={(value) => setUserData({...userData, lastName: value})}
                autoCapitalize="words"
                autoCorrect={false}
                style={{ marginBottom: 16 }}
                left={<TextInput.Icon icon="account" />}
              />

              {/* Date of Birth Field */}
              <TextInput
                mode="outlined"
                label="Date of Birth (DD/MM/YYYY)"
                value={userData.dateOfBirth}
                onChangeText={(value) => setUserData({...userData, dateOfBirth: value})}
                placeholder="01/01/1990"
                style={{ marginBottom: 16 }}
                left={<TextInput.Icon icon="calendar" />}
              />

              {/* Mobile Number Field */}
              <TextInput
                mode="outlined"
                label="Mobile Number"
                value={userData.mobileNumber}
                onChangeText={(value) => setUserData({...userData, mobileNumber: value})}
                keyboardType="phone-pad"
                style={{ marginBottom: 16 }}
                left={<TextInput.Icon icon="phone" />}
              />

              {/* Gender Field */}
              <TouchableOpacity onPress={() => setGenderModalVisible(true)}>
                <TextInput
                  mode="outlined"
                  label="Gender"
                  value={gender}
                  editable={false}
                  style={{ marginBottom: 16 }}
                  left={<TextInput.Icon icon="human-male-female" />}
                  right={<TextInput.Icon icon="chevron-down" />}
                />
              </TouchableOpacity>

              {/* Citizenship Field */}
              <TouchableOpacity onPress={() => setCitizenshipModalVisible(true)}>
                <TextInput
                  mode="outlined"
                  label="Country of Citizenship"
                  value={citizenshipOptionsList.find(c => c.value === citizenship)?.label || citizenship}
                  editable={false}
                  style={{ marginBottom: 16 }}
                  left={<TextInput.Icon icon="earth" />}
                  right={<TextInput.Icon icon="chevron-down" />}
                />
              </TouchableOpacity>

              {/* Email Preferences Section */}
              <Text variant="titleSmall" style={{ 
                marginBottom: 12, 
                marginTop: 8,
                color: materialTheme.colors.primary,
                fontWeight: '600'
              }}>
                Email Preferences
              </Text>

              <View style={{ marginBottom: 20 }}>
                <Checkbox.Item
                  label="System Announcements"
                  status={userData.emailPreferences?.systemAnnouncements ? 'checked' : 'unchecked'}
                  onPress={() => {
                    const newValue = !userData.emailPreferences?.systemAnnouncements;
                    setUserData({
                      ...userData, 
                      emailPreferences: {
                        ...userData.emailPreferences,
                        systemAnnouncements: newValue
                      }
                    });
                  }}
                  style={{ paddingLeft: 0 }}
                />

                <Checkbox.Item
                  label="News & Feature Updates"
                  status={userData.emailPreferences?.newsAndFeatureUpdates ? 'checked' : 'unchecked'}
                  onPress={() => {
                    const newValue = !userData.emailPreferences?.newsAndFeatureUpdates;
                    setUserData({
                      ...userData, 
                      emailPreferences: {
                        ...userData.emailPreferences,
                        newsAndFeatureUpdates: newValue
                      }
                    });
                  }}
                  style={{ paddingLeft: 0 }}
                />

                <Checkbox.Item
                  label="Promotions & Special Offers"
                  status={userData.emailPreferences?.promotionsAndSpecialOffers ? 'checked' : 'unchecked'}
                  onPress={() => {
                    const newValue = !userData.emailPreferences?.promotionsAndSpecialOffers;
                    setUserData({
                      ...userData, 
                      emailPreferences: {
                        ...userData.emailPreferences,
                        promotionsAndSpecialOffers: newValue
                      }
                    });
                  }}
                  style={{ paddingLeft: 0 }}
                />
              </View>

              {/* Terms & Conditions */}
              <Text variant="bodySmall" style={{ 
                marginBottom: 16,
                textAlign: 'center',
                color: materialTheme.colors.onSurfaceVariant,
                lineHeight: 18
              }}>
                By clicking Create Account, you agree to our{' '}
                <Text 
                  style={{ color: materialTheme.colors.primary, textDecorationLine: 'underline' }}
                  onPress={() => {
                    // Store the userData so that this page can retrieve it when we return from the ReadArticle page.
                    appState.registerData = userData;
                    appState.changeState('ReadArticle', 'terms_and_conditions');
                  }}
                >
                  Terms & Conditions
                </Text>
              </Text>

              {/* Register Button */}
              <Button
                mode="contained"
                onPress={submitRegisterRequest}
                disabled={disableRegisterButton}
                style={{ marginBottom: 16, paddingVertical: 4 }}
                labelStyle={{ fontSize: 16, fontWeight: '600' }}
                icon="account-plus"
              >
                Create Account
              </Button>

              {/* Upload Message */}
              {uploadMessage && (
                <HelperText type="info">
                  {uploadMessage}
                </HelperText>
              )}
            </Card.Content>
          </Card>
        }

        {/* Login Link */}
        <Card style={{ 
          marginHorizontal: 16,
          elevation: 2
        }}>
          <Card.Content style={{ padding: 20 }}>
            <Text variant="bodyMedium" style={{ 
              textAlign: 'center',
              color: materialTheme.colors.onSurfaceVariant,
              marginBottom: 12
            }}>
              Already have an account?
            </Text>
            <Button
              mode="outlined"
              onPress={() => appState.changeState('Login')}
              style={{ alignSelf: 'center' }}
              icon="login"
            >
              Sign In
            </Button>
          </Card.Content>
        </Card>

        <View style={{ height: 32 }} />


          <View style={styles.termsSection}>
            <Text style={styles.termsSectionText}>By clicking Register, you agree to our </Text>
            <Button title="Terms & Conditions"
              onPress={ () => {
                // Store the userData so that this page can retrieve it when we return from the ReadArticle page.
                appState.registerData = userData;
                log(`Have stored userData to appState: ${jd(userData)}`);
                appState.changeState('ReadArticle', 'terms_and_conditions');
              }}
              styles={styleTextButton}/>
          </View>

          <View style={styles.registerButtonWrapper}>
            <FixedWidthButton title="Register"
              onPress={ submitRegisterRequest }
              disabled={disableRegisterButton}
            />
            <View style={styles.uploadMessage}>
              <Text style={styles.uploadMessageText}>{uploadMessage}</Text>
            </View>
          </View>


      </KeyboardAwareScrollView>

      {/* Gender Modal */}
      <Portal>
        <Modal 
          visible={genderModalVisible} 
          onDismiss={() => setGenderModalVisible(false)}
          contentContainerStyle={{ 
            backgroundColor: materialTheme.colors.surface,
            margin: 20,
            borderRadius: 8,
            padding: 20
          }}
        >
          <Text variant="titleMedium" style={{ marginBottom: 16 }}>Select Gender</Text>
          {genderOptionsList.map((option) => (
            <List.Item
              key={option.value}
              title={option.label}
              onPress={() => {
                setGender(option.value);
                setUserData({...userData, gender: option.value});
                setGenderModalVisible(false);
              }}
            />
          ))}
        </Modal>
      </Portal>

      {/* Citizenship Modal */}
      <Portal>
        <Modal 
          visible={citizenshipModalVisible} 
          onDismiss={() => setCitizenshipModalVisible(false)}
          contentContainerStyle={{ 
            backgroundColor: materialTheme.colors.surface,
            margin: 20,
            borderRadius: 8,
            padding: 20,
            maxHeight: '80%'
          }}
        >
          <Text variant="titleMedium" style={{ marginBottom: 16 }}>Select Country</Text>
          <ScrollView>
            {citizenshipOptionsList.map((option) => (
              <List.Item
                key={option.value}
                title={option.label}
                onPress={() => {
                  setCitizenship(option.value);
                  setUserData({...userData, citizenship: option.value});
                  setCitizenshipModalVisible(false);
                }}
              />
            ))}
          </ScrollView>
        </Modal>
      </Portal>

    </View>
  );

}


let styles = StyleSheet.create({
  panelContainer: {
    paddingHorizontal: scaledWidth(0),
    paddingVertical: scaledHeight(5),
    width: '100%',
    height: '100%',
  },
  panelSubContainer: {
    paddingTop: scaledHeight(10),
    //paddingHorizontal: scaledWidth(30),
    //paddingHorizontal: scaledWidth(0),
    height: '100%',
    //borderWidth: 1, // testing
  },
  scrollView: {
    //borderWidth: 1, // testing
    height: '94%',
  },
  heading: {
    alignItems: 'center',
  },
  heading1: {
    //marginTop: scaledHeight(10),
    //marginBottom: scaledHeight(40),
    //marginBottom: scaledHeight(10),
  },
  headingText: {
    fontSize: normaliseFont(20),
    fontWeight: 'bold',
  },
  scrollDownMessage: {
    marginVertical: scaledHeight(10),
    alignItems: 'center',
  },
  scrollDownMessageText: {
    fontSize: normaliseFont(16),
    //fontWeight: 'bold',
    color: 'red',
  },
  basicText: {
    fontSize: normaliseFont(14),
  },
  bold: {
    fontWeight: 'bold',
  },
  red: {
    color: 'red',
  },
  sectionHeading: {
    marginTop: scaledHeight(20),
    marginBottom: scaledHeight(20),
  },
  sectionHeadingText: {
    fontSize: normaliseFont(16),
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  detail: {
    //borderWidth: 1, // testing
    marginBottom: scaledHeight(10),
    flexDirection: 'row',
    flexWrap: 'wrap', // Allows long detail value to move onto the next line.
    alignItems: 'center',
  },
  detailName: {
    paddingRight: scaledWidth(10),
    paddingVertical: scaledHeight(10),
    //borderWidth: 1, // testing
    minWidth: '40%', // Expands with length of detail name.
  },
  detailNameText: {
    fontSize: normaliseFont(14),
    fontWeight: 'bold',
  },
  detailValue: {
    paddingLeft: scaledWidth(10),
    paddingVertical: scaledHeight(10),
    minWidth: '59%', // slightly reduced in width so that the right-hand border is never cut off.
    //borderWidth: 1, // testing
  },
  detailValueFullWidth: {
    paddingLeft: scaledWidth(10),
    paddingVertical: scaledHeight(10),
    minWidth: '99%',
  },
  detailValueText: {
    fontSize: normaliseFont(14),
    //borderWidth: 1, // testing
  },
  editableTextInput: {
    borderWidth: 1,
    borderRadius: 16,
    borderColor: colors.greyedOutIcon,
    fontSize: normaliseFont(14),
  },
  dropdownWrapper: {

  },
  detailDropdown: {
    borderWidth: 1,
    maxWidth: '100%',
    height: scaledHeight(40),
  },
  detailDropdownText: {
    fontSize: normaliseFont(14),
  },
  horizontalRule: {
    borderWidth: 1,
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    marginTop: scaledWidth(20),
    marginHorizontal: scaledWidth(20),
  },
  buttonWrapper: {
    marginTop: scaledHeight(10),
    //borderWidth: 1, // testing
  },
  alignRight: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  errorDisplay: {
    paddingHorizontal: scaledHeight(15),
    paddingVertical: scaledHeight(15),
  },
  errorDisplayText: {
    fontSize: normaliseFont(14),
    color: 'red',
  },
  termsSection: {
    // This large margin adds some space between the end of the citizenship dropdown and the Register button.
    marginTop: scaledHeight(45),
    width: '100%',
    //flexDirection: 'row',
    //justifyContent: 'flex-start',
  },
  termsSectionText: {
    fontSize: normaliseFont(14),
    marginBottom: scaledHeight(5),
  },
  registerButtonWrapper: {
    marginVertical: scaledHeight(40),
  },
  uploadMessage: {
    //borderWidth: 1, //testing
    marginTop: scaledHeight(20),
    paddingRight: scaledWidth(10),
  },
  uploadMessageText: {
    fontSize: normaliseFont(14),
    color: 'red',
  },
  checkboxWrapper: {
    //borderWidth: 1, //testing
    minWidth: '100%',
    marginBottom: scaledHeight(10),
  },
});


let styleTextButton = StyleSheet.create({
  text: {
    margin: 0,
    padding: 0,
    fontSize: normaliseFont(14),
  },
});


let styleCheckbox = StyleSheet.create({
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  borderWidth: 1,
  borderRadius: scaledWidth(10),
  paddingVertical: scaledHeight(0),
})


export default Register;
