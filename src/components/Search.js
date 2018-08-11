import React, { Component } from 'react';
import { View, Animated, StyleSheet, TextInput } from 'react-native';
import PropTypes from 'prop-types';

import SearchResults from './SearchResults';
import { SEARCH_OFFSET } from '../constants/dimensions';
import { YELLOW } from '../constants/colors';


export default class Search extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
    top: PropTypes.object.isRequired,
    onSearch: PropTypes.func.isRequired,
    text: PropTypes.string.isRequired,
    results: PropTypes.array.isRequired,
    showResults: PropTypes.bool.isRequired,
  }

  render() {
    const {
      children,
      top,
      onSearch,
      text,
      results,
      showResults,
      navigation,
    } = this.props;

    return (
      <Animated.View style={{ transform: [ { translateY: top } ]}}>
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
          <SearchResults
            articles={results}
            navigation={navigation}
            hideResults={!text.length}
            searchText={text}
          />
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
    fontSize: 16,
    fontFamily: 'light',
  }
});