/* Notes:
- We use a TouchableHighlight (instead of TouchableOpacity), so that we get a background color change on press but not afterwards.
-- Future: On Android, does the TouchableNativeFeedback need to changed to something else ?
- The image is required.
- The text title is optional.
*/


import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import { Platform, TouchableHighlight, TouchableNativeFeedback } from 'react-native';

import StyledView from './StyledView';
import StyledImage from './StyledImage';
import StyledText from './StyledText';

const ImageButton = ({
  title,
  disabled,
  styles,
  imageName,
  ...rest
}) => {
  const Touchable = Platform.select({
    ios: TouchableHighlight,
    android: TouchableNativeFeedback,
  });

  let titleExists = !!title;

  return (
    <Touchable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      style={styles.touchable}
      activeOpacity={0.8}
      underlayColor="#DDDDDD"
      {...rest}
    >
      <View>
        <StyledView disabled={disabled} styles={styles.view}>
          <StyledImage imageName={imageName} disabled={disabled} styles={styles.image} />
          { titleExists &&
            <StyledText disabled={disabled} styles={styles.text}>
              {title}
            </StyledText>
          }
        </StyledView>
      </View>
    </Touchable>
  );
};

ImageButton.defaultProps = {
  disabled: false,
  styles: {
    touchable: {},
    view: {},
    image: {},
    text: {},
  },
};

ImageButton.propTypes = {
  imageName: PropTypes.string.isRequired,
  title: PropTypes.string,
  disabled: PropTypes.bool,
  styles: PropTypes.shape({
    touchable: PropTypes.object,
    image: PropTypes.object,
    view: PropTypes.object,
    text: PropTypes.object,
  }),
};

export default ImageButton;
