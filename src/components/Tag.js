import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';

export default class Tag extends Component {
  static propTypes = {
    style: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
    children: PropTypes.node,
  }

  static defaultProps = {
    style: {},
  }

  render() {
    const { children, style } = this.props;
    return (
      <View style={[styles.container, style]}>
        <Text style={styles.text}>{children}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 6,
    paddingLeft: 4,
    paddingRight: 4,
    height: 20,
    top: -1,
    marginRight: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    flexShrink: 1,
    alignSelf: 'flex-start',
  },
  text: {
    fontFamily: 'default',
    fontSize: 12,
  }
});
