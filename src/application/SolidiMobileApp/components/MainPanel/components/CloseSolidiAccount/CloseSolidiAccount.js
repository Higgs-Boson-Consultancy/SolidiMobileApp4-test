// React imports
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Linking, Image, Text, TextInput, StyleSheet, View, ScrollView, Alert } from 'react-native';

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
  HelperText,
  Dialog,
  Portal,
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
let logger2 = logger.extend('CloseSolidiAccount');
let {deb, dj, log, lj} = logger.getShortcuts(logger2);


/* Notes


*/




let CloseSolidiAccount = () => {

  let appState = useContext(AppStateContext);
  let [renderCount, triggerRender] = useState(0);
  let firstRender = misc.useFirstRender();
  let stateChangeID = appState.stateChangeID;

  let pageName = appState.pageName;
  let permittedPageNames = 'default'.split(' ');
  misc.confirmItemInArray('permittedPageNames', permittedPageNames, pageName, 'CloseSolidiAccount');

  // More state
  let [errorMessage, setErrorMessage] = useState('');
  let [showConfirmDialog, setShowConfirmDialog] = useState(false);


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
      let msg = `CloseSolidiAccount.setup: Error = ${err}`;
      console.log(msg);
    }
  }
  
  const materialTheme = useTheme();
  let supportURL = "https://www.solidi.co/contactus";
  let blogURL = "https://blog.solidi.co/2021/02/20/closing-your-account/";

  // Handle delete account with confirmation
  const handleDeleteAccount = () => {
    setShowConfirmDialog(true);
  };

  const confirmDeleteAccount = async () => {
    setShowConfirmDialog(false);
    await appState.closeSolidiAccount();
  };

  const cancelDeleteAccount = () => {
    setShowConfirmDialog(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: materialTheme.colors.background }}>
      
      <Title style={localStyles.pageTitle}>
        Delete Solidi Account
      </Title>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16 }}
      >

        {!! errorMessage &&
          <HelperText type="error" visible={true} style={{ fontSize: normaliseFont(14), marginBottom: 16 }}>
            {errorMessage}
          </HelperText>
        }

        {/* Warning Card */}
        <Card style={[localStyles.card, { backgroundColor: '#FFEBEE', borderLeftWidth: 4, borderLeftColor: materialTheme.colors.error }]}>
          <Card.Content style={{ padding: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
              <Icon 
                source="alert-circle" 
                size={24} 
                color={materialTheme.colors.error}
                style={{ marginRight: 12, marginTop: 2 }}
              />
              <View style={{ flex: 1 }}>
                <Text style={localStyles.warningTitle}>We're sorry you wish to delete your account</Text>
                <Text style={localStyles.warningText}>
                  If there is a problem, please contact the support team before proceeding.
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Support Button */}
        <Button
          mode="outlined"
          icon="headset"
          onPress={() => { Linking.openURL(supportURL) }}
          style={{ marginTop: 16, marginBottom: 16, borderColor: materialTheme.colors.primary }}
          contentStyle={{ paddingVertical: 8 }}
          labelStyle={{ fontSize: normaliseFont(15) }}
        >
          Contact Support
        </Button>

        {/* Important Information Card */}
        <Card style={[localStyles.card, { marginBottom: 16 }]}>
          <Card.Content style={{ padding: 20 }}>
            <Text style={localStyles.sectionTitle}>⚠️ Please note:</Text>
            <View style={localStyles.bulletPoint}>
              <Icon source="close-circle" size={20} color={materialTheme.colors.error} />
              <Text style={localStyles.bulletText}>We cannot restore deleted accounts</Text>
            </View>
            <View style={localStyles.bulletPoint}>
              <Icon source="close-circle" size={20} color={materialTheme.colors.error} />
              <Text style={localStyles.bulletText}>You cannot create a new account for 30 days</Text>
            </View>
            <View style={localStyles.bulletPoint}>
              <Icon source="close-circle" size={20} color={materialTheme.colors.error} />
              <Text style={localStyles.bulletText}>Regulations may prevent us deleting your data</Text>
            </View>
          </Card.Content>
        </Card>

        {/* Blog Post Info */}
        <Card style={[localStyles.card, { marginBottom: 16, backgroundColor: '#E8F5E9' }]}>
          <Card.Content style={{ padding: 16 }}>
            <Text style={localStyles.infoText}>
              📖 To find out more about account deletion, please read our blog post.
            </Text>
          </Card.Content>
        </Card>

        <Button
          mode="outlined"
          icon="book-open-variant"
          onPress={() => { Linking.openURL(blogURL) }}
          style={{ marginBottom: 24, borderColor: '#4CAF50' }}
          textColor="#2E7D32"
          contentStyle={{ paddingVertical: 8 }}
          labelStyle={{ fontSize: normaliseFont(15) }}
        >
          Read the blog post
        </Button>

        {/* Final Warning */}
        <Card style={[localStyles.card, { marginBottom: 16, backgroundColor: '#FFF3E0' }]}>
          <Card.Content style={{ padding: 16 }}>
            <Text style={localStyles.finalWarning}>
              If you still wish to delete your account, please click the button below. This action cannot be undone.
            </Text>
          </Card.Content>
        </Card>

        {/* Delete Button */}
        <Button
          mode="contained"
          icon="delete-forever"
          buttonColor={materialTheme.colors.error}
          textColor="white"
          onPress={handleDeleteAccount}
          style={{ marginTop: 8, marginBottom: 32 }}
          contentStyle={{ paddingVertical: 12 }}
          labelStyle={{ fontSize: normaliseFont(16), fontWeight: 'bold' }}
        >
          Delete my Solidi account
        </Button>

      </ScrollView>

      {/* Confirmation Dialog */}
      <Portal>
        <Dialog visible={showConfirmDialog} onDismiss={cancelDeleteAccount}>
          <Dialog.Icon icon="alert-circle-outline" size={48} color={materialTheme.colors.error} />
          <Dialog.Title style={{ textAlign: 'center', fontWeight: 'bold' }}>
            Confirm Account Deletion
          </Dialog.Title>
          <Dialog.Content>
            <Paragraph style={{ textAlign: 'center', fontSize: normaliseFont(15), lineHeight: 22 }}>
              Are you absolutely sure you want to delete your Solidi account?
            </Paragraph>
            <Paragraph style={{ textAlign: 'center', fontSize: normaliseFont(14), marginTop: 12, color: materialTheme.colors.error }}>
              ⚠️ This action cannot be undone and you will not be able to create a new account for 30 days.
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
            <Button 
              onPress={cancelDeleteAccount}
              mode="outlined"
              style={{ flex: 1, marginRight: 8 }}
            >
              Cancel
            </Button>
            <Button 
              onPress={confirmDeleteAccount}
              mode="contained"
              buttonColor={materialTheme.colors.error}
              style={{ flex: 1 }}
            >
              Delete
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

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
  warningTitle: {
    fontSize: normaliseFont(16),
    fontWeight: 'bold',
    color: '#C62828',
    marginBottom: 8,
  },
  warningText: {
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
  bulletPoint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  bulletText: {
    fontSize: normaliseFont(14),
    color: '#333',
    marginLeft: 12,
    flex: 1,
  },
  infoText: {
    fontSize: normaliseFont(14),
    color: '#2E7D32',
    lineHeight: 20,
  },
  finalWarning: {
    fontSize: normaliseFont(14),
    color: '#E65100',
    lineHeight: 20,
    fontWeight: '500',
  },
});


export default CloseSolidiAccount;
