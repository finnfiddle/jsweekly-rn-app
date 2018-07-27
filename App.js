/* global require */
import React from 'react';
import { Provider } from 'react-redux';
import { Font, AppLoading } from 'expo';
import Sentry from 'sentry-expo';

import Navigator from './src/Navigator';
import configureStore from './src/util/configureStore';
import scrape from './src/util/scrape';

const { store, persistor } = configureStore();

Sentry.config('https://6f6918124ee141c898bec94dbde81dd2@sentry.io/1250794').install(); 

export default class App extends React.Component {
  state = {
    fontsDidLoad: false,
  };
    
  constructor(props) {
    super(props);
    this.handleLoadFonts();
    scrape(store);
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
    const { fontsDidLoad } = this.state;
    
    if (!fontsDidLoad) return <AppLoading />;

    return ( 
      <Provider store={store} persistor={persistor}> 
        <Navigator />
      </Provider>
    );
  }
}
