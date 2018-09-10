import React from 'react';
import { Text } from 'react-native';

export class GoogleText extends React.Component {
  render() {
    return <Text {...this.props} style={[this.props.style, { fontFamily: 'google-sans-regular' }]} />;
  }
}
