// React imports
import React, { useContext, useEffect, useRef, useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { 
  Text, 
  TextInput,
  Card, 
  Button as PaperButton, 
  HelperText,
  IconButton,
  useTheme 
} from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

// Other imports
import _ from 'lodash';
import Big from 'big.js';

// Internal imports
import AppStateContext from 'src/application/data';
import { colors, sharedColors, sharedStyles } from 'src/constants';
import { scaledWidth, scaledHeight, normaliseFont } from 'src/util/dimensions';
import { Button, StandardButton, ImageButton, Spinner } from 'src/components/atomic';
import { Title } from 'src/components/shared';
import misc from 'src/util/misc';

// Logger
import logger from 'src/util/logger';
let logger2 = logger.extend('BankAccounts');
let {deb, dj, log, lj} = logger.getShortcuts(logger2);


/* Notes


*/




let BankAccounts = () => {

  let appState = useContext(AppStateContext);
  const materialTheme = useTheme();
  let [renderCount, triggerRender] = useState(0);
  let stateChangeID = appState.stateChangeID;
  let [isLoading, setIsLoading] = useState(true);

  let pageName = appState.pageName;
  let permittedPageNames = 'default'.split(' ');
  misc.confirmItemInArray('permittedPageNames', permittedPageNames, pageName, 'BankAccounts');


  // For now, we're just handling GBP (not e.g. EUR).
  let accountAsset = 'GBP';
  let account1 = {};


  // Misc
  let [updateMessage, setUpdateMessage] = useState('');
  let [errorMessage, setErrorMessage] = useState('');


  // Bank Account state
  let [accountName, setAccountName] = useState('');
  let [sortCode, setSortCode] = useState('');
  let [accountNumber, setAccountNumber] = useState('');


  // Initial setup.
  useEffect( () => {
    setup();
  }, []); // Pass empty array so that this only runs once on mount.


  let setup = async () => {
    try {
      // Disabled API calls for design testing
      // await appState.generalSetup();
      // await appState.loadInitialStuffAboutUser();
      if (appState.stateChangeIDHasChanged(stateChangeID)) return;
      // account1 = appState.getDefaultAccountForAsset(accountAsset);
      // setAccountName(account1.accountName);
      // setSortCode(account1.sortCode);
      // setAccountNumber(account1.accountNumber);
      setUpdateMessage('');
      setIsLoading(false);
      triggerRender(renderCount+1);
    } catch(err) {
      let msg = `BankAccounts.setup: Error = ${err}`;
      console.log(msg);
    }
  }


  let updateBankAccountDetails = async () => {
    let params = {accountName, sortCode, accountNumber};
    setUpdateMessage('');
    let output = await appState.updateDefaultAccountForAsset('GBP', params);
    if (appState.stateChangeIDHasChanged(stateChangeID)) return;
    // Future: The error should be an object with 'code' and 'message' properties.
    if (_.has(output, 'error')) {
      setErrorMessage(misc.itemToString(output.error));
    } else if (output.result == 'success') {
      await misc.sleep(0.1);
      if (appState.stateChangeIDHasChanged(stateChangeID)) return;
      setUpdateMessage('Update successful');
      setErrorMessage('');
      await misc.sleep(0.2);
      if (appState.stateChangeIDHasChanged(stateChangeID)) return;
      // tmp
      if (_.isEmpty(accountName) || _.isEmpty(sortCode) || _.isEmpty(accountNumber)) {
        return;
      }
      // If the Sell journey page is stashed, return to it.
      if (! _.isEmpty(appState.stashedState) && appState.stashedState.mainPanelState == 'ChooseHowToReceivePayment') {
        return appState.loadStashedState();
      }
    }
  }


  return (
    <View style={{ flex: 1, backgroundColor: materialTheme.colors.background }}>

      <Title>
        Bank Account
      </Title>

      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16 }}
        keyboardShouldPersistTaps='handled'
        enableResetScrollToCoords={false}
      >

      { isLoading && <Spinner/> }

            { ! isLoading &&
        _.isEmpty(errorMessage) &&
        <Card style={{ 
          marginBottom: 16, 
          elevation: 2,
          backgroundColor: '#E3F2FD',
          borderLeftWidth: 4,
          borderLeftColor: materialTheme.colors.primary,
          borderRadius: 8
        }}>
          <Card.Content style={{ 
            padding: 16,
            flexDirection: 'row',
            alignItems: 'flex-start'
          }}>
            <IconButton 
              icon="information" 
              iconColor={materialTheme.colors.primary} 
              size={24}
              style={{ marginTop: -8, marginLeft: -8, marginRight: 8 }}
            />
            <View style={{ flex: 1 }}>
              <Text variant="titleSmall" style={{ 
                fontWeight: '600',
                color: materialTheme.colors.primary,
                marginBottom: 4
              }}>
                Bank Account Required
              </Text>
              <Text variant="bodyMedium" style={{ 
                color: '#1565C0',
                lineHeight: 20
              }}>
                Please enter your bank account details.
              </Text>
            </View>
          </Card.Content>
        </Card>
      }

      { ! isLoading && ! _.isEmpty(errorMessage) &&
        <HelperText type="error" visible={true} style={{ marginBottom: 16 }}>
          {errorMessage}
        </HelperText>
      }

      { ! isLoading &&
        <Card style={{ marginBottom: 16, elevation: 2 }}>
          <Card.Content style={{ padding: 20 }}>
            <Text variant="titleMedium" style={{ 
              marginBottom: 20, 
              fontWeight: '600',
              color: materialTheme.colors.primary 
            }}>
              Bank Account Details
            </Text>

            {/* Account Name */}
            <TextInput
              label="Account Name"
              mode="outlined"
              defaultValue={appState.getDefaultAccountForAsset(accountAsset).accountName}
              onChangeText={setAccountName}
              style={{ marginBottom: 16 }}
            />

            {/* Sort Code */}
            <TextInput
              label="Sort Code"
              mode="outlined"
              defaultValue={appState.getDefaultAccountForAsset(accountAsset).sortCode}
              onChangeText={setSortCode}
              placeholder="01-02-03"
              keyboardType="numbers-and-punctuation"
              style={{ marginBottom: 16 }}
            />

            {/* Account Number */}
            <TextInput
              label="Account Number"
              mode="outlined"
              defaultValue={appState.getDefaultAccountForAsset(accountAsset).accountNumber}
              onChangeText={setAccountNumber}
              placeholder="01230123"
              keyboardType="number-pad"
              style={{ marginBottom: 16 }}
            />

            {/* Currency (Read-only) */}
            <TextInput
              label="Currency"
              mode="outlined"
              value={appState.getAssetInfo(accountAsset).displayString}
              editable={false}
              style={{ marginBottom: 20 }}
            />

            {/* Update Button */}
            <PaperButton
              mode="contained"
              onPress={updateBankAccountDetails}
              style={{ marginBottom: 10 }}
              icon="content-save"
            >
              Update Details
            </PaperButton>

            {/* Update Message */}
            {updateMessage && (
              <HelperText type="info" visible={true}>
                {updateMessage}
              </HelperText>
            )}
          </Card.Content>
        </Card>
      }

      </KeyboardAwareScrollView>

    </View>
  )

}


let styles = StyleSheet.create({
  panelContainer: {
    paddingHorizontal: scaledWidth(15),
    paddingVertical: scaledHeight(5),
    width: '100%',
    height: '100%',
  },
  panelSubContainer: {
    paddingTop: scaledHeight(10),
    //paddingHorizontal: scaledWidth(30),
    height: '100%',
    //borderWidth: 1, // testing
  },
  heading: {
    alignItems: 'center',
  },
  heading1: {
    marginBottom: scaledHeight(40),
  },
  headingText: {
    fontSize: normaliseFont(20),
    fontWeight: 'bold',
  },
  bold: {
    fontWeight: 'bold',
  },
  initialMessage: {
    alignItems: 'center',
    marginBottom: scaledHeight(20),
    //borderWidth: 1, //testing
  },
  initialMessageText: {
    fontSize: normaliseFont(14),
    color: 'red',
  },
  bankAccount: {
    marginTop: scaledHeight(20),
    //borderWidth: 1, //testing
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
    minWidth: '45%', // Expands with length of detail name.
  },
  detailNameText: {
    fontSize: normaliseFont(14),
    fontWeight: 'bold',
  },
  detailValue: {
    //borderWidth: 1, // testing
    paddingLeft: scaledWidth(10),
    paddingVertical: scaledHeight(10),
    minWidth: '54%', // slightly reduced width so that right-hand border is not cut off.
  },
  detailValueText: {
    //borderWidth: 1, // testing
    fontSize: normaliseFont(14),
  },
  editableTextInput: {
    borderWidth: 1,
    borderRadius: 16,
    borderColor: colors.greyedOutIcon,
    fontSize: normaliseFont(14),
  },
  buttonWrapper: {
    marginTop: scaledHeight(20),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  updateMessage: {
    //borderWidth: 1, //testing
  },
  updateMessageText: {
    fontSize: normaliseFont(14),
    color: 'red',
  },
  errorMessage: {
    //borderWidth: 1, //testing
    paddingHorizontal: scaledHeight(15),
    paddingVertical: scaledHeight(15),
  },
  errorMessageText: {
    fontSize: normaliseFont(14),
    color: 'red',
  }
});


export default BankAccounts;
