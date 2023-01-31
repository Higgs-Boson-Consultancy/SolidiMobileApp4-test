// React imports
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Text, TextInput, StyleSheet, View, ScrollView } from 'react-native';
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
let logger2 = logger.extend('SolidiAccount');
let {deb, dj, log, lj} = logger.getShortcuts(logger2);


/* Notes


*/




let SolidiAccount = () => {

  let appState = useContext(AppStateContext);
  let [renderCount, triggerRender] = useState(0);
  let stateChangeID = appState.stateChangeID;
  let [isLoading, setIsLoading] = useState(true);

  let pageName = appState.pageName;
  let permittedPageNames = 'default'.split(' ');
  misc.confirmItemInArray('permittedPageNames', permittedPageNames, pageName, 'SolidiAccount');


  // Initial setup.
  useEffect( () => {
    setup();
  }, []); // Pass empty array so that this only runs once on mount.


  let setup = async () => {
    try {
      await appState.generalSetup();
      await appState.loadInitialStuffAboutUser();
      if (appState.stateChangeIDHasChanged(stateChangeID)) return;
      setIsLoading(false);
      triggerRender(renderCount+1);
    } catch(err) {
      let msg = `SolidiAccount.setup: Error = ${err}`;
      console.log(msg);
    }
  }


  return (
    <View style={styles.panelContainer}>
    <View style={styles.panelSubContainer}>

      <View style={[styles.heading, styles.heading1]}>
        <Text style={styles.headingText}>Solidi Account</Text>
      </View>

      <KeyboardAwareScrollView showsVerticalScrollIndicator={true} contentContainerStyle={{ flexGrow: 1 }} >


      <View style={styles.buttonWrapper}>
        <StandardButton title='Close Account'
          onPress={ () => { appState.changeState('CloseAccount') } }
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
    marginBottom: scaledHeight(40),
  },
  heading2: {
    marginTop: scaledHeight(20),
    marginBottom: scaledHeight(20),
  },
  headingText: {
    fontSize: normaliseFont(20),
    fontWeight: 'bold',
  },
  bold: {
    fontWeight: 'bold',
  },
  horizontalRule: {
    borderWidth: 1,
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    marginTop: scaledWidth(20),
    marginHorizontal: scaledWidth(20),
  },
  buttonWrapper: {
    marginTop: scaledHeight(20),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});


export default SolidiAccount;
