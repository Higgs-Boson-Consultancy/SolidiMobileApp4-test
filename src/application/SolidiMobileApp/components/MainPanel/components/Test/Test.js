// React imports
import React, { useContext, useEffect, useState } from 'react';
import { Image, Text, StyleSheet, View, ScrollView } from 'react-native';

// Internal imports
import AppStateContext from 'src/application/data';
import { mainPanelStates, colors } from 'src/constants';
import { scaledWidth, scaledHeight, normaliseFont } from 'src/util/dimensions';
import { Button, StandardButton, ImageButton } from 'src/components/atomic';
import ImageLookup from 'src/images';

// Logger
import logger from 'src/util/logger';
let logger2 = logger.extend('Test');
let {deb, dj, log, lj} = logger.getShortcuts(logger2);



let Test = () => {

  let appState = useContext(AppStateContext);
  let [renderCount, triggerRender] = useState(0);


  useEffect(() => {
    setup();
  }, []);


  let setup = async () => {
    try {
      await appState.generalSetup();
      lj(appState.getDepositDetailsForAsset('GBP'))
      await appState.loadDepositDetailsForAsset('GBP');
      //await appState.loadPrices();
      lj(appState.getDepositDetailsForAsset('GBP'))
      triggerRender(renderCount+1);
    } catch(err) {
      let msg = `Test.setup: Error = ${err}`;
      console.log(msg);
    }
  }


  return (
    <View style={styles.panelContainer}>

      <Text style={styles.headingText}>BlankExampleComponent2</Text>

      <Image source={appState.getAssetIcon('EUR')} style={{
          width: scaledWidth(27),
          height: scaledHeight(27),
          resizeMode: 'cover',
          borderWidth: 1,
        }}/>

      <Text>Status: </Text>
      <StandardButton title='Log out' style={styleButton}
        onPress={ () => { appState.logout(); } }
      />
      <StandardButton title='Change PIN' style={styleButton}
        onPress={ () => { appState.choosePIN(); } }
      />

    </View>
  )

}


let styles = StyleSheet.create({
  panelContainer: {
    paddingTop: scaledHeight(80),
    paddingHorizontal: scaledWidth(15),
    width: '100%',
    height: '100%',
  },
});


let styleButton = StyleSheet.create({
  marginTop: 10,
});


export default Test;
