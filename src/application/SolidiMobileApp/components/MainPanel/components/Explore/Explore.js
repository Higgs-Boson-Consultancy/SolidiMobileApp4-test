// React imports
import React, { useContext } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';

// Material Design imports
import { Text, Card, Button } from 'react-native-paper';

// Internal imports
import AppStateContext from 'src/application/data';
import { colors, sharedStyles, sharedColors } from 'src/constants';
import { scaledWidth, scaledHeight, normaliseFont } from 'src/util/dimensions';
import { Title } from 'src/components/shared';

// Logger
import logger from 'src/util/logger';
let logger2 = logger.extend('Explore');
let {deb, dj, log, lj} = logger.getShortcuts(logger2);

let Explore = () => {
  let appState = useContext(AppStateContext);

  return (
    <View style={[sharedStyles.container, { backgroundColor: sharedColors.background }]}>
      
      <Title>
        Explore
      </Title>

      {/* Content */}
      <ScrollView style={{ flex: 1, padding: 16 }}>
        
        {/* Navigation Index */}
        <Card style={{ marginBottom: 16 }}>
          <Card.Content style={{ padding: 20 }}>
            <Text variant="titleMedium" style={{ marginBottom: 12, fontWeight: '600' }}>
              App Navigation Index
            </Text>
            <Text variant="bodyMedium" style={{ color: '#666', lineHeight: 22, marginBottom: 16 }}>
              Access all pages and features through the comprehensive navigation index.
            </Text>
            <Button 
              mode="contained" 
              onPress={() => {
                appState.setMainPanelState({
                  mainPanelState: 'NavigationDebug',
                  pageName: 'default'
                });
              }}
              style={{ marginTop: 16 }}
              contentStyle={{ paddingVertical: 4 }}
            >
              Open Navigation Index
            </Button>
          </Card.Content>
        </Card>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
});

export default Explore;