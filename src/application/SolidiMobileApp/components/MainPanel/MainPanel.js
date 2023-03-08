// React imports
import React, {useContext} from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

// Other imports
import _ from 'lodash';

// Internal imports
import { colors, mainPanelStates } from 'src/constants';
import { Test, Buy, Sell, Send, Receive, Assets, History,
  Notifications, Settings, Login, PIN, ChooseHowToPay,
  MakePayment, WaitingForPayment, BlankExampleComponent,
  PaymentNotMade, PurchaseSuccessful, InsufficientBalance,
  ReadArticle, ChooseHowToReceivePayment, RequestTimeout,
  SaleSuccessful, PersonalDetails, ContactUs, BankAccounts,
  Security, RequestFailed, Error, SendSuccessful, Authenticate,
  Register, SupportTools, LimitsExceeded, IdentityVerification,
  ResetPassword, MakePaymentOpenBanking, SolidiAccount,
  CloseSolidiAccount } from './components';
import AppStateContext from 'src/application/data';

import * as allcomponents from './components';


let MainPanel = (props) => {

  let {style:styleArg} = props;

  let appState = useContext(AppStateContext);

  let selectPanelComponent = () => {

    // JDM - 2023-03-07 - Do we need to use mainPanelState here? We've already check this in AppState.changeState.
    if (mainPanelStates.indexOf(appState.mainPanelState)==-1) {
      return <Text>Early Error in MainPanel.js: Unknown mainPanelState: {appState.mainPanelState}</Text>
    }
    // JDM - 2023-03-07 - Alternative way to check for valid components (maybe too flexible?)
    if(!Object.keys(allcomponents).includes(appState.mainPanelState)) {
      return <Text>Error in MainPanel.js: Unknown mainPanelState: {appState.mainPanelState}</Text>
    }

    // Special cases
    if (appState.mainPanelState === 'PIN') {
      if (appState.pageName == 'default') {
        if (! appState.user.pin) {
          return <Login />
        }
      }
    }
    // Get the component that the mainpanel is set to (text string) from all the components.
    // and then create the JSX element and return it.
    let targetcomponent = allcomponents[appState.mainPanelState]
    return React.createElement(targetcomponent);
  }

  return (
      <View style={[styleArg, styles.mainPanel]}>
        {selectPanelComponent()}
      </View>
    );

};


let styles = StyleSheet.create({
  mainPanel: {
    alignItems: 'center',
    backgroundColor: colors.mainPanelBackground,
  },
});


export default MainPanel;
