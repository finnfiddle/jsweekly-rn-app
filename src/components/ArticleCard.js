import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity } from 'react-native';

import { YELLOW } from '../constants/colors';
import { CATEGORY } from '../constants/text';
import Tag from './Tag';

const { height, width } = Dimensions.get('window');

export default class ArticleCard extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    desc: PropTypes.string.isRequired,
    onScrollStart: PropTypes.func.isRequired,
    onScrollEnd: PropTypes.func.isRequired,
    issueId: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired,
    source: PropTypes.string.isRequired,
    isVideo: PropTypes.bool.isRequired,
    isSponsor: PropTypes.bool.isRequired,
    category: PropTypes.string.isRequired,
  }
  
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
          <View style={{ flexGrow: 1, display: 'flex', flex: 1 }}>
            <Text style={styles.title}>{title}</Text>
            {!!desc && <Text style={styles.desc}>{desc}</Text>}
            <Text style={styles.source}>
              {`- ${source}`}
            </Text>
            <View style={styles.tagsContainer}>
              {category !== 'main' && (
                <Tag style={styles.tag}>{CATEGORY[category]}</Tag>
              )}
              {!!isVideo && (
                <Tag style={styles.tag}>video</Tag>
              )}
              {!!isSponsor && (
                <Tag style={styles.tag}>sponsor</Tag>
              )}
            </View>
          </View>
          <View style={styles.button}>
            <TouchableOpacity
              onPress={() => navigation.navigate('article', { issueId, articleIndex: index })}
            >
              <View style={styles.buttonInner}>
                <Text style={styles.buttonText}>View Online</Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    minHeight: height - 152,
    backgroundColor: YELLOW,
  },
  inner: {
    display: 'flex',
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 15,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 30,
    width: width,
  },
  title: {
    fontSize: 22,
    fontFamily: 'bold',
    marginBottom: 20,
  },
  desc: {
    fontSize: 16,
    fontFamily: 'light',
    marginBottom: 10,
  },
  source: {
    color: 'black',
    fontFamily: 'boldItalic',
    fontSize: 16,
    marginBottom: 20,
  },
  tagsContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  button: {
    height: 50,
    display: 'flex',
    borderColor: 'black',
    borderWidth: 1,
    backgroundColor: YELLOW,
    marginBottom: 15,
    width: width - 30,
    minWidth: width - 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    bottom: 0,
  },
  buttonInner: {
    flex: 1,
    height: 50,
    width: width - 30,
    paddingTop: 15,
    paddingBottom: 15,
  },
  buttonText: {
    color: 'black',
    fontFamily: 'bold',
    textAlign: 'center',
  },
});