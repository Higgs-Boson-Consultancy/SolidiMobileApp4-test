// React imports
import React from 'react';
import PropTypes from 'prop-types';
import { Platform, TouchableNativeFeedback, TouchableOpacity } from 'react-native';

// Internal imports
import { StyledView, StyledText } from './components';

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

  return (
    <Touchable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      style={styles.touchable}
      {...rest}
    >
      <StyledView disabled={disabled} styles={styles.view}>
        <StyledText disabled={disabled} styles={styles.text}>
          {title}
        </StyledText>
      </StyledView>
    </Touchable>
  );
};

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
