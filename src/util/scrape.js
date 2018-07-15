import cheerio from 'react-native-cheerio';
import moment from 'moment';
import Promise from 'bluebird';
import emojiRegex from 'emoji-regex';

import { ADD_ISSUE, ADD_ARTICLE, COUNT_ISSUES, UNSCRAPEABLE_ISSUE } from '../util/configureStore';

const ISSUE_VERSION_1 = 1;
const ISSUE_VERSION_2 = 2;
const ISSUE_VERSION_3 = 3;
const CAT_MAIN = 'main';
const CAT_NEWS = 'news';
const CAT_JOBS = 'jobs';
const CAT_TUTORIALS = 'tutorials';
const CAT_CODE_TOOLS = 'code';
const CAT_SCREENCASTS = 'screencasts';
const EMOJI_REGEX = emojiRegex();

const getIssueVersion = $ => {
  if($('.el-masthead').length) return ISSUE_VERSION_2;
  if($('.credit').length && $('.summary').length) return ISSUE_VERSION_3;
  return ISSUE_VERSION_1;
};

const parseDate = dateText => {
  const dash = dateText.indexOf('—');
  return moment(dateText.slice(dash + 2), 'MMMM D, YYYY').toDate();
};

const extractDate = ($, issueVersion) => {
  switch (issueVersion) {
    case ISSUE_VERSION_1:
      return parseDate($('.issue-html > table > tbody > tr > td > table > tbody > tr:first-of-type > td > table > tbody > tr > td > table:nth-of-type(2) span').text());
    case ISSUE_VERSION_2:
      return parseDate($('#content > table:first-of-type > tbody > tr > td:first-of-type > p').text());
  }
};

const extractCategory = ($, el, issueVersion) => {
  let heading;
  switch (issueVersion) {
    case ISSUE_VERSION_1: {
      if(!el) return CAT_CODE_TOOLS;
      const category = el.text();
      if (category.toLowerCase().indexOf('news') > -1) return CAT_NEWS;
      if (category.toLowerCase().indexOf('tutorial') > -1) return CAT_TUTORIALS;
      return CAT_CODE_TOOLS;
    }
    case ISSUE_VERSION_2: {
      const headings = $(el).prevAll('.el-heading');
      if (!headings.length) return CAT_MAIN;
      heading = $(headings.get(0)).find('p').text();
      break;
    }
  }
  if (heading.toLowerCase().indexOf('jobs') > -1) return CAT_JOBS;
  if (heading.toLowerCase().indexOf('tutorials') > -1) return CAT_TUTORIALS;
  if (heading.toLowerCase().indexOf('code') > -1) return CAT_CODE_TOOLS;
  if (heading.toLowerCase().indexOf('screencasts') > -1) return CAT_SCREENCASTS;
};

const extractMeta = ($el, issueVersion) => {
  switch(issueVersion) {
    case ISSUE_VERSION_1: {
      return {};
    }
    case ISSUE_VERSION_2: {
      const sourceEl = $el.find('.name')
        .contents()
        .get()
        .filter(({ nodeType }) => nodeType === 3)[0];
      return {
        isVideo: $el.hasClass('video'),
        isSponsor: Boolean($el.find('.tag-sponsor').length),
        source: sourceEl ? sourceEl.data.trim() : null,
      };
    }
  }
};

const cleanEmojis = text => {
  const matches = [];
  let match;
  while (match = EMOJI_REGEX.exec(text)) matches.push(match);
  return matches.reverse().reduce((acc, [emoji]) => acc.replace(emoji, ''), text).trim();
};

