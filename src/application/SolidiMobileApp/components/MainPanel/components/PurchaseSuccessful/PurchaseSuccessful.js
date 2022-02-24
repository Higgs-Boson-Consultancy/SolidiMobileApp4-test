// React imports
import React, { useContext, useEffect, useState } from 'react';
import { Text, StyleSheet, View } from 'react-native';

// Other imports
import _ from 'lodash';

// Internal imports
import AppStateContext from 'src/application/data';
import { assetsInfo, mainPanelStates, colors } from 'src/constants';
import { scaledWidth, scaledHeight, normaliseFont } from 'src/util/dimensions';
import { Button, StandardButton, ImageButton } from 'src/components/atomic';
import misc from 'src/util/misc';

/* Notes
- We use this component to also display "paymentNotReceived", if the user clicks "I have paid", but 2 hours pass without us receiving the payment.
*/




let PurchaseSuccessful = () => {

  let appState = useContext(AppStateContext);

  // Load order details.
  ({volumeQA, volumeBA, assetQA, assetBA} = appState.panels.buy);

  let [balanceBA, setBalanceBA] = useState('');

  let viewAssets = () => {
    let pageName = assetsInfo[assetBA].type; // 'crypto' or 'fiat'.
    appState.changeState('Assets', pageName);
  }

  let buyAgain = () => {
    appState.changeState('Buy');
  }

  let loadBalance = async () => {
    let data = await appState.apiClient.privateMethod({
      httpMethod: 'POST',
      apiMethod: 'balance',
      params: {},
    });
    let result = data[assetBA].balance;
    result = '0.05000000'
    setBalanceBA(result);
  };
  if (! balanceBA) {
    loadBalance();
  }

  return (
    <View style={styles.panelContainer}>
    <View style={styles.panelSubContainer}>

      <View style={[styles.heading, styles.heading1]}>
        <Text style={styles.headingText}>Purchase successful!</Text>
      </View>

      <View style={styles.infoSection}>

      <View style={styles.infoItem}>
          <Text style={styles.bold}>{`\u2022  `} Your payment has been received.</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.bold}>{`\u2022  `} Your order has been processed.</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.bold}>{`\u2022  `} Order details: Buy {volumeBA} {assetsInfo[assetBA].displayString} for {volumeQA} {assetsInfo[assetQA].displayString}.</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.bold}>{`\u2022  `} Your new {assetsInfo[assetBA].displaySymbol} balance is: { (balanceBA > 0) ? balanceBA : ''}</Text>
        </View>

      </View>

      <View style={styles.button}>
        <StandardButton title="View assets" onPress={ viewAssets } />
      </View>

      <View style={styles.button}>
        <StandardButton title="Buy another asset" onPress={ buyAgain } />
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
  },
  headingText: {
    fontSize: normaliseFont(20),
    fontWeight: 'bold',
  },
  infoSection: {
    paddingTop: scaledHeight(40),
    paddingBottom: scaledHeight(20),
    alignItems: 'flex-start',
  },
  infoItem: {
    marginBottom: scaledHeight(5),
  },
  bold: {
    fontWeight: 'bold',
  },
  button: {
    marginTop: scaledHeight(20),
  },
});


export default PurchaseSuccessful;
