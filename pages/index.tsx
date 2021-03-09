import React, { PureComponent } from 'react';
import Head from 'next/head';
import { connect } from 'react-redux';
import _ from 'lodash';
import { promiseLoadTweets } from '../store/actions';
import Tweet from '../components/Tweet';
import { ITweet } from '../types';

interface HomeProps {
  tweets: { [id: string]: ITweet },
  tweetIds: string[],
  oldestTweetId: number | string,
  loadTweets: () => void,
  loadOlderTweets: () => void,
}

export class Home extends PureComponent<HomeProps> {
  componentDidMount() {
    this.props.loadTweets();
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  _handleScroll = () => {
    const { oldestTweetId } = this.props;
    const pageOffset = window.pageYOffset + window.innerHeight;
    if (oldestTweetId != null) {
      const lastElem = document.querySelector<HTMLElement>('#tweets > *:last-child');
      const offset = lastElem.offsetTop + lastElem.clientHeight;
      if (pageOffset > offset) {
        this.props.loadOlderTweets();
      }
    }
  }

  handleScroll = _.debounce(this._handleScroll, 500, {
    maxWait: 1000,
    leading: true,
    trailing: true,
  });

  renderTweet = (id) => {
    const tweet = this.props.tweets[id];
    return <Tweet key={id} {...tweet} />;
  }

  render() {
    const { tweetIds } = this.props;
    return (
      <div>
        <Head>
          <title>Tweets</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
  
        <main className="container max-w-3xl mx-auto">
          <h1 className="text-center text-xl text-blue-500 my-4">
            Tweets
          </h1>
          <div id="tweets">
            {tweetIds.map(id => this.renderTweet(id))}
          </div>
        </main>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { tweets, tweetIds, oldestTweetId } = state.tweets;
  return {
    tweets,
    tweetIds,
    oldestTweetId,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
    loadTweets: () => dispatch(promiseLoadTweets()),
  };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  loadOlderTweets: () => {
    dispatchProps.dispatch(promiseLoadTweets({
      beforeId: stateProps.oldestTweetId
    }));
  }
});

export default connect(
  mapStateToProps, mapDispatchToProps, mergeProps,
)(Home);
