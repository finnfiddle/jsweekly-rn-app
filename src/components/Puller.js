import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, PanResponder } from 'react-native';

export default class Puller extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    onRelease: PropTypes.func.isRequired,
    onPull: PropTypes.func.isRequired,
  }
  
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