import 'react-native';
import React from 'react';
import { GoogleText } from '../StyledText';
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const tree = renderer.create(<GoogleText>Snapshot test!</GoogleText>).toJSON();

  expect(tree).toMatchSnapshot();
});
