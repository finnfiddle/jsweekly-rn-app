import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
} from 'react-native';

import { YELLOW } from '../constants/colors';
import { SEARCH_OFFSET } from '../constants/dimensions';
import Tag from './Tag';
import Announcement from './Announcement';

const { height, width } = Dimensions.get('window');

export default class SearchResults extends Component {
  static propTypes = {
    articles: PropTypes.array.isRequired,
    navigation: PropTypes.object.isRequired,
    hideResults: PropTypes.bool.isRequired,
    searchText: PropTypes.string.isRequired,
  }

  render() {
    const {
      articles,
      navigation,
      hideResults,
      searchText,
    } = this.props;

    return (
      <View
        style={styles.container}
      >
        {(articles.length && !hideResults) ? (
          <FlatList
            data={articles}
            keyExtractor={({ href }) => href}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('searchIssue', {
                    searchText,
                    articleIndex: item.index,
                  })}
              >
                <View style={styles.listItem}>
                  <View>
                    <Text style={styles.listItemText}>
                      {item.title}
                    </Text>
                  </View>
                  {item.isVideo && (
                    <Tag>video</Tag>
                  )}
                  {item.isSponsor && (
                    <Tag>sponsor</Tag>
                  )}
                </View>
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            directionalLockEnabled
            pinchGestureEnabled={false}
            stickySectionHeadersEnabled={false}
          />
        ) : (
          <Announcement message='' icon='search' />
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    backgroundColor: YELLOW,
    top: -SEARCH_OFFSET,
    width,
    height: height + SEARCH_OFFSET,
    zIndex: 9,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 100,
  },
  listItem: {
    paddingTop: 15,
    paddingBottom: 15,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  listItemText: {
    fontSize: 16,
    display: 'flex',
    marginRight: 4,
    fontFamily: 'default',
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: 'black',
  },
});