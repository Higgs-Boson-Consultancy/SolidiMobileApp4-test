
import React from 'react';
import { Image, Platform, StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';

import ImageLookup from 'src/images';

const { style } = StyleSheet.create({
  style: {
    flex: 1,
    width: '70%',
    height: null,
    resizeMode: 'contain',
  },
});

const StyledImage= ({ imageName, disabled, styles, ...rest }) => {
  const combinedStyles = StyleSheet.flatten([style, styles]);

  return <Image source={ImageLookup[imageName]} style={combinedStyles} {...rest} />;
};

StyledImage.defaultProps = {
  styles: {},
};

StyledImage.propTypes = {
  disabled: PropTypes.bool.isRequired,
  styles: PropTypes.object,
};

export default StyledImage;
