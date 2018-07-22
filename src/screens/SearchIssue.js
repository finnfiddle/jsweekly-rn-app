import React, { Component } from 'react';
import PropTypes from 'prop-types';
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

class SearchIssuePage extends Component {
  static propTypes = {
    articles: PropTypes.array.isRequired,
    issues: PropTypes.array.isRequired,
    navigation: PropTypes.object.isRequired,
    searchText: PropTypes.string,
  }

  static navigationOptions = () => ({
    headerTitle: '',
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
    this.handleSwipe = this.handleSwipe.bind(this);
  }

  componentDidMount() {
    const searchText = get(this.props, 'navigation.state.params.searchText') || '';
    const tokens = tokenize(searchText);
    this.setState({
      searchResults: this.props.articles.filter(({ fulltext }) => match(tokens, fulltext)),
    }, () => {
      this.handleSwipe();
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

  handleSwipe(activeArticle = 0) {
    if (!this.state.searchResults.length) return;

    const { issues } = this.props;

    const issue = issues.filter(({ id }) =>
      this.state.searchResults[activeArticle].issueId === id
    )[0];
    
    this.setState({ issue });
  }

  getArticles() {
    const searchText = get(this.props, 'navigation.state.params.searchText') || '';
    const tokens = tokenize(searchText);
    return this.props.articles.filter(({ fulltext }) => match(tokens, fulltext));
  }
  
  render() {
    const { navigation } = this.props;
    const { issue } = this.state;

    if(!issue) return null;
    
    const articles = this.getArticles();

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
            onChange={this.handleSwipe}
            renderItem={(articleData) => (
              <ArticleCard
                {...articleData}
                navigation={navigation}
                onScrollStart={this.handleInnerScrollStart}
                onScrollEnd={this.handleInnerScrollEnd}
                issueId={issue.id}
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
    fontSize: 12,
    fontFamily: 'bold',
    color: YELLOW,
  },
});

export default connect(state => state)(SearchIssuePage);
