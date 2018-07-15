import React, { Component } from 'react';
import { View, PanResponder, Animated, StyleSheet, Dimensions, Text } from 'react-native';

const { width, height } = Dimensions.get('window');

const SIGNIFICANCE_THRESHOLD = width / 10;
const isSignificant = gestureState => Math.abs(gestureState.dx) > SIGNIFICANCE_THRESHOLD;

export default class Cards extends Component {
  state = {
    activeItem: 0,
    pan: new Animated.Value(0),
  };

  static defaultProps = {
    renderEmpty: () => null,
  }

  constructor(props) {
    super(props);
    this.handleRelease = this.handleRelease.bind(this);
  }

  componentWillMount() {
    this._panResponder = PanResponder.create({
      onMoveShouldSetResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: (event, gestureState) => isSignificant(gestureState),
      onPanResponderMove: (...args) => {
        return Animated.event([null, {
          dx: this.state.pan,
        }])(...args);
      },
      onPanResponderTerminationRequest: () => true,
      onPanResponderRelease: this.handleRelease,
      onPanResponderTerminate: this.handleRelease,
    });
  }

  handleRelease(event, gestureState) {
    const { dx } = gestureState;
    if(dx < -width / 4) {
      Animated.spring(this.state.pan, { toValue: -width })
        .start(() => {
          this.setState({ activeItem: this.getNextIndex() });
          this.state.pan.setValue(0);
        });  
      return;
    }
    if(dx > width / 4) {
      Animated.spring(this.state.pan, { toValue: width })
        .start(() => {
          this.setState({ activeItem: this.getPreviousIndex() });
          this.state.pan.setValue(0);
        });
      return;
    }
    Animated.spring(this.state.pan, { toValue: 0, useNativeDriver: true }).start();
  }

  getPreviousIndex() {
    const { items } = this.props;
    const { activeItem } = this.state;
    return activeItem === 0 ? items.length - 1 : activeItem - 1;

  }

  getNextIndex() {
    const { items } = this.props;
    const { activeItem } = this.state;
    return activeItem === items.length - 1 ? 0 : activeItem + 1;
  }

  getPreviousItem() {
    const { items } = this.props;
    return items[this.getPreviousIndex()];
  }

  getCurrentItem() {
    return this.props.items[this.state.activeItem];
  }

  getNextItem() {
    const { items } = this.props;
    return items[this.getNextIndex()];
  }

  render() {
    const { items, renderEmpty, renderItem } = this.props;
    if(!items || !items.length) return renderEmpty();
    const previousItem = this.getPreviousItem();
    const currentItem = this.getCurrentItem();
    const nextItem = this.getNextItem();
    return (
      <Animated.View {...this._panResponder.panHandlers} style={styles.container}>
        <Animated.View
          style={{
            // flex: 1,
            // minHeight: height,
            left: this.state.pan,
            width,
            transform: [
              { translateX: -width },
              { translateY: 0 },
            ],
            top: 0,
            position: 'absolute',
          }}>
          <View style={styles.card}>
            {renderItem(previousItem)}
          </View>
        </Animated.View>
        <Animated.View
          style={{
            // flex: 1,
            // minHeight: height,
            left: this.state.pan,
            width,
            top: 0,
            position: 'absolute',
          }}>
          <View style={styles.card}>
            {renderItem(currentItem)}
          </View>
        </Animated.View>
        <Animated.View
          style={{
            // flex: 1,
            // minHeight: height,
            left: this.state.pan,
            width,
            transform: [
              { translateX: width },
              { translateY: 0 },
            ],
            top: 0,
            position: 'absolute',
          }}> 
          <View style={styles.card}>
            {renderItem(nextItem)}
          </View>
        </Animated.View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // display: 'flex',
    // width,
    left: 0,
  },
  card: {
    // flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    // width,
  },
})