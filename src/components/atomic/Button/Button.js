// React imports
import React from 'react';
import PropTypes from 'prop-types';
import { Platform, StyleSheet, TouchableNativeFeedback, TouchableOpacity } from 'react-native';

// Other imports
import _ from 'lodash';

// Internal imports
import { StyledView, StyledText } from './components';
import { colors } from 'src/constants';

// Logger
import logger from 'src/util/logger';
let logger2 = logger.extend('Button');
let {deb, dj, log, lj} = logger.getShortcuts(logger2);




const Button = ({
  title,
  disabled,
  styles,
  ...rest
}) => {
  const Touchable = Platform.select({
    ios: TouchableOpacity,
    android: TouchableNativeFeedback,
  });

  //log('Inside Button constructor');

  let styleView = defaultStyleView;
  if (! _.isNil(styles)) {
    // Add some default styling to the View.
    if (styles.view) {
      styleView = StyleSheet.flatten([styleView, styles.view]);
      // Alter styling of a disabled button.
      if (disabled) {
        styleView = StyleSheet.flatten([styleView, styleViewDisabled]);
      }
    }
  }

  return (
    <Touchable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      style={styles.touchable}
      {...rest}
    >
      <StyledView disabled={disabled} styles={styleView}>
        <StyledText disabled={disabled} styles={styles.text}>
          {title}
        </StyledText>
      </StyledView>
    </Touchable>
  );
};


let defaultStyleView = StyleSheet.create({
  // Elevation is set to 0 to avoid a slight drop-shadow on the ImageButton's internal View on Android.
  elevation: 0,
  backgroundColor: colors.defaultBackground,
});


let styleViewDisabled = StyleSheet.create({
  backgroundColor: colors.greyedOutIcon,
});


Button.defaultProps = {
  disabled: false,
  styles: {
    touchable: {},
    view: {},
    text: {},
  },
};


Button.propTypes = {
  title: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  styles: PropTypes.shape({
    touchable: PropTypes.object,
    view: PropTypes.object,
    text: PropTypes.object,
  }),
};


export default Button;
