// React imports
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Text, TextInput, View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

// Material Design imports
import {
  Card,
  Button,
  Title,
  List,
  Divider,
  useTheme,
  Surface,
  Icon,
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
let logger2 = logger.extend('SolidiAccount');
let {deb, dj, log, lj} = logger.getShortcuts(logger2);


/* Notes


*/



let SolidiAccount = () => {

  let appState = useContext(AppStateContext);
  const materialTheme = useTheme();
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
    <View style={{ flex: 1, backgroundColor: materialTheme.colors.background }}>
      
      <Title style={localStyles.pageTitle}>
        Solidi Account
      </Title>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16 }}
      >

        {/* Account Management Section */}
        <Card style={localStyles.card}>
          <Card.Content style={{ padding: 0 }}>
            <List.Section>
              <List.Subheader style={localStyles.sectionHeader}>
                Account Management
              </List.Subheader>
              
              <List.Item
                title="Terms & Conditions"
                description="View our terms and conditions"
                left={props => <List.Icon {...props} icon="file-document-outline" color={materialTheme.colors.primary} />}
                right={props => <List.Icon {...props} icon="chevron-right" />}
                onPress={() => { appState.changeState('Terms'); }}
                style={{ paddingVertical: 8 }}
              />
              
              <Divider />
              
              <List.Item
                title="Delete Account"
                description="Permanently delete your Solidi account"
                left={props => <List.Icon {...props} icon="delete-forever" color={materialTheme.colors.error} />}
                right={props => <List.Icon {...props} icon="chevron-right" />}
                onPress={() => { appState.changeState('CloseSolidiAccount'); }}
                style={{ paddingVertical: 8 }}
                titleStyle={{ color: materialTheme.colors.error }}
              />
            </List.Section>
          </Card.Content>
        </Card>

        {/* Information Card */}
        <Card style={[localStyles.card, { marginTop: 16, backgroundColor: '#E3F2FD' }]}>
          <Card.Content style={{ padding: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
              <Icon 
                source="information" 
                size={24} 
                color={materialTheme.colors.primary}
                style={{ marginRight: 12, marginTop: 2 }}
              />
              <View style={{ flex: 1 }}>
                <Text style={localStyles.infoTitle}>Need Help?</Text>
                <Text style={localStyles.infoText}>
                  If you have any questions about your account or our services, please contact our support team.
                </Text>
              </View>
            </View>
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
  sectionHeader: {
    fontSize: normaliseFont(16),
    fontWeight: 'bold',
    color: colors.primary,
    paddingLeft: 16,
    paddingTop: 8,
  },
  infoTitle: {
    fontSize: normaliseFont(16),
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 4,
  },
  infoText: {
    fontSize: normaliseFont(14),
    color: '#1565C0',
    lineHeight: 20,
  },
});


export default SolidiAccount;
