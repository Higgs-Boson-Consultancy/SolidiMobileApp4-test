// React imports
import React, { useContext, useEffect, useState } from 'react';
import { Text, StyleSheet, View, ScrollView } from 'react-native';
import * as Progress from 'react-native-progress';
import { WebView } from 'react-native-webview';

// Other imports
import _ from 'lodash';
import Big from 'big.js';

// Internal imports
import AppStateContext from 'src/application/data';
import { colors } from 'src/constants';
import { scaledWidth, scaledHeight, normaliseFont } from 'src/util/dimensions';
import { Button, StandardButton, ImageButton, Spinner } from 'src/components/atomic';

// Logger
import logger from 'src/util/logger';
let logger2 = logger.extend('MakePaymentOpenBanking');
let {deb, dj, log, lj} = logger.getShortcuts(logger2);




let MakePaymentOpenBanking = () => {

  let appState = useContext(AppStateContext);
  let stateChangeID = appState.stateChangeID;

  let [url, setURL] = useState('');

  // Testing
  if (appState.appTier == 'dev' && appState.panels.buy.volumeQA == '0') {
    log("TESTING");
    // Note: Need to adjust the settlementID value to be the settlementID of an GBP settlement order in the database.
    //appState.changeStateParameters.settlementID = 8249;
    appState.changeStateParameters.settlementID = 8229;
  }


  // Load order details.
  let settlementID = appState.changeStateParameters.settlementID;


  // Set up timer that checks for payment settlement.
  /* Notes:
  - Check for "payment settled" status on the server every 2 seconds, 5 times. (10 seconds cumulative total time.)
  - Then check every 5 seconds, 10 times. (1 minute total time.)
  - Then every 30 seconds, 18 times. (10 minutes total time.)
  - Then every 1 minute, 20 times. (30 minutes total time.)
  */

  let timeElapsedSeconds = 0;
  let maxTimeAllowedSeconds = 30 * 60; // 30 minutes
  let count = 0;
  let intervalSeconds = 2;

  let incrementTimeElapsed = async () => {
    // Note: This function is a closure. It's holding the old values of several variables that (outside this function) get reset when the component is re-rendered.
    if (appState.stateChangeIDHasChanged(stateChangeID, 'MakePaymentOpenBanking')) {
      clearInterval(appState.panels.makePaymentOpenBanking.timerID);
      return;
    }
    count += 1;
    timeElapsedSeconds += intervalSeconds;
    log(`count: ${count}, intervalSeconds: ${intervalSeconds}, timeElapsedSeconds: ${timeElapsedSeconds}.`)
    // Calculate time remaining string.
    let timeRemainingSeconds = maxTimeAllowedSeconds - timeElapsedSeconds;
    let s = new Date(timeRemainingSeconds * 1000).toISOString().substring(11, 19);
    // Example s value: '00:29:59'
    log(`Time remaining: ${s}`);
    // Manage timer interval.
    let intervalSecondsOriginal = intervalSeconds;
    if (intervalSeconds == 2 && count >= 5) {
      count = 0;
      intervalSeconds = 5;
    }
    if (intervalSeconds == 5 && count >= 10) {
      count = 0;
      intervalSeconds = 30;
    }
    if (intervalSeconds == 30 && count >= 18) {
      count = 0;
      intervalSeconds = 60;
    }
    if (intervalSecondsOriginal != intervalSeconds) {
      // Clear current timer and create a new one.
      let msg = `Clear current timer (interval = ${intervalSecondsOriginal} seconds) and create a new one (interval = ${intervalSeconds} seconds).`;
      log(msg);
      clearInterval(appState.panels.makePaymentOpenBanking.timerID);
      let timerID = setInterval(incrementTimeElapsed, intervalSeconds * 1000);
      appState.panels.makePaymentOpenBanking.timerID = timerID;
    }
    if (timeElapsedSeconds >= maxTimeAllowedSeconds) {
      // Change to next state.
      clearInterval(appState.panels.makePaymentOpenBanking.timerID);
      appState.changeState('PaymentNotMade', 'openBankingPaymentNotReceived');
    }
    // Call the server to check if the payment has settled (i.e. arrived successfully at Tink).
    // If we're testing (we've loaded this page directly during development), stop here without checking.
    /*
    if (appState.appTier == 'dev' && appState.panels.buy.orderID == null) {
      return;
    }
    */
    await checkIfPaymentReceived();
  }




  // Initial setup.
  useEffect( () => {
    setup();
  }, []); // Pass empty array to only run once on mount.


  let setup = async () => {
    try {
      await appState.generalSetup();
      await checkIfPaymentReceived();
      let urlOpenBanking = await appState.getOpenBankingPaymentURLFromSettlement({settlementID});
      if (appState.stateChangeIDHasChanged(stateChangeID)) return;
      setURL(urlOpenBanking);
      // Set the initial timer.
      let timerID = setInterval(incrementTimeElapsed, intervalSeconds * 1000);
      appState.panels.makePaymentOpenBanking.timerID = timerID;
    } catch(err) {
      let msg = `MakePaymentOpenBanking.setup: Error = ${err}`;
      console.log(msg);
    }
  }


  let checkIfPaymentReceived = async () => {
    let paymentStatus = await appState.getOpenBankingPaymentStatusFromSettlement({settlementID});
    lj({paymentStatus})
    if (paymentStatus == "SETTLED") {
      clearInterval(appState.panels.makePaymentOpenBanking.timerID);
      appState.changeStateParameters.orderID = appState.panels.buy.orderID;
      appState.changeState('PurchaseSuccessful');
    } else if (paymentStatus == "CANCELLED") {
      clearInterval(appState.panels.makePaymentOpenBanking.timerID);
      appState.changeState('PaymentNotMade', 'openBankingPaymentNotReceived');
    }
  }


  return (
    <View style={styles.panelContainer}>
    <View style={styles.panelSubContainer}>

      <View style={[styles.heading, styles.heading1]}>
        <Text style={styles.headingText}>Pay by mobile banking app</Text>
      </View>

      <View style={styles.webviewSection}>

        { _.isEmpty(url) && <Spinner/> }

        { ! _.isEmpty(url) &&

          <WebView
            source={{ uri: url }}
            startInLoadingState={true}
            renderLoading={() =>
              <View style={styles.loadingView}>
                <Spinner/>
              </View>
            }
            onMessage={(event) => {
              let data = event.nativeEvent.data;
              log(`Have received event from embedded webview, containing data = '${data}'`);
            }}
          />

        }

      </View>

    </View>
    </View>
  )

}


let styles = StyleSheet.create({
  panelContainer: {
    //paddingHorizontal: scaledWidth(15),
    paddingHorizontal: scaledWidth(0),
    paddingVertical: scaledHeight(5),
    width: '100%',
    height: '100%',
  },
  panelSubContainer: {
    paddingTop: scaledHeight(10),
    //paddingHorizontal: scaledWidth(30),
    paddingHorizontal: scaledWidth(0),
    height: '100%',
    //borderWidth: 1, // testing
  },
  heading: {
    alignItems: 'center',
  },
  heading1: {
    marginTop: scaledHeight(10),
    //marginBottom: scaledHeight(40),
    marginBottom: scaledHeight(10),
  },
  headingText: {
    fontSize: normaliseFont(20),
    fontWeight: 'bold',
  },
  bold: {
    fontWeight: 'bold',
  },
  buttonWrapper: {
    marginTop: scaledHeight(10),
    //borderWidth: 1, // testing
  },
  webviewSection: {
    //borderWidth: 1, // testing
    height: scaledHeight(550),
    width: '100%',
  },
  loadingView: {
    height: '100%',
  },
});


export default MakePaymentOpenBanking;