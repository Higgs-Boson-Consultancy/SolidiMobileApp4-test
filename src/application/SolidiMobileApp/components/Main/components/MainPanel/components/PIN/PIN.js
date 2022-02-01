// React imports
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  StyleSheet,
  Dimensions,
  Text,
  View
} from 'react-native';
//import PINCode from '@haskkor/react-native-pincode'


// Other imports
import _ from 'lodash';

// Internal imports
import { screenWidth, screenHeight } from 'src/util/dimensions';

import Icon from 'react-native-vector-icons/FontAwesome';





let PIN = () => {

  let [displayPIN, setDisplayPIN] = useState(false);

  return (
    <View>
    <Text>foo</Text>
    <Icon name="rocket" size={30} color="#900" />
    </View>
  )

}


let styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
});


export default PIN;
