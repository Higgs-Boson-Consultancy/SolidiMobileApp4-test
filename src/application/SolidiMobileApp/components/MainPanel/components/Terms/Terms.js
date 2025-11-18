// React imports
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Text, TextInput, StyleSheet, View, ScrollView, TouchableOpacity, Platform } from 'react-native';

// Material Design imports
import {
  Card,
  Title,
  Paragraph,
  useTheme,
  Surface,
  Divider,
} from 'react-native-paper';

// Other imports
import _ from 'lodash';
import Big from 'big.js';

// Internal imports
import AppStateContext from 'src/application/data';
import { colors } from 'src/constants';
import { scaledWidth, scaledHeight, normaliseFont } from 'src/util/dimensions';
import misc from 'src/util/misc';

// Logger
import logger from 'src/util/logger';
let logger2 = logger.extend('Terms');
let {deb, dj, log, lj} = logger.getShortcuts(logger2);


/* Notes


*/



let Terms = () => {

  let appState = useContext(AppStateContext);
  let [renderCount, triggerRender] = useState(0);
  let stateChangeID = appState.stateChangeID;
  let [isLoading, setIsLoading] = useState(true);

  let pageName = appState.pageName;
  let permittedPageNames = 'default'.split(' ');
  misc.confirmItemInArray('permittedPageNames', permittedPageNames, pageName, 'SolidiAccount');
  let terms = appState.apiData.terms['general'];

  // Initial setup.
  useEffect( () => {
    setup();
  }, []); // Pass empty array so that this only runs once on mount.


  let setup = async () => {
    try {
      await appState.generalSetup({caller: 'Terms'});
      if (appState.stateChangeIDHasChanged(stateChangeID)) return;
      setIsLoading(false);
      triggerRender(renderCount+1);
    } catch(err) {
      let msg = `SolidiAccount.setup: Error = ${err}`;
      console.log(msg);
    }
  }

  const materialTheme = useTheme();
  const fontFamily = Platform.OS === 'ios' ? 'Courier' : 'monospace';

  return (
    <View style={{ flex: 1, backgroundColor: materialTheme.colors.background }}>
      
      <Title style={localStyles.pageTitle}>
        Terms & Conditions
      </Title>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16 }}
      >

        <Card style={localStyles.card}>
          <Card.Content style={{ padding: 20 }}>
            <Text style={[localStyles.termsText, { fontFamily }]}>
              {terms}
            </Text>
          </Card.Content>
        </Card>

        <Card style={[localStyles.card, { marginTop: 16, backgroundColor: '#FFF3E0' }]}>
          <Card.Content style={{ padding: 16 }}>
            <Text style={localStyles.infoText}>
              💡 <Text style={localStyles.boldText}>Note:</Text> By using Solidi services, you agree to these terms and conditions.
            </Text>
          </Card.Content>
        </Card>

      </ScrollView>

    </View>
  )
}


const localStyles = StyleSheet.create({
  pageTitle: {
    fontSize: normaliseFont(24),
    fontWeight: 'bold',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    color: colors.primary,
  },
  card: {
    elevation: 2,
    borderRadius: 8,
  },
  termsText: {
    fontSize: normaliseFont(13),
    lineHeight: 20,
    color: '#333',
  },
  infoText: {
    fontSize: normaliseFont(14),
    color: '#E65100',
    lineHeight: 20,
  },
  boldText: {
    fontWeight: 'bold',
  },
});


export default Terms;
