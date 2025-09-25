// React imports
import React, { useContext, useEffect, useRef, useState } from 'react';
import { TextInput, StyleSheet, View, ScrollView } from 'react-native';
import { Text, Card, useTheme } from 'react-native-paper';

// Other imports
import _ from 'lodash';
import Big from 'big.js';

// Internal imports
import AppStateContext from 'src/application/data';
import { colors, sharedColors, sharedStyles } from 'src/constants';
import { scaledWidth, scaledHeight, normaliseFont } from 'src/util/dimensions';
import { Button, StandardButton, ImageButton, Spinner } from 'src/components/atomic';
import { Title } from 'src/components/shared';
import misc from 'src/util/misc';

// Logger
import logger from 'src/util/logger';
let logger2 = logger.extend('Security');
let {deb, dj, log, lj} = logger.getShortcuts(logger2);


/* Notes


*/




let Security = () => {

  let appState = useContext(AppStateContext);
  const materialTheme = useTheme();
  let [renderCount, triggerRender] = useState(0);
  let firstRender = misc.useFirstRender();
  let stateChangeID = appState.stateChangeID;

  let pageName = appState.pageName;
  let permittedPageNames = 'default'.split(' ');
  misc.confirmItemInArray('permittedPageNames', permittedPageNames, pageName, 'Security');

  let [pinVisible, setPINVisible] = useState(false);




  // Initial setup.
  useEffect( () => {
    setup();
  }, []); // Pass empty array so that this only runs once on mount.


  let setup = async () => {
    try {
      await appState.generalSetup();
      await appState.loadInitialStuffAboutUser();
      if (appState.stateChangeIDHasChanged(stateChangeID)) return;
      triggerRender(renderCount+1);
    } catch(err) {
      let msg = `Security.setup: Error = ${err}`;
      console.log(msg);
    }
  }


  let getPINButtonTitle = () => {
    let title = pinVisible ? 'Hide PIN' : 'Show PIN';
    return title;
  }


  return (
    <View style={{ flex: 1, backgroundColor: materialTheme.colors.background }}>

      <Title>
        Security
      </Title>

      <ScrollView 
        style={{ flex: 1 }} 
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={true}
      >

        <Card style={{ marginBottom: 16, elevation: 2 }}>
          <Card.Content style={{ padding: 20 }}>
            <Text variant="titleMedium" style={{ 
              marginBottom: 20, 
              fontWeight: '600',
              color: materialTheme.colors.primary 
            }}>
              PIN Management
            </Text>

            <View style={{ marginBottom: 16 }}>
              <Text variant="bodyMedium" style={{ 
                marginBottom: 8,
                color: materialTheme.colors.onSurfaceVariant,
                fontWeight: '500'
              }}>
                Current PIN
              </Text>
              <TextInput
                name='pin'
                value={appState.user.pin}
                style={{
                  backgroundColor: materialTheme.colors.surfaceVariant,
                  borderRadius: 8,
                  fontSize: 16,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  color: materialTheme.colors.onSurface
                }}
                textContentType='newPassword'
                secureTextEntry={! pinVisible}
                editable={false}
              />
            </View>

            <View style={{ gap: 12 }}>
              <StandardButton 
                title={getPINButtonTitle()}
                onPress={ () => { setPINVisible(! pinVisible) } }
              />
              
              <StandardButton 
                title='Change PIN' 
                onPress={ () => {
                  appState.stashCurrentState()
                  appState.choosePIN();
                }} 
              />
            </View>
          </Card.Content>
        </Card>

      </ScrollView>

    </View>
  )

}


let styles = StyleSheet.create({
  panelContainer: {
    paddingHorizontal: scaledWidth(15),
    paddingVertical: scaledHeight(5),
    width: '100%',
    height: '100%',
    //borderWidth: 1, // testing
  },
  panelSubContainer: {
    //paddingTop: scaledHeight(10),
    //paddingHorizontal: scaledWidth(30),
    height: '100%',
    //borderWidth: 1, // testing
  },
  heading: {
    alignItems: 'center',
  },
  heading1: {
    marginTop: scaledHeight(10),
    marginBottom: scaledHeight(20),
  },
  headingText: {
    fontSize: normaliseFont(20),
    fontWeight: 'bold',
  },
  bold: {
    fontWeight: 'bold',
  },
  detail: {
    //borderWidth: 1, // testing
    marginTop: scaledHeight(20),
    flexDirection: 'row',
    flexWrap: 'wrap', // Allows long detail value to move onto the next line.
    alignItems: 'center',
  },
  detailName: {
    paddingRight: scaledWidth(10),
    paddingVertical: scaledHeight(10),
    minWidth: '35%', // Expands with length of detail name.
    //borderWidth: 1, // testing
  },
  detailNameText: {
    fontSize: normaliseFont(16),
    fontWeight: 'bold',
  },
  detailValue: {
    fontSize: normaliseFont(16),
    paddingLeft: scaledWidth(10),
    paddingVertical: scaledHeight(10),
    minWidth: '65%',
    //borderWidth: 1, // testing
  },
  detailValueText: {
    fontSize: normaliseFont(16),
    //borderWidth: 1, // testing
  },
  secretTextInput: {
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#d7d7d7',
  },
  buttonWrapper: {
    //borderWidth: 1,
    paddingRight: scaledWidth(40),
    marginTop: scaledHeight(10),
    width: '100%',
  },
});


export default Security;
