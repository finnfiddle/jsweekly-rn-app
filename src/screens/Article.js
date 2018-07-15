import React, { Component } from 'react';
import { StyleSheet, WebView } from 'react-native';
import { get } from 'lodash';
import { connect } from 'react-redux';

import { YELLOW } from '../constants/colors';

class ArticlePage extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: navigation.state.params.title,
    headerStyle: {
      backgroundColor: 'black',
      borderBottomWidth: 0,
    },
    headerTintColor: YELLOW,
  });

  componentDidMount() {
    const article = this.getArticle();
    if(!article) return;
    this.props.navigation.setParams({
      title: article.title,
    });
  }

  getArticle() {
    const issueId = get(this.props, 'navigation.state.params.issueId');
    if (!issueId) return null;
    const issue = this.props.issues.filter(issue => issueId === issue.id)[0];
    const articleIndex = get(this.props, 'navigation.state.params.articleIndex') || 0;
    return issue.articles[articleIndex];
  }

  render() {
    const article = this.getArticle();
    if(!article) return null;
    return (
      <WebView
        source={{uri: article.href}}
        style={styles.container}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});

export default connect(state => state)(ArticlePage);
