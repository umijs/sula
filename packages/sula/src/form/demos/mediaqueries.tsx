import React from 'react';
import { MediaQueries } from '..';

export default class MediaQueriesDemo extends React.Component {
  render() {
    return (
      <MediaQueries>
        {(match) => {
          return <div>{match}</div>;
        }}
      </MediaQueries>
    );
  }
}
