import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { YELLOW } from '../constants/colors';
const { height } = Dimensions.get('window');

export default class Announcement extends Component {
  static propTypes = {
    icon: PropTypes.string,
    message: PropTypes.string,
  }
  
  static defaultProps = {
    icon: 'loader',
    message: '',
  }

  render() {
    const { icon, message } = this.props;
    return (
      <View style={styles.container}>
        <Feather name={icon} size={60} color="black" />
        <Text style={styles.title}>{message}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: YELLOW,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: 'black',
    fontSize: 16,
    fontFamily: 'default',
    marginTop: height / 4,
  },
});
