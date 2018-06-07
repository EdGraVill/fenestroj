import * as React from 'react';

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

export class Fenestro extends React.Component<IFenestroProps> {}

export class Fenestroj extends React.Component<{}> {}
