/* global require, Promise */
import React from 'react';
import { Provider } from 'react-redux';
import { Font, AppLoading } from 'expo';
import { NetInfo } from 'react-native';

import Navigator from './src/Navigator';
import scrape from './src/util/scrape';
import configureStore from './src/util/configureStore';
import Announcement from './src/components/Announcement'; 

const { store, persistor } = configureStore();

/* use these to clear the cached data */
// persistor.flush(); 
// persistor.purge();
// AsyncStorage.clear();

const { latestIssueAdded, totalIssues, unscrapeableIssues } = store.getState();
const NO_CONNECTION = 'none';

export default class App extends React.Component {
  state = {
    hasScraped: false,
    hasTriedScraping: false,
    latestIssueAdded,
    totalIssues,
    unscrapeableIssues,
    fontsDidLoad: false,
  };
    
  constructor(props) {
    super(props);
    store.subscribe(() => {
      const { latestIssueAdded, totalIssues, unscrapeableIssues } = store.getState();
      this.setState({ latestIssueAdded, totalIssues, unscrapeableIssues });
    });
    this.handleScrape = this.handleScrape.bind(this);
    this.handleLoadFonts();
    this.handleScrape();
  }

  handleScrape(connectionInfo) {
    new Promise(resolve => {
      if (connectionInfo) {
      resolve(connectionInfo);
        return;
      }
      return NetInfo.getConnectionInfo().then(resolve);
    })
    .then((resolveConnectionInfo) => {
      if (resolveConnectionInfo.type === NO_CONNECTION || resolveConnectionInfo.type === 'unknown') {
        if (this.state.hasTriedScraping) return;
        this.setState({ hasTriedScraping: true });
        NetInfo.addEventListener('connectionChange', this.handleScrape);
        return;
      }
      scrape(store).then(() => {
        this.setState({ hasScraped: true });
        NetInfo.removeEventListener('connectionChange', this.handleScrape);
      })
      .catch(error => {
        console.log(error);
      });
    });
  }

  handleLoadFonts() {
    Font.loadAsync({
      default: require('./assets/fonts/roboto-mono/RobotoMono-Regular.ttf'),
      bold: require('./assets/fonts/roboto-mono/RobotoMono-Bold.ttf'),
      boldItalic: require('./assets/fonts/roboto-mono/RobotoMono-BoldItalic.ttf'),
      light: require('./assets/fonts/roboto-mono/RobotoMono-Light.ttf'),
      h1: require('./assets/fonts/rubik/Rubik-Black.ttf'),
    })
    .then(() => {
      this.setState({ fontsDidLoad: true });
    });
  }
  
  render() {
    const { hasScraped, hasTriedScraping, fontsDidLoad } = this.state;
    if (!fontsDidLoad) return <AppLoading />;
    return (hasScraped || hasTriedScraping) ? ( 
      <Provider store={store} persistor={persistor}> 
        <Navigator />
      </Provider>
    ) : (
      <Announcement
        message={`scraping ${this.state.latestIssueAdded}/${this.state.totalIssues === 'Y' ? this.state.totalIssues : this.state.totalIssues - this.state.unscrapeableIssues.length} issues`}
      />
    );
  }
}
