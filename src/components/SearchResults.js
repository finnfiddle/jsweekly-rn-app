import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
  Platform,
} from 'react-native';

import { YELLOW } from '../constants/colors';
import { SEARCH_OFFSET } from '../constants/dimensions';
import Tag from './Tag';
import Announcement from './Announcement';

const { height, width } = Dimensions.get('window');

export default class SearchResults extends Component {
  render() {
    const {
      articles,
      navigation,
      hideResults,
    } = this.props;
    articles.forEach(({ href }) => console.log(href));

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
                onPress={() => navigation.navigate('issue', { issueId: item.issueId, articleIndex: item.index })}
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
    padding: 15,
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
    fontSize: 12,
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