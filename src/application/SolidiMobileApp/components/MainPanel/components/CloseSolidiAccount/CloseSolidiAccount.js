// React imports
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Image, Text, TextInput, StyleSheet, View, ScrollView } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

// Other imports
import _ from 'lodash';
import Big from 'big.js';

// Internal imports
import AppStateContext from 'src/application/data';
import { mainPanelStates, colors } from 'src/constants';
import { scaledWidth, scaledHeight, normaliseFont } from 'src/util/dimensions';
import { Button, StandardButton, ImageButton, Spinner } from 'src/components/atomic';
import misc from 'src/util/misc';

// Logger
import logger from 'src/util/logger';
let logger2 = logger.extend('CloseSolidiAccount');
let {deb, dj, log, lj} = logger.getShortcuts(logger2);


/* Notes


*/




let CloseSolidiAccount = () => {

  let appState = useContext(AppStateContext);
  let [renderCount, triggerRender] = useState(0);
  let firstRender = misc.useFirstRender();
  let stateChangeID = appState.stateChangeID;

  let pageName = appState.pageName;
  let permittedPageNames = 'default'.split(' ');
  misc.confirmItemInArray('permittedPageNames', permittedPageNames, pageName, 'CloseSolidiAccount');

  // More state
  let [errorMessage, setErrorMessage] = useState('');


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
      let msg = `CloseSolidiAccount.setup: Error = ${err}`;
      console.log(msg);
    }
  }


  return (
    <View style={styles.panelContainer}>
    <View style={styles.panelSubContainer}>

      <View style={[styles.heading, styles.heading1]}>
        <Text style={styles.headingText}>Close Solidi Account</Text>
      </View>

      {!! errorMessage &&
        <View style={styles.errorWrapper}>
          <Text style={styles.errorMessageText}>{errorMessage}</Text>
        </View>
      }

      <KeyboardAwareScrollView showsVerticalScrollIndicator={true} contentContainerStyle={{ flexGrow: 1 }} >

      <View style={styles.question}>
      <Text style={[styles.basicText, styles.bold]}>Are you sure that you want to close your account?</Text>
      </View>

      <View style={styles.buttonWrapper}>
        <StandardButton title='Close my Solidi account'
          onPress={ () => { appState.closeSolidiAccount() } }
          styles={styleCloseAccountButton}
        />
      </View>

      </KeyboardAwareScrollView>

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
    //paddingHorizontal: scaledWidth(30),
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
  question: {
    marginBottom: scaledHeight(40),
  },
  basicText: {
    fontSize: normaliseFont(14),
  },
  mediumText: {
    fontSize: normaliseFont(16),
  },
  bold: {
    fontWeight: 'bold',
  },
  errorWrapper: {
    //marginTop: scaledHeight(20),
    marginBottom: scaledHeight(20),
  },
  errorMessageText: {
    fontSize: normaliseFont(14),
    color: 'red',
  },
});


let styleCloseAccountButton = StyleSheet.create({
  view: {
    backgroundColor: 'red',
  },
});


export default CloseSolidiAccount;
