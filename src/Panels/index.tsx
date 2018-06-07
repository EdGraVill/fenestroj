import * as React from 'react';
import { Provider } from 'react-redux';

import createStore from './createStore';
import FenestroContainer from './Fenestro';
import Fenestrojs from './Fenestroj';
import './index.css';

export const Fenestroj = ({ children }: { children: JSX.Element | JSX.Element[] }) => (
  <Provider store={createStore()}>
    <Fenestrojs>
      {children}
    </Fenestrojs>
  </Provider>
);

export const Desktop = Fenestroj;

interface IFenestroProps {
  backgroundColor?: string;
  initialHeight?: number | string;
  initialLeft?: number | string;
  initialTop?: number | string;
  initialWidth?: number | string;
  maxHeight?: number;
  maxWidth?: number;
  minHeight?: number;
  minWidth?: number;
  icon?: string;
  iconTitle?: string;
  title: string;
}

export const Fenestro: React.ComponentClass<IFenestroProps> = FenestroContainer;

export const Window: React.ComponentClass<IFenestroProps> = Fenestro;
