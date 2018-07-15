import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { YELLOW } from '../constants/colors';
const { height } = Dimensions.get('window');

export default class Announcement extends Component {
  static defaultProps = {
    icon: 'loader',
    message: '',
  };

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
    fontSize: 20,
    fontFamily: 'bold',
    marginTop: height / 4,
  },
});
