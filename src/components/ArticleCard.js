import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity } from 'react-native';

import { YELLOW } from '../constants/colors';
import { CATEGORY } from '../constants/text';
import Tag from './Tag';

const { height, width } = Dimensions.get('window');

export default class ArticleCard extends Component {
  render() {
    const {
      title,
      desc,
      onScrollStart,
      onScrollEnd,
      navigation,
      issueId,
      index,
      source,
      isVideo,
      isSponsor,
      category,
    } = this.props;
    return (
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.inner}
          onScrollBeginDrag={onScrollStart}
          onScrollEndDrag={onScrollEnd}
        >
          <View>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.source}>
              {`- ${source}`}
            </Text>
            {desc && <Text style={styles.desc}>{desc}</Text>}
            <View>
              {category !== 'main' && (
                <Tag style={styles.tag}>{CATEGORY[category]}</Tag>
              )}
              {isVideo && (
                <Tag style={styles.tag}>video</Tag>
              )}
              {isSponsor && (
                <Tag style={styles.tag}>sponsor</Tag>
              )}
            </View>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('article', { issueId, articleIndex: index })}
          >
            <View style={styles.button}>
              <Text style={styles.buttonText}>View Online</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    minHeight: height - 170,
    // minWidth: width,
    // width,
    backgroundColor: YELLOW,
  },
  inner: {
    display: 'flex',
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 15,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 50,
    width: width - 30,
    minWidth: width - 30,
  },
  title: {
    fontSize: 18,
    fontFamily: 'bold',
    marginBottom: 20,
  },
  desc: {
    fontSize: 14,
    fontFamily: 'light',
    marginBottom: 10,
  },
  source: {
    color: 'black',
    fontFamily: 'boldItalic',
    fontSize: 14,
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'black',
    paddingTop: 10,
    paddingBottom: 10,
    width: width - 30,
    minWidth: width - 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: YELLOW,
    fontFamily: 'bold',
    textAlign: 'center',
  },
});