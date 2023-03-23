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
  CloseSolidiAccount, RegisterConfirm, RegisterConfirm2,
  AccountUpdate } from './components';
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
      return <PIN />
    } else if (appState.mainPanelState === 'ChooseHowToPay') {
      return <ChooseHowToPay />
    } else if (appState.mainPanelState === 'MakePayment') {
      return <MakePayment />
    } else if (appState.mainPanelState === 'WaitingForPayment') {
      return <WaitingForPayment />
    } else if (appState.mainPanelState === 'BlankExampleComponent') {
      return <BlankExampleComponent />
    } else if (appState.mainPanelState === 'PaymentNotMade') {
      return <PaymentNotMade />
    } else if (appState.mainPanelState === 'PurchaseSuccessful') {
      return <PurchaseSuccessful />
    } else if (appState.mainPanelState === 'InsufficientBalance') {
      return <InsufficientBalance />
    } else if (appState.mainPanelState === 'ReadArticle') {
      return <ReadArticle />
    } else if (appState.mainPanelState === 'ChooseHowToReceivePayment') {
      return <ChooseHowToReceivePayment />
    } else if (appState.mainPanelState === 'RequestTimeout') {
      return <RequestTimeout />
    } else if (appState.mainPanelState === 'SaleSuccessful') {
      return <SaleSuccessful />
    } else if (appState.mainPanelState === 'PersonalDetails') {
      return <PersonalDetails />
    } else if (appState.mainPanelState === 'ContactUs') {
      return <ContactUs />
    } else if (appState.mainPanelState === 'BankAccounts') {
      return <BankAccounts />
    } else if (appState.mainPanelState === 'Security') {
      return <Security />
    } else if (appState.mainPanelState === 'RequestFailed') {
      return <RequestFailed />
    } else if (appState.mainPanelState === 'Error') {
      return <Error />
    } else if (appState.mainPanelState === 'SendSuccessful') {
      return <SendSuccessful />
    } else if (appState.mainPanelState === 'Authenticate') {
      return <Authenticate />
    } else if (appState.mainPanelState === 'Register') {
      return <Register />
    } else if (appState.mainPanelState === 'SupportTools') {
      return <SupportTools />
    } else if (appState.mainPanelState === 'LimitsExceeded') {
      return <LimitsExceeded />
    } else if (appState.mainPanelState === 'IdentityVerification') {
      return <IdentityVerification />
    } else if (appState.mainPanelState === 'ResetPassword') {
      return <ResetPassword />
    } else if (appState.mainPanelState === 'MakePaymentOpenBanking') {
      return <MakePaymentOpenBanking />
    } else if (appState.mainPanelState === 'SolidiAccount') {
      return <SolidiAccount />
    } else if (appState.mainPanelState === 'CloseSolidiAccount') {
      return <CloseSolidiAccount />
    } else if (appState.mainPanelState === 'RegisterConfirm') {
      return <RegisterConfirm />
    } else if (appState.mainPanelState === 'RegisterConfirm2') {
      return <RegisterConfirm2 />
    } else if (appState.mainPanelState === 'AccountUpdate') {
      return <AccountUpdate />
    } else {
      return <Text>Error in MainPanel.js: Unknown mainPanelState: {appState.mainPanelState}</Text>
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
