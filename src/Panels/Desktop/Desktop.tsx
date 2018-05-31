import * as md5 from 'md5';
import * as React from 'react';
import { ContextMenu, ContextMenuTrigger } from "react-contextmenu";

import { IPanel } from '../@types';
import './Desktop.css';

interface IDesktopProps {
  panels: IPanel[];
  factoryMode: () => void;
}

class Desktop extends React.Component<IDesktopProps> {
  public get contextMenu() {
    return (
      <React.Fragment>
        <ContextMenuTrigger id={md5('null')}>
          <ContextMenu id={md5('desktop')} />
        </ContextMenuTrigger>
      </React.Fragment>
    );
  }

  public componentWillUnmount() {
    this.props.factoryMode();
  }

  public render() {
    return (
      <React.Fragment>
        <ContextMenuTrigger id={md5('desktop')}>
          <div
            className="desktop"
          >
            {this.props.children}
          </div>
        </ContextMenuTrigger>
        {this.contextMenu}
      </React.Fragment>
    );
  }
}

export default Desktop;
