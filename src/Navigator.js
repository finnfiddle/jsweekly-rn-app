import { createStackNavigator } from 'react-navigation';

import IssuesScreen from './screens/Issues';
import IssueScreen from './screens/Issue';
import ArticleScreen from './screens/Article';

export default createStackNavigator({
  issues: {
    screen: IssuesScreen,
  },
  issue: {
    screen: IssueScreen,
  },
  article: {
    screen: ArticleScreen,
  },
});