import * as React from 'react';
import { Provider } from 'react-redux';

import createStore from './createStore';
import Desktop from './Desktop';
import PanelContainer from './Panel';

const Panels = ({ children }: { children: JSX.Element | JSX.Element[] }) => (
  <Provider store={createStore()}>
    <Desktop>
      {children}
    </Desktop>
  </Provider>
);

export default Panels;

interface IPanelProps {
  backgroundColor?: string;
  initialHeight?: number | string;
  initialLeft?: number | string;
  initialTop?: number | string;
  initialWidth?: number | string;
  maxHeight?: number;
  maxWidth?: number;
  minHeight?: number;
  minWidth?: number;
  title: string;
}

export const Panel: React.ComponentClass<IPanelProps> = PanelContainer;
