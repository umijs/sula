import React from 'react';
import Media from 'react-media';
import breakpoints from './utils/breakpoints';

export default class MediaQueries extends React.Component {
  matchedPoint: string;
  render() {
    return (
      <Media queries={breakpoints}>
        {(matches) => {
          const points = Object.keys(matches);
          for (let i = 0, len = points.length; i < len; i += 1) {
            const point = points[i];
            if (matches[point]) {
              this.matchedPoint = point;
              return this.props.children(point);
            }
          }
          return this.props.children(this.matchedPoint);
        }}
      </Media>
    );
  }
}
