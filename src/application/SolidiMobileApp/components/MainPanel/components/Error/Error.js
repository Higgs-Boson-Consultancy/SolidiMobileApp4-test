// React imports
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Text, StyleSheet, View, ScrollView } from 'react-native';

// Material Design imports
import {
  Card,
  Button,
  Title,
  Paragraph,
  useTheme,
  Surface,
  Icon,
  Divider,
  Chip,
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

  const materialTheme = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: materialTheme.colors.background }}>
      
      <Title style={localStyles.pageTitle}>
        Error
      </Title>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16 }}
      >

        {/* Error Alert Card */}
        <Card style={[localStyles.card, { backgroundColor: '#FFEBEE', borderLeftWidth: 4, borderLeftColor: materialTheme.colors.error }]}>
          <Card.Content style={{ padding: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
              <Icon 
                source="alert-circle" 
                size={32} 
                color={materialTheme.colors.error}
                style={{ marginRight: 12, marginTop: 2 }}
              />
              <View style={{ flex: 1 }}>
                <Text style={localStyles.errorTitle}>Unfortunately, an error has occurred</Text>
                <Text style={localStyles.errorSubtitle}>
                  We apologize for the inconvenience. Please review the details below.
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Error Details Card */}
        <Card style={[localStyles.card, { marginTop: 16 }]}>
          <Card.Content style={{ padding: 20 }}>
            <Text style={localStyles.sectionTitle}>Error Details</Text>
            
            <View style={localStyles.detailRow}>
              <Icon source="server-network" size={20} color={materialTheme.colors.primary} />
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={localStyles.detailLabel}>Domain</Text>
                <Text style={localStyles.detailValue}>{appState.domain}</Text>
              </View>
            </View>

            <Divider style={{ marginVertical: 12 }} />

            <View style={localStyles.detailRow}>
              <Icon source="information" size={20} color={materialTheme.colors.primary} />
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={localStyles.detailLabel}>Error Message</Text>
                <Text style={localStyles.detailValue}>{appState.error.message}</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Instructions Card */}
        <Card style={[localStyles.card, { marginTop: 16, backgroundColor: '#FFF3E0' }]}>
          <Card.Content style={{ padding: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
              <Icon 
                source="camera" 
                size={24} 
                color="#E65100"
                style={{ marginRight: 12, marginTop: 2 }}
              />
              <View style={{ flex: 1 }}>
                <Text style={localStyles.instructionTitle}>Please take a screenshot</Text>
                <Text style={localStyles.instructionText}>
                  Capture this page to record the error message for our support team.
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Action Buttons */}
        <View style={{ marginTop: 24 }}>
          <Button
            mode="contained"
            icon="login"
            onPress={async () => { 
              await appState.recoverFromErrorState();
            }}
            style={{ marginBottom: 12 }}
            contentStyle={{ paddingVertical: 12 }}
            labelStyle={{ fontSize: normaliseFont(16), fontWeight: 'bold' }}
          >
            Return to Login
          </Button>

          <Button
            mode="outlined"
            icon="headset"
            onPress={() => { appState.changeState('ContactUs') }}
            style={{ borderColor: materialTheme.colors.primary }}
            contentStyle={{ paddingVertical: 12 }}
            labelStyle={{ fontSize: normaliseFont(16) }}
          >
            Contact Support
          </Button>
        </View>

        {/* Support Info */}
        <Card style={[localStyles.card, { marginTop: 16, backgroundColor: '#E3F2FD' }]}>
          <Card.Content style={{ padding: 16 }}>
            <Text style={localStyles.supportText}>
              💡 If this error persists, please contact our support team with the error details above.
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
    color: colors.error || '#D32F2F',
  },
  card: {
    elevation: 2,
    borderRadius: 8,
  },
  errorTitle: {
    fontSize: normaliseFont(18),
    fontWeight: 'bold',
    color: '#C62828',
    marginBottom: 6,
  },
  errorSubtitle: {
    fontSize: normaliseFont(14),
    color: '#D32F2F',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: normaliseFont(16),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  detailLabel: {
    fontSize: normaliseFont(12),
    color: '#666',
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: normaliseFont(14),
    color: '#333',
    lineHeight: 20,
  },
  instructionTitle: {
    fontSize: normaliseFont(15),
    fontWeight: 'bold',
    color: '#E65100',
    marginBottom: 6,
  },
  instructionText: {
    fontSize: normaliseFont(14),
    color: '#E65100',
    lineHeight: 20,
  },
  supportText: {
    fontSize: normaliseFont(14),
    color: '#1565C0',
    lineHeight: 20,
  },
});


export default Error;
