import { createStackNavigator } from 'react-navigation';

import IssuesScreen from './screens/Issues';
import IssueScreen from './screens/Issue';
import SearchIssueScreen from './screens/SearchIssue';
import ArticleScreen from './screens/Article';

export default createStackNavigator({
  issues: {
    screen: IssuesScreen,
  },
  issue: {
    screen: IssueScreen,
  },
  searchIssue: {
    screen: SearchIssueScreen,
  },
  article: {
    screen: ArticleScreen,
  },
});