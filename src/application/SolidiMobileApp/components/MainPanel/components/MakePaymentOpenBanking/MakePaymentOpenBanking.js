// React imports
import React, { useContext, useEffect, useState } from 'react';
import { Text, StyleSheet, View, ScrollView } from 'react-native';
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
  let [error, setError] = useState(null);
  let [isLoading, setIsLoading] = useState(true);

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
      setIsLoading(true);
      setError(null);
      
      await appState.generalSetup();
      await checkIfPaymentReceived();
      
      let urlOpenBanking = await appState.getOpenBankingPaymentURLFromSettlement({settlementID});
      
      if (appState.stateChangeIDHasChanged(stateChangeID)) return;
      
      // Check if the response is an error
      if (!urlOpenBanking) {
        throw new Error('No payment URL received from server');
      }
      
      // Check if response is an error object
      if (typeof urlOpenBanking === 'object' && urlOpenBanking.error) {
        throw new Error(urlOpenBanking.error);
      }
      
      // Check if the URL is valid
      if (typeof urlOpenBanking !== 'string' || !urlOpenBanking.startsWith('http')) {
        console.log('❌ Invalid URL received:', urlOpenBanking);
        throw new Error('Invalid payment URL received from server');
      }
      
      console.log('✅ Valid Tink URL received:', urlOpenBanking);
      setURL(urlOpenBanking);
      setIsLoading(false);
      
      // Set the initial timer.
      let timerID = setInterval(incrementTimeElapsed, intervalSeconds * 1000);
      appState.panels.makePaymentOpenBanking.timerID = timerID;
    } catch(err) {
      let msg = `MakePaymentOpenBanking.setup: Error = ${err}`;
      console.log(msg);
      console.error('❌ [OPEN BANKING ERROR]', err);
      
      // Determine user-friendly error message
      let userMessage = 'Unable to load payment page';
      if (err.message && err.message.includes('Unable to get token')) {
        userMessage = 'Open Banking service is temporarily unavailable. Please try a different payment method.';
      } else if (err.message) {
        userMessage = err.message;
      }
      
      setError(userMessage);
      setIsLoading(false);
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


  let goBack = () => {
    // Clear timer if it exists
    if (appState.panels.makePaymentOpenBanking.timerID) {
      clearInterval(appState.panels.makePaymentOpenBanking.timerID);
      appState.panels.makePaymentOpenBanking.timerID = null;
    }
    // Go back to payment selection
    appState.changeState('ChooseHowToPay');
  };

  return (
    <View style={styles.panelContainer}>
    <View style={styles.panelSubContainer}>

      <View style={[styles.heading, styles.heading1]}>
        <Text style={styles.headingText}>Pay by mobile banking app</Text>
      </View>

      <View style={styles.webviewSection}>

        { isLoading && !error && <Spinner/> }

        { error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={styles.errorTitle}>Payment Setup Failed</Text>
            <Text style={styles.errorMessage}>{error}</Text>
            <View style={styles.errorButtonsContainer}>
              <StandardButton
                title="Try Again"
                onPress={() => {
                  setError(null);
                  setup();
                }}
                style={styles.retryButton}
              />
              <StandardButton
                title="Choose Different Payment"
                mode="outlined"
                onPress={goBack}
                style={styles.backButton}
              />
            </View>
          </View>
        )}

        { !isLoading && !error && !_.isEmpty(url) && (
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
        )}

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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: scaledWidth(20),
    backgroundColor: colors.white,
  },
  errorIcon: {
    fontSize: normaliseFont(60),
    marginBottom: scaledHeight(20),
  },
  errorTitle: {
    fontSize: normaliseFont(22),
    fontWeight: 'bold',
    color: colors.red,
    marginBottom: scaledHeight(15),
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: normaliseFont(16),
    color: colors.darkGrey,
    marginBottom: scaledHeight(30),
    textAlign: 'center',
    lineHeight: normaliseFont(24),
    paddingHorizontal: scaledWidth(10),
  },
  errorButtonsContainer: {
    width: '100%',
    paddingHorizontal: scaledWidth(20),
  },
  retryButton: {
    marginBottom: scaledHeight(15),
    width: '100%',
    alignSelf: 'stretch',
  },
  backButton: {
    width: '100%',
    alignSelf: 'stretch',
  },
});


export default MakePaymentOpenBanking;