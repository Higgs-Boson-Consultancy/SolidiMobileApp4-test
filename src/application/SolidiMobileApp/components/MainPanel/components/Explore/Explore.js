// React imports
import React, { useContext } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';

// Material Design imports
import { Text, Card, Button } from 'react-native-paper';

// Internal imports
import AppStateContext from 'src/application/data';
import { colors, sharedStyles, sharedColors } from 'src/constants';
import { scaledWidth, scaledHeight, normaliseFont } from 'src/util/dimensions';

// Logger
import logger from 'src/util/logger';
let logger2 = logger.extend('Explore');
let {deb, dj, log, lj} = logger.getShortcuts(logger2);

let Explore = () => {
  let appState = useContext(AppStateContext);

  return (
    <View style={[sharedStyles.container, { backgroundColor: sharedColors.background }]}>
      
      {/* Header Section */}
      <View style={{
        backgroundColor: sharedColors.primary,
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 20,
        elevation: 2,
      }}>
        <Text variant="headlineSmall" style={[sharedStyles.headerTitle]}>
          Explore
        </Text>
      </View>

      {/* Content */}
      <ScrollView style={{ flex: 1, padding: 16 }}>
        
        {/* Market Overview */}
        <Card style={{ marginBottom: 16 }}>
          <Card.Content style={{ padding: 20 }}>
            <Text variant="titleMedium" style={{ marginBottom: 12, fontWeight: '600' }}>
              Market Overview
            </Text>
            <Text variant="bodyMedium" style={{ color: '#666', lineHeight: 22 }}>
              Stay up to date with cryptocurrency market trends, prices, and analysis.
            </Text>
            <Button 
              mode="contained" 
              onPress={() => console.log('View Markets')}
              style={{ marginTop: 16 }}
              contentStyle={{ paddingVertical: 4 }}
            >
              View Markets
            </Button>
          </Card.Content>
        </Card>

        {/* Educational Content */}
        <Card style={{ marginBottom: 16 }}>
          <Card.Content style={{ padding: 20 }}>
            <Text variant="titleMedium" style={{ marginBottom: 12, fontWeight: '600' }}>
              Learn & Earn
            </Text>
            <Text variant="bodyMedium" style={{ color: '#666', lineHeight: 22 }}>
              Discover educational content about cryptocurrencies and blockchain technology.
            </Text>
            <Button 
              mode="outlined" 
              onPress={() => console.log('Start Learning')}
              style={{ marginTop: 16 }}
              contentStyle={{ paddingVertical: 4 }}
            >
              Start Learning
            </Button>
          </Card.Content>
        </Card>

        {/* News & Updates */}
        <Card style={{ marginBottom: 16 }}>
          <Card.Content style={{ padding: 20 }}>
            <Text variant="titleMedium" style={{ marginBottom: 12, fontWeight: '600' }}>
              News & Updates
            </Text>
            <Text variant="bodyMedium" style={{ color: '#666', lineHeight: 22 }}>
              Get the latest news and updates from the cryptocurrency world.
            </Text>
            <Button 
              mode="outlined" 
              onPress={() => console.log('Read News')}
              style={{ marginTop: 16 }}
              contentStyle={{ paddingVertical: 4 }}
            >
              Read News
            </Button>
          </Card.Content>
        </Card>

        {/* DeFi Opportunities */}
        <Card style={{ marginBottom: 32 }}>
          <Card.Content style={{ padding: 20 }}>
            <Text variant="titleMedium" style={{ marginBottom: 12, fontWeight: '600' }}>
              DeFi Opportunities
            </Text>
            <Text variant="bodyMedium" style={{ color: '#666', lineHeight: 22 }}>
              Explore decentralized finance opportunities and yield farming options.
            </Text>
            <Button 
              mode="outlined" 
              onPress={() => console.log('Explore DeFi')}
              style={{ marginTop: 16 }}
              contentStyle={{ paddingVertical: 4 }}
            >
              Explore DeFi
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