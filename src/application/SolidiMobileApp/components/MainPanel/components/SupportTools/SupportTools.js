// React imports
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Text, TextInput, StyleSheet, View, ScrollView } from 'react-native';

// Other imports
import _ from 'lodash';
import Big from 'big.js';

// Internal imports
import AppStateContext from 'src/application/data';
import { colors } from 'src/constants';
import { scaledWidth, scaledHeight, normaliseFont } from 'src/util/dimensions';
import { Button, StandardButton, ImageButton, Spinner } from 'src/components/atomic';
import misc from 'src/util/misc';

// Logger
import logger from 'src/util/logger';
let logger2 = logger.extend('SupportTools');
let {deb, dj, log, lj} = logger.getShortcuts(logger2);


/* Notes

Here, we have buttons to provide access to any tool that is:
- rarely used
- complex / advanced
- experimental

*/




let SupportTools = () => {

  let appState = useContext(AppStateContext);
  let [renderCount, triggerRender] = useState(0);
  let firstRender = misc.useFirstRender();
  let stateChangeID = appState.stateChangeID;

  let pageName = appState.pageName;
  let permittedPageNames = 'default'.split(' ');
  misc.confirmItemInArray('permittedPageNames', permittedPageNames, pageName, 'SupportTools');

  let [userID, setUserID] = useState('');
  let [loggingIn, setLoggingIn] = useState(false);


  // Initial setup.
  useEffect( () => {
    setup();
  }, []); // Pass empty array so that this only runs once on mount.


  let setup = async () => {
    try {
      await appState.generalSetup();
      if (appState.stateChangeIDHasChanged(stateChangeID)) return;
      triggerRender(renderCount+1);
    } catch(err) {
      let msg = `SupportTools.setup: Error = ${err}`;
      console.log(msg);
    }
  }


  let callLoginAsDifferentUser = async ({userID}) => {
    setLoggingIn(true);
    await appState.loginAsDifferentUser({userID});
    if (appState.stateChangeIDHasChanged(stateChangeID)) return;
  }


  return (
    <View style={styles.panelContainer}>
    <View style={styles.panelSubContainer}>

      <View style={[styles.heading, styles.heading1]}>
        <Text style={styles.headingText}>Support Tools</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={true} contentContainerStyle={{ flexGrow: 1 }} >

      <View style={styles.infoSection}>

        <View style={styles.infoItem}>
          <Text style={[styles.basicText, styles.bold]}>{`\u2022  `} Connected to: {appState.domain}</Text>
        </View>

      </View>

      <View style={styles.buttonWrapper}>
        <StandardButton title='Register without auto-login'
          onPress={ () => { appState.changeState('Register', 'nonAuto'); } }
        />
      </View>

      <View style={styles.buttonWrapper}>
        <StandardButton title='Delete all local data and log out'
          onPress={ async () => {
            // Delete the PIN (from both the app memory and from the Keychain).
            await appState.deletePIN(deleteFromKeychain=true);
            // Log out: This will delete everything else.
            await appState.logout();
          } }
        />
      </View>

      {appState.getUserStatus('supportLevel2') === '[loading]' &&
        <Spinner/>
      }

      {appState.getUserStatus('supportLevel2') === true &&
        <View style={styles.buttonWrapper}>
          <StandardButton title='Log in with different userID'
            onPress={ async () => { await callLoginAsDifferentUser({userID}); } }
          />
        </View>
      }

      {appState.getUserStatus('supportLevel2') === true &&
        <View style={styles.fullWidthLabelledInputWrapper}>
          <View style={styles.inputLabel}>
            <Text style={styles.inputLabelText}>UserID:</Text>
          </View>
          <View style={styles.halfWidthTextInputWrapper}>
            <TextInput
              style={styles.halfWidthTextInput}
              onChangeText={setUserID}
              value={userID}
              placeholder={'2'}
              placeholderTextColor={colors.placeHolderTextColor}
              autoCorrect={false}
              keyboardType='number-pad'
            />
          </View>
        </View>
      }

      { loggingIn &&
        <View style={styles.loginMessageDisplay}>
          <Text style={styles.loginMessageDisplayText}>Logging in...</Text>
        </View>
      }

      </ScrollView>

    </View>
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
    paddingHorizontal: scaledWidth(30),
    height: '100%',
    //borderWidth: 1, // testing
  },
  heading: {
    alignItems: 'center',
  },
  heading1: {
    marginTop: scaledHeight(10),
    marginBottom: scaledHeight(40),
  },
  headingText: {
    fontSize: normaliseFont(20),
    fontWeight: 'bold',
  },
  bold: {
    fontWeight: 'bold',
  },
  buttonWrapper: {
    marginVertical: scaledHeight(10),
    width: '100%',
  },
  infoSection: {
    paddingTop: scaledHeight(20),
    alignItems: 'flex-start',
  },
  infoItem: {
    marginBottom: scaledHeight(5),
  },
  fullWidthLabelledInputWrapper: {
    //borderWidth: 1, // testing
    marginTop: scaledHeight(10),
    width: '99%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    //justifyContent: 'space-between',
  },
  inputLabel: {
    //borderWidth: 1, // testing
    justifyContent: 'center',
    paddingRight: scaledWidth(20),
  },
  inputLabelText: {
    //fontWeight: 'bold',
    fontSize: normaliseFont(14),
  },
  halfWidthTextInputWrapper: {
    //borderWidth: 1, // testing
    width: '50%',
  },
  halfWidthTextInput: {
    fontSize: normaliseFont(14),
    height: scaledHeight(40),
    width: '100%',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: scaledWidth(10),
    flexDirection: "row",
  },
  loginMessageDisplay: {
    paddingHorizontal: scaledHeight(15),
    paddingVertical: scaledHeight(15),
  },
  loginMessageDisplayText: {
    fontSize: normaliseFont(14),
    color: 'red',
  }
});


export default SupportTools;
