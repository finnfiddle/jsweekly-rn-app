import React, { Component } from 'react';
import { View, Dimensions, Animated, StyleSheet, TextInput, Platform } from 'react-native';

import SearchResults from './SearchResults';
import { SEARCH_OFFSET } from '../constants/dimensions';
import { YELLOW } from '../constants/colors';

const { height, width } = Dimensions.get('window');

export default class Search extends Component {
  render() {
    const { children, top, onSearch, text, results, showResults, navigation } = this.props;
    return (
      <Animated.View style={{ top }}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            onChangeText={onSearch}
            value={text}
            placeholder='Search'
            placeholderTextColor={YELLOW}
          />
        </View>
        {showResults && (
          <SearchResults articles={results} navigation={navigation} hideResults={!text.length} />
        )}
        {children}
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  searchContainer: {
    height: -SEARCH_OFFSET,
    backgroundColor: 'black',
    paddingBottom: 15,
    paddingTop: 15,
  },
  searchInput: {
    height: -SEARCH_OFFSET - 30,
    color: YELLOW,
    borderColor: YELLOW,
    borderWidth: 1,
    borderRadius: -SEARCH_OFFSET / 2,
    marginLeft: 15,
    marginRight: 15,
    paddingLeft: 15,
    paddingRight: 15,
    fontSize: 20,
    fontFamily: Platform.OS === 'ios' ? 'Avenir' : 'Roboto',
  }
});