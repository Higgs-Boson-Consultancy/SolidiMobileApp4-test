// React imports
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Text, StyleSheet, View } from 'react-native';
//import { WebView } from 'react-native-webview';

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
let logger2 = logger.extend('Register');
let {deb, dj, log, lj} = logger.getShortcuts(logger2);


/* Notes

<WebView source={{ uri: 'https://reactnative.dev/' }} />

*/




let Register = () => {

  let appState = useContext(AppStateContext);
  let [renderCount, triggerRender] = useState(0);
  let firstRender = misc.useFirstRender();
  let stateChangeID = appState.stateChangeID;

  let pageName = appState.pageName;
  let permittedPageNames = 'default'.split(' ');
  misc.confirmItemInArray('permittedPageNames', permittedPageNames, pageName, 'Register');


  // Initial setup.
  useEffect( () => {
    //setup();
  }, []); // Pass empty array so that this only runs once on mount.


  let setup = async () => {
    try {
      //await appState.loadBalances();
      if (appState.stateChangeIDHasChanged(stateChangeID)) return;
      triggerRender(renderCount+1);
    } catch(err) {
      let msg = `Register.setup: Error = ${err}`;
      console.log(msg);
    }
  }


  return (
    <View style={styles.panelContainer}>
    <View style={styles.panelSubContainer}>

      <View style={[styles.heading, styles.heading1]}>
        <Text style={styles.headingText}>Register</Text>
      </View>

      <View style={styles.buttonWrapper}>
        <Button title="Already have an account? Click here."
          onPress={ () => { appState.changeState('Login') } }
        />
      </View>

      <View style={styles.webviewSection}>



      </View>

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
    marginTop: scaledHeight(0),
    //borderWidth: 1, // testing
  },
  webviewSection: {
    marginTop: scaledHeight(10),
    borderWidth: 1, // testing
  },
});


export default Register;
