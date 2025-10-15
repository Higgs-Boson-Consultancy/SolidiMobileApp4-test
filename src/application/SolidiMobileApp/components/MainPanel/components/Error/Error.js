// React imports
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Text, StyleSheet, View, ScrollView } from 'react-native';

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
let logger2 = logger.extend('Error');
let {deb, dj, log, lj} = logger.getShortcuts(logger2);


/* Notes


*/




let Error = () => {

  let appState = useContext(AppStateContext);
  let [renderCount, triggerRender] = useState(0);
  let firstRender = misc.useFirstRender();
  let stateChangeID = appState.stateChangeID;

  let pageName = appState.pageName;
  let permittedPageNames = 'default'.split(' ');
  misc.confirmItemInArray('permittedPageNames', permittedPageNames, pageName, 'Error');


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
      let msg = `Error.setup: Error = ${err}`;
      console.log(msg);
    }
  }


  return (
    <View style={styles.panelContainer}>
    <View style={styles.panelSubContainer}>

      <View style={[styles.heading, styles.heading1]}>
        <Text style={styles.headingText}>Error</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={true} contentContainerStyle={{ flexGrow: 1 }} >

      <Text style={[styles.bold, styles.basicText]}>{'\n'}Unfortunately, an error has occurred.</Text>

      <View style={styles.infoSection}>

        <View style={styles.infoItem}>
          <Text style={[styles.basicText, styles.bold]}>{`\u2022  `} Domain: {appState.domain}</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={[styles.bold, styles.basicText]}>{`\u2022  `} Error details:</Text>
          <Text style={styles.basicText}>{appState.error.message}</Text>
        </View>

      </View>

      <View style={styles.infoSection}>
          <Text style={styles.basicText}>Please take a screenshot of this page in order to record the error message, and then:{'\n'}</Text>
          
          <View style={styles.buttonContainer}>
            <Button title="Return to Login"
              onPress={ async () => { 
                await appState.recoverFromErrorState();
              } }
              styles={styleRecoverButton}
            />
            
            <Button title="Contact Us"
              onPress={ () => { appState.changeState('ContactUs') } }
              styles={styleContactUsButton}
            />
          </View>
      </View>

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
  },
  headingText: {
    fontSize: normaliseFont(20),
    fontWeight: 'bold',
  },
  basicText: {
    fontSize: normaliseFont(14),
  },
  bold: {
    fontWeight: 'bold',
  },
  infoSection: {
    paddingTop: scaledHeight(20),
    alignItems: 'flex-start',
  },
  infoItem: {
    marginBottom: scaledHeight(5),
  },
  buttonContainer: {
    flexDirection: 'column',
    alignItems: 'stretch',
    width: '100%',
    marginTop: scaledHeight(10),
  },
});


let styleRecoverButton = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    marginBottom: scaledHeight(10),
    paddingVertical: scaledHeight(12),
  },
  text: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: normaliseFont(16),
    textAlign: 'center',
  },
});

let styleContactUsButton = StyleSheet.create({
  text: {
    margin: 0,
    padding: 0,
  },
});


export default Error;
