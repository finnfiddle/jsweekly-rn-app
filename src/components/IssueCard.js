import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SectionList,
  TouchableWithoutFeedback,
} from 'react-native';
import moment from 'moment';

import { YELLOW } from '../constants/colors';
import { CATEGORY } from '../constants/text';
import Tag from './Tag';
import Puller from './Puller';

const { height, width } = Dimensions.get('window');

export default class IssueCard extends Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
    date: PropTypes.string.isRequired,
    articles: PropTypes.array.isRequired,
    onScrollStart: PropTypes.func.isRequired,
    onScrollEnd: PropTypes.func.isRequired,
    navigation: PropTypes.object.isRequired,
    onPullTop: PropTypes.func.isRequired,
    onReleasePullTop: PropTypes.func.isRequired,
  }

  render() {
    const {
      id,
      date,
      articles,
      onScrollStart,
      onScrollEnd,
      navigation,
      onPullTop,
      onReleasePullTop,
    } = this.props;
  
    const articlesMap = articles.reduce((acc, article) => ({
      ...acc,
      [article.category]: (acc[article.category] || []).concat(article),
    }), {});

    const sections = Object.keys(articlesMap)
      .reduce((acc, key) =>
        articlesMap[key].length ? [
          ...acc,
          { title: CATEGORY[key], data: articlesMap[key] },
        ] : acc, []);

    return (
      <View style={styles.container}>
        <View style={styles.inner}> 
          <Puller onPull={onPullTop} onRelease={onReleasePullTop}>
            <View style={styles.header}>
              <Text style={styles.date}>{moment(date).format('MMMM DD, YYYY').toUpperCase()}</Text>
              <Text style={styles.title}>{`Issue #${id}`}</Text>
            </View>
          </Puller>
          <TouchableWithoutFeedback>
            <View style={styles.content}>
              <SectionList 
                renderSectionHeader={({section: {title}}) => title ? (
                  <View style={styles.sectionHeaderContainer}>
                    <Text style={styles.sectionHeaderText}>{title}</Text>
                  </View>
                ) : null}
                sections={sections}
                keyExtractor={({ href }) => href}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => navigation.navigate('issue', { issueId: id, articleIndex: item.index })}
                  >
                    <View style={styles.listItem}>
                      <View>
                        <Text style={styles.listItemText}>
                          {item.title}
                        </Text>
                      </View>
                      {item.isVideo && (
                        <Tag style={styles.tag}>video</Tag>
                      )}
                      {item.isSponsor && (
                        <Tag style={styles.tag}>sponsor</Tag>
                      )}
                    </View>
                  </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                directionalLockEnabled
                pinchGestureEnabled={false}
                stickySectionHeadersEnabled={false}
                onScrollBeginDrag={onScrollStart}
                onScrollEndDrag={onScrollEnd}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height,
    width,
    backgroundColor: YELLOW,
  }, 
  inner: {
    flex: 1,
    paddingBottom: 200,
  },
  header: {
    backgroundColor: 'black',
    paddingTop: 15,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 15,
  },
  title: {
    fontSize: 40,
    fontFamily: 'h1',
    color: YELLOW,
  },
  date: {
    fontSize: 12,
    fontFamily: 'bold',
    color: YELLOW,
  },
  content: {
    paddingRight: 15,
    paddingBottom: 15,
    paddingLeft: 15,
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
    marginBottom: 5,
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: 'black',
  },
  sectionHeaderContainer: {
    paddingTop: 30,
    paddingBottom: 15,
  },
  sectionHeaderText: {
    fontFamily: 'h1',
    fontSize: 16,
  },
  tag: {
    marginTop: 0,
  },
});