import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, PanResponder, Animated, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const SIGNIFICANCE_THRESHOLD = width / 10;
const isSignificant = gestureState => Math.abs(gestureState.dx) > SIGNIFICANCE_THRESHOLD;
const animatedWidth = new Animated.Value(width);
const negativeAnimatedWidth = new Animated.Value(-width);

export default class Cards extends Component {
  static propTypes = {
    items: PropTypes.array.isRequired,
    renderEmpty: PropTypes.func.isRequired,
    renderItem: PropTypes.func.isRequired,
    onChange: PropTypes.func,
  }
  
  static defaultProps = {
    onChange: () => {},
    renderEmpty: () => null,
  }

  state = {
    activeItem: 0,
    pan: new Animated.Value(0),
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
      Animated.timing(this.state.pan, { toValue: -width })
        .start(() => {
          const activeItem = this.getNextIndex();
          this.setState({ activeItem });
          this.props.onChange(activeItem);
          this.state.pan.setValue(0);
        });  
      return;
    }
    if(dx > width / 4) {
      Animated.timing(this.state.pan, { toValue: width })
        .start(() => {
          const activeItem = this.getPreviousIndex();
          this.setState({ activeItem });
          this.props.onChange(activeItem);
          this.state.pan.setValue(0);
        });
      return;
    }
    Animated.timing(this.state.pan, { toValue: 0 }).start();
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
      <Animated.View {...this._panResponder.panHandlers}>
        <Animated.View
          style={{
            width,
            transform: [
              { translateX: Animated.add(this.state.pan, negativeAnimatedWidth) },
              { translateY: 0 },
            ],
            top: 0,
            position: 'absolute',
          }}>
          <View>
            {renderItem(previousItem)}
          </View>
        </Animated.View>
        <Animated.View
          style={{
            transform: [
              { translateX: this.state.pan },
              { translateY: 0 },
            ],
            width,
            top: 0,
            position: 'absolute',
          }}>
          <View>
            {renderItem(currentItem)}
          </View>
        </Animated.View>
        <Animated.View
          style={{
            width,
            transform: [
              { translateX: Animated.add(this.state.pan, animatedWidth) },
              { translateY: 0 },
            ],
            top: 0,
            position: 'absolute',
          }}> 
          <View>
            {renderItem(nextItem)}
          </View>
        </Animated.View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
})