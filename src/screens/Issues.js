import React from 'react';
import { View, StyleSheet, Animated, Text } from 'react-native';
import { get, debounce } from 'lodash';
import { connect } from 'react-redux';
import { HeaderBackButton } from 'react-navigation';

import { tokenize, match } from '../util/search';
import IssueCard from '../components/IssueCard';
import Cards from '../components/Cards';
import Search from '../components/Search';
import { YELLOW } from '../constants/colors';
import { SEARCH_OFFSET } from '../constants/dimensions';
// import { TITLE } from '../constants/text';

class IssuesPage extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const isSearching = get(navigation, 'state.params.isSearching');
    const onCancelSearch = get(navigation, 'state.params.onCancelSearch') || (() => {});
    return {
      // header: null,
      headerTitle: '',//isSearching ? TITLE.SEARCH : TITLE.ISSUES, 
      headerStyle: {
        backgroundColor: 'black',
        borderBottomWidth: 0,
      },
      headerTintColor: YELLOW,
      headerLeft: isSearching ? (
        <HeaderBackButton
          onPress={onCancelSearch}
          title="Cancel"
          tintColor={YELLOW}
        />
      ) : null,
    };
  };

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
    this.handlePullTop = this.handlePullTop.bind(this);
    this.handleReleasePullTop = this.handleReleasePullTop.bind(this);
    this.handleCancelSearch = this.handleCancelSearch.bind(this);
    this.handleSearch = debounce(this.handleSearch.bind(this), 500, { maxWait: 2000 });
    props.navigation.setParams({ onCancelSearch: this.handleCancelSearch });
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

  render() {
    const { navigation, issues } = this.props;
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
          <Cards
            items={issues}
            renderItem={(cardData) => (
              <IssueCard
                {...cardData}
                navigation={navigation}
                onScrollStart={this.handleInnerScrollStart}
                onScrollEnd={this.handleInnerScrollEnd}
                onPullTop={this.handlePullTop}
                onReleasePullTop={this.handleReleasePullTop}
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
});

export default connect(state => state)(IssuesPage);
