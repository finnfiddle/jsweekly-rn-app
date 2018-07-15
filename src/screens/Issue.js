import React, { Component } from 'react';
import { View, StyleSheet, Animated, Text } from 'react-native';
import { get } from 'lodash';
import { connect } from 'react-redux';
import moment from 'moment';

import Cards from '../components/Cards';
import ArticleCard from '../components/ArticleCard';
import { YELLOW } from '../constants/colors';
import Search from '../components/Search';
import Puller from '../components/Puller';
import { SEARCH_OFFSET } from '../constants/dimensions';
import { tokenize, match } from '../util/search';

class IssuePage extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: '',//navigation.state.params.title,
    headerStyle: {
      backgroundColor: 'black',
      borderBottomWidth: 0,
    },
    headerTintColor: YELLOW,
  });

  state = {
    canSwipe: true,
    searchTop: new Animated.Value(SEARCH_OFFSET),
    showSearchResults: false,
    searchResults: [],
    searchText: '',
  }

  constructor(props) {
    super(props);
    this.handleInnerScrollStart = this.handleInnerScrollStart.bind(this);
    this.handleInnerScrollEnd = this.handleInnerScrollEnd.bind(this);
    this.handleCancelSearch = this.handleCancelSearch.bind(this);
    this.handlePullTop = this.handlePullTop.bind(this);
    this.handleReleasePullTop = this.handleReleasePullTop.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  componentDidMount() {
    const issue = this.getIssue();
    if(!issue) return;
    this.props.navigation.setParams({
      title: `issue #${issue.key}`,
    });
  }

  handleInnerScrollStart() {
    this.setState({ canSwipe: false });
  }

  handleInnerScrollEnd() {
    this.setState({ canSwipe: true });
  }

  handlePullTop(event, gestureState) {
    const dragDelta = SEARCH_OFFSET + gestureState.dy;
    const current = this.state.searchTop.__getValue();
    if (dragDelta > current) {
      this.state.searchTop.setValue(Math.min(dragDelta, 0));
    }
    else if (dragDelta < SEARCH_OFFSET) {
      if (current === SEARCH_OFFSET) return;
      this.state.searchTop.setValue(Math.max(dragDelta - SEARCH_OFFSET, SEARCH_OFFSET));
    }
  }

  handleReleasePullTop() {
    if (this.state.searchTop.__getValue() > SEARCH_OFFSET / 2) {
      Animated.timing(this.state.searchTop, { toValue: 0 }).start();
      this.setState({ showSearchResults: true });
      this.props.navigation.setParams({ isSearching: true });
      return;
    }
    this.handleCancelSearch();
  }

  handleCancelSearch() {
    Animated.timing(this.state.searchTop, { toValue: SEARCH_OFFSET }).start();
    this.props.navigation.setParams({ isSearching: false });
    this.setState({ showSearchResults: false });
  }

  handleSearch(text) {
    const tokens = tokenize(text);
    this.setState({
      searchText: text,
      searchResults: this.props.articles.filter(({ fulltext }) => match(tokens, fulltext)),
    });
  }

  getIssue() {
    const id = get(this.props, 'navigation.state.params.issueId');
    if (!id) return null;
    return this.props.issues.filter(issue => id === issue.id)[0];
  }
  
  render() {
    const { navigation } = this.props;
    const issue = this.getIssue();
    if(!issue) return null;
    const articleIndex = get(this.props, 'navigation.state.params.articleIndex') || 0;
    const articles = [
      ...issue.articles.slice(articleIndex),
      ...issue.articles.slice(0, articleIndex),
    ];
    let { searchTop, showSearchResults, searchText, searchResults } = this.state;

    return (
      <View style={styles.container}>
        <Search
          top={searchTop}
          onSearch={this.handleSearch}
          text={searchText}
          results={searchResults}
          showResults={showSearchResults}
          navigation={navigation}
        >
          <Puller onPull={this.handlePullTop} onRelease={this.handleReleasePullTop}>
            <View style={styles.header}>
              <Text style={styles.date}>{moment(issue.date).format('MMMM DD, YYYY').toUpperCase()}</Text>
              <Text style={styles.title}>{`Issue #${issue.id}`}</Text>
            </View>
          </Puller>
          <Cards
            items={articles}
            renderItem={(articleData) => (
              <ArticleCard
                {...articleData}
                navigation={navigation}
                onScrollStart={this.handleInnerScrollStart}
                onScrollEnd={this.handleInnerScrollEnd}
                issueId={get(this.props, 'navigation.state.params.issueId')}
              />
            )}
          />
        </Search>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: YELLOW },
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
    fontSize: 14,
    fontFamily: 'bold',
    color: YELLOW,
  },
});

export default connect(state => state)(IssuePage);