const extractArticles = ($, issueVersion) => {
  switch (issueVersion) {
    case ISSUE_VERSION_1: {
      const container = $('.issue-html > table > tbody > tr > td > .container > tbody > tr:nth-of-type(2) > td');
      const children = container.children().get();
      const jobsTitleIndex = children.reduce((acc, el, index) =>
        ($(el).is('p') && $(el).text().indexOf('Jobs') > -1) ? index: acc
      , -1);
      const mainArticlePieces = children.slice(0, jobsTitleIndex - 1);
      const breakPositions = children.reduce((acc, el, i) =>
        $(el).is('br') ? acc.concat(i) : acc
      , []);

      const mainArticles = mainArticlePieces.reduce((acc, el, i) => {
        const result = acc.slice();
        if(breakPositions.includes(i)) {
          result.push([]);
          return result;
        }
        if (!$(el).find('img').length) { 
          result[result.length - 1].push(el);
        }
        return result;
      }, [[]])
      .reduce((acc, section, index) => {
        if(!section.length) return acc;
        const [title, desc, source] = section.reduce((acc, el) => {
          const text = $(el).text();
          return text.length ? acc.concat(text.trim()) : acc;
        }, []);
        const cleanedSource = (source || '').replace('Sponsor', '').trim();
        return acc.concat({
          href: $(section[0]).find('a').attr('href'),
          title,
          desc,
          source: cleanedSource,
          isSponsor: Boolean((source || '').toLowerCase().indexOf('sponsor') > -1),
          category: CAT_MAIN,
          index,
          isVideo: false,
          get fulltext() {
            return `${this.title} ${this.desc} ${this.source}`;
          },
        });
      }, []);

      const mainArticlesCount = mainArticles.length;

      const jobArticlesContainer = children.filter(el => $(el).is('ul'))[0];
      const jobArticles = (jobArticlesContainer ? jobArticlesContainer.children : [])
        .filter(el => $(el).is('li'))
        .map((el, i) => {
          const $el = $(el);
          const title = $el.find('a').first();
          return {
            href: title.attr('href'),
            title: title.text().trim(),
            desc: $el.find('span').eq(0).text().trim(),
            source: $el.find('span').eq(1).text().trim(),
            isSponsor: true,
            category: CAT_JOBS,
            index: mainArticlesCount + i,
            isVideo: false,
            get fulltext() {
              return `${this.title} ${this.desc} ${this.source}`;
            },
          };
        });

      const inBriefTitleIndex = children.reduce((acc, el, index) =>
        ($(el).is('p') && $(el).text().indexOf('In Brief') > -1) ? index: acc
      , -1);
      const inBriefArticlePieces = children.slice(inBriefTitleIndex + 1);
      const inBriefArticles = inBriefArticlePieces
        .reduce((acc, el, index) => {
          const $el = $(el);
          if(!$el.is('p')) return acc;
          const articlePieces = $el.children();
          const breakPosition = articlePieces.index($el.find('br'));
          const aboveFold = articlePieces.slice(0, breakPosition);
          const belowFold = articlePieces.slice(breakPosition + 1).filter((index, el) =>
            $(el).is('span')
          );
          const titleEl = aboveFold.eq(0);
          const categoryEl = aboveFold.eq(1);

          return acc.concat({
            href: titleEl.attr('href'),
            title: titleEl.text().trim(),
            desc: belowFold.length > 1 ? belowFold.eq(0).text() : '',
            source: belowFold.eq(belowFold.length - 1)
              .contents()
              .get()
              .map((sourceEl) => sourceEl.nodeType === 3 ? sourceEl.data : $(sourceEl).text())
              .join('')
              .replace('Sponsor', '')
              .trim(),
            isSponsor: Boolean(
              belowFold.eq(belowFold.length - 1).text().toLowerCase().indexOf('sponsor') > -1
            ),
            category: extractCategory($, categoryEl, ISSUE_VERSION_1),
            index: mainArticles.length + jobArticles.length + index,
            isVideo: false,
            get fulltext() {
              return `${this.title} ${this.desc} ${this.source}`;
            },
          });
        }, []);

      return [ ...mainArticles, ...jobArticles, ...inBriefArticles ];
    }
    case ISSUE_VERSION_2:
      return $('.issue-html .el-item').map((index, el) => {
        const title = cleanEmojis($(el).find('.mainlink a').text());
        const desc = $(el).find('.desc')
          .contents()
          .get()
          .slice(1)
          .map((el) => el.nodeType === 3 ? el.data : $(el).text())
          .join('')
          .slice(3);
        const meta = extractMeta($(el), issueVersion);
        return {
          href: $(el).find('.mainlink a').attr('href'),
          title,
          desc,
          ...meta,
          category: extractCategory($, el, issueVersion),
          index,
          fulltext: `${title} ${desc} ${meta.source}`,
        };
      }).get();
  }
};

const x = link => fetch(link).then(response => response.text().then(html => ({ html, response })));

const scrapeLink = (link, tries = 0) => {
  return tries < 10 ?
    (new Promise(resolve => setTimeout(resolve, 1000)))
    .then(() => x(link))
    .then(({ response, html }) =>
      response.status === 200 ?
        html :
        scrapeLink(link, tries + 1)
    ) : null;
};

export default (store) =>
  x("https://javascriptweekly.com/issues")
    .then(res => cheerio.load(res.html)) 
    .then($ =>
      $('.issue')
        .map((i, link) => {
          const name = $(link).text();
          const hash = name.indexOf('#');
          const dash = name.indexOf('—');
          return parseInt(name.slice(hash + 1, dash - 1));
        })
        .get()
    )
    .then(ids => {
      const { issues } = store.getState();
      store.dispatch({
        type: COUNT_ISSUES,
        payload: ids.length,
      });
      if (!issues.length) return ids;
      const existingIds = issues.map(({ id }) => id);
      return ids.filter(id => !existingIds.includes(id));
    })
    .then(ids => {
      return Promise.map(ids, id => {
        const link = `https://javascriptweekly.com/issues/${id}`;
        return scrapeLink(link)
          .then((data) => {
            const $ = cheerio.load(data);
            const issueVersion = getIssueVersion($);
            if(issueVersion === ISSUE_VERSION_3) {
              store.dispatch({
                type: UNSCRAPEABLE_ISSUE,
                payload: id,
              });
            } else {
              const payload = {
                link,
                id,
                key: `${id}`,
                version: issueVersion,
                date: extractDate($, issueVersion),
                articles: extractArticles($, issueVersion),
              };
              store.dispatch({
                type: ADD_ISSUE,
                payload,
              });
              return payload;
            }
            return null;
          })
          .then(issue => {
            if(issue) {
              issue.articles.forEach(article => {
                store.dispatch({ type: ADD_ARTICLE, payload: { ...article, issueId: issue.id } });
              });
            }
            return null;
          });
        }, { concurrency: 10 });
    });
