import React, { Component } from 'react';
import { View, PanResponder } from 'react-native';

export default class Puller extends Component {
  componentWillMount() {
    this._panResponder = PanResponder.create({
      onMoveShouldSetResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderMove: this.props.onPull,
      onPanResponderRelease: this.props.onRelease,
      onPanResponderTerminate: this.props.onRelease,
    });
  }

  render() {
    return (
      <View {...this._panResponder.panHandlers}>
        {this.props.children}
      </View>
    );
  }
}