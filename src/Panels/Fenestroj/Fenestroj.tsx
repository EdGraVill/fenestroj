import * as md5 from 'md5';
import * as React from 'react';
import { ContextMenu, ContextMenuTrigger } from 'react-contextmenu';

import { IFenestro } from '../@types';
import Icons from '../Icons';
import './Fenestroj.css';

interface IFenestrojProps {
  fenestroj: IFenestro[];
  factoryMode: () => void;
}

class Fenestroj extends React.Component<IFenestrojProps> {
  public id: string = md5(`${Date.now()}`);

  public componentWillUnmount() {
    this.props.factoryMode();
  }

  public get contextMenu() {
    return (
      <ContextMenu id={md5(this.id)} />
    );
  }

  public render() {
    return (
      <React.Fragment>
        <div
          className="desktop"
        >
          <ContextMenuTrigger id={md5(this.id)}>
            {this.props.children}
            <Icons />
            {this.contextMenu}
          </ContextMenuTrigger>
        </div>
      </React.Fragment>
    );
  }
}

export default Fenestroj;
