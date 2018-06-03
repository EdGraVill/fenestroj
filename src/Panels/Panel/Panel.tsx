import * as md5 from 'md5';
import * as React from 'react';

import {
  IPanel,
  IPanelActions,
} from "../@types";
import Control from './Control';
import './Panel.css';

interface IPanelProps extends IPanelActions {
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
  panels: IPanel[];
}

interface IPanelState {
  height: number;
  left: number;
  top: number;
  width: number;
}

class Panel extends React.Component<IPanelProps, IPanelState> {
  public state = {
    height: 0,
    left: 0,
    top: 0,
    width: 0,
  }

  public id: string = md5(`${Date.now()}+${JSON.stringify(this.props)}`);
  public startPositions: {
    height: number,
    left: number,
    top: number,
    width: number,
  };
  public startMouse: {
    x: number,
    y: number,
  }
  public thisPanel: HTMLDivElement;
  public mouseMoveListener: (event: MouseEvent) => void;
  public resizeSide?: string = undefined;

  public componentDidMount() {
    const {
      addPanel,
      initialHeight,
      initialLeft,
      initialTop,
      initialWidth,
      title,
    } = this.props;

    addPanel({
      height: initialHeight || 500,
      id: this.id,
      left: initialLeft || `calc(50% - ${initialWidth || 375}px)`,
      title,
      top: initialTop || `calc(50% - ${initialHeight || 250}px)`,
      width: initialWidth || 750,
    });
  }

  public componentDidUpdate(prevProps: IPanelProps) {
    const { panels, movePanel } = this.props;

    if (panels.length !== prevProps.panels.length) {
      movePanel({
        id: this.id,
        left: this.thisPanel.getBoundingClientRect().left,
        top: this.thisPanel.getBoundingClientRect().top,
      });

      this.setInitial({
        height: this.thisPanel.getBoundingClientRect().height,
        left: this.thisPanel.getBoundingClientRect().left,
        top: this.thisPanel.getBoundingClientRect().top,
        width: this.thisPanel.getBoundingClientRect().width,
      });
      
      if (this.mouseMoveListener) {
        document.removeEventListener('mousemove', this.mouseMoveListener, false);
      }

      this.mouseMoveListener = (event: MouseEvent) => {
        this.move({ x: event.clientX, y: event.clientY });
        this.resize({ x: event.clientX, y: event.clientY });
      };
      
      document.addEventListener('mousemove', this.mouseMoveListener, false);

      
      document.addEventListener('mouseup', (event) => {
        this.stopMoving(event);
        this.stopResizing(event);
      });
    }
  }

  public componentWillUnmount() {
    const { removePanel } = this.props;

    removePanel(this.id);
    document.removeEventListener('mousemove', this.mouseMoveListener, false);
  }

  public startMoving = (event: React.MouseEvent<HTMLDivElement>) => {
    const { panels, startMoving, moveToTop } = this.props;

    this.startMouse = {
      x: event.clientX,
      y: event.clientY,
    };

    startMoving(this.id);

    const panel = panels.find(pan => pan.id === this.id);
    
    if (panel && panel.position !== panels.length - 1) {
      moveToTop(this.id);
    }
  }

  public stopMoving = (event: React.MouseEvent<HTMLDivElement> | MouseEvent) => {
    const { height, left, top, width } = this.state;
    const { panels, movePanel, stopMoving } = this.props;

    const panel = panels.find(pan => pan.id === this.id);

    if (panel && panel.moving) {
      stopMoving(this.id);
    }

    const leftLT = left >= 0 ? left : 0;
    const topLT = top >= 0 ? top : 0;
    const leftRB = leftLT >= (document.documentElement.getBoundingClientRect().width - width) ?
      document.documentElement.getBoundingClientRect().width - width : leftLT;
    const topRB = topLT >= (document.documentElement.getBoundingClientRect().height - height) ?
      document.documentElement.getBoundingClientRect().height - height : topLT;

    if (leftRB !== left || topRB !== top) {
      this.move({ x: leftRB, y: topRB }, true);
      movePanel({
        id: this.id,
        left: leftRB,
        top: topRB,
      });
    } else if (panel && (panel.left !== left || panel.top !== top)) {
      movePanel({
        id: this.id,
        left: leftRB,
        top: topRB,
      });
    }
  } 

  public startResizing = (event: React.MouseEvent<HTMLDivElement>) => {
    const {
      panels,
      startResizing,
      moveToTop,
    } = this.props;

    this.startMouse = {
      x: event.clientX,
      y: event.clientY,
    };

    this.resizeSide = event.currentTarget.className.replace('panel__control panel__control--', '');

    startResizing(this.id);

    const panel = panels.find(pan => pan.id === this.id);
    
    if (panel && panel.position !== panels.length - 1) {
      moveToTop(this.id);
    }
  }

  public stopResizing = (event: React.MouseEvent<HTMLDivElement> | MouseEvent) => {
    const { stopResizing } = this.props;

    this.resizeSide = undefined;

    this.startMouse = {
      x: event.clientX,
      y: event.clientY,
    };

    stopResizing(this.id);

    this.startPositions = {
      height: this.thisPanel.getBoundingClientRect().height,
      left: this.thisPanel.getBoundingClientRect().left > 0 ? this.thisPanel.getBoundingClientRect().left : 0,
      top: this.thisPanel.getBoundingClientRect().top > 0 ? this.thisPanel.getBoundingClientRect().top : 0,
      width: this.thisPanel.getBoundingClientRect().width,
    };
  }

  public setInitial = ({ height, left, top, width }: IPanelState) => this.setState({
    height,
    left,
    top,
    width,
  })

  public move = ({ x, y }: { x: number, y: number }, force: boolean = false) => {
    const { panels } = this.props;

    const panel = panels.find(pan => pan.id === this.id);
    
    if (force) {
      this.setState({
        left: x,
        top: y,
      })
    } else if (panel && panel.moving && this.startMouse) {
      this.setState({
        left: Number(panel.left) + (x - this.startMouse.x),
        top: Number(panel.top) + (y - this.startMouse.y),
      });
    }
  }

  public resize = ({ x, y }: { x: number, y: number }) => {
    const {
      panels,
      resizePanel,
      maxHeight,
      maxWidth,
      minHeight,
      minWidth,
      movePanel,
    } = this.props;

    const panel = panels.find(pan => pan.id === this.id);

    if (panel && panel.resizing && this.startMouse && this.resizeSide) {
      const moveIt = ({ left, top }: { left: number, top: number }) => movePanel({ id: this.id, left, top });
      const resizeIt = ({ height, width }: { height: number, width: number }) => resizePanel({ height, id: this.id, width });

      const deltaX = this.startMouse.x - x;
      const deltaY = this.startMouse.y - y;
      const xDelta = x - this.startMouse.x;
      const yDelta = y - this.startMouse.y;

      if (this.resizeSide === 'LT') {
        const height = this.startPositions.height + deltaY >= (minHeight || 300) ?
          this.startPositions.height + deltaY : (minHeight || 300);
        const width = this.startPositions.width + deltaX >= (minWidth || 400) ?
          this.startPositions.width + deltaX : (minWidth || 400);
        const left = this.startPositions.width + deltaX >= (minWidth || 400) ?
          this.startPositions.left + xDelta :
          this.startPositions.left + (this.startPositions.width - (minWidth || 400));
        const top = this.startPositions.height + deltaY >= (minHeight || 300) ?
          this.startPositions.top + yDelta :
          this.startPositions.top + (this.startPositions.height - (minHeight || 300));

        resizeIt({
          height: maxHeight && maxHeight < height ? maxHeight : height,
          width: maxWidth && maxWidth < width ? maxWidth : width,
        });
        moveIt({
          left: maxWidth && maxWidth < width ? this.startPositions.left + (this.startPositions.width - maxWidth) : left,
          top: maxHeight && maxHeight < height ? this.startPositions.top + (this.startPositions.height - maxHeight) : top,
        });
      } else if (this.resizeSide === 'CT') {
        const height = this.startPositions.height + deltaY >= (minHeight || 300) ?
          this.startPositions.height + deltaY : (minHeight || 300);
        const width = this.startPositions.width;
        const left = this.startPositions.left;
        const top = this.startPositions.height + deltaY >= (minHeight || 300) ?
          this.startPositions.top + yDelta :
          this.startPositions.top + (this.startPositions.height - (minHeight || 300));

        resizeIt({
          height: maxHeight && maxHeight < height ? maxHeight : height,
          width,
        });
        moveIt({
          left,
          top: maxHeight && maxHeight < height ? this.startPositions.top + (this.startPositions.height - maxHeight) : top,
        });
      } else if (this.resizeSide === 'RT') {
        const height = this.startPositions.height + deltaY >= (minHeight || 300) ?
          this.startPositions.height + deltaY : (minHeight || 300);
        const width = this.startPositions.width - deltaX >= (minWidth || 400) ?
          this.startPositions.width - deltaX : (minWidth || 400);
        const left = this.startPositions.left;
        const top = this.startPositions.height + deltaY >= (minHeight || 300) ?
          this.startPositions.top + yDelta :
          this.startPositions.top + (this.startPositions.height - (minHeight || 300));

        resizeIt({
          height: maxHeight && maxHeight < height ? maxHeight : height,
          width: maxWidth && maxWidth < width ? maxWidth : width,
        });
        moveIt({
          left,
          top: maxHeight && maxHeight < height ? this.startPositions.top + (this.startPositions.height - maxHeight) : top,
        });
      } else if (this.resizeSide === 'RC') {
        const height = this.startPositions.height;
        const width = this.startPositions.width - deltaX >= (minWidth || 400) ?
          this.startPositions.width - deltaX : (minWidth || 400);

        resizeIt({
          height: maxHeight && maxHeight < height ? maxHeight : height,
          width: maxWidth && maxWidth < width ? maxWidth : width,
        });
      } else if (this.resizeSide === 'RB') {
        const height = this.startPositions.height - deltaY >= (minHeight || 300) ?
          this.startPositions.height - deltaY : (minHeight || 300);
        const width = this.startPositions.width - deltaX >= (minWidth || 400) ?
          this.startPositions.width - deltaX : (minWidth || 400);

        resizeIt({
          height: maxHeight && maxHeight < height ? maxHeight : height,
          width: maxWidth && maxWidth < width ? maxWidth : width,
        });
      } else if (this.resizeSide === 'CB') {
        const height = this.startPositions.height - deltaY >= (minHeight || 300) ?
          this.startPositions.height - deltaY : (minHeight || 300);
        const width = this.startPositions.width;

        resizeIt({
          height: maxHeight && maxHeight < height ? maxHeight : height,
          width: maxWidth && maxWidth < width ? maxWidth : width,
        });
      } else if (this.resizeSide === 'LB') {
        const height = this.startPositions.height - deltaY >= (minHeight || 300) ?
          this.startPositions.height - deltaY : (minHeight || 300);
        const width = this.startPositions.width + deltaX >= (minWidth || 400) ?
          this.startPositions.width + deltaX : (minWidth || 400);
        const left = this.startPositions.width + deltaX >= (minWidth || 400) ?
          this.startPositions.left + xDelta :
          this.startPositions.left + (this.startPositions.width - (minWidth || 400));
        const top = this.startPositions.top;

        resizeIt({
          height: maxHeight && maxHeight < height ? maxHeight : height,
          width: maxWidth && maxWidth < width ? maxWidth : width,
        });
        moveIt({
          left: maxWidth && maxWidth < width ? this.startPositions.left + (this.startPositions.width - maxWidth) : left,
          top,
        });
      } else if (this.resizeSide === 'LC') {
        const height = this.startPositions.height;
        const width = this.startPositions.width + deltaX >= (minWidth || 400) ?
          this.startPositions.width + deltaX : (minWidth || 400);
        const left = this.startPositions.width + deltaX >= (minWidth || 400) ?
          this.startPositions.left + xDelta :
          this.startPositions.left + (this.startPositions.width - (minWidth || 400));
        const top = this.startPositions.top;

        resizeIt({
          height,
          width: maxWidth && maxWidth < width ? maxWidth : width,
        });
        moveIt({
          left: maxWidth && maxWidth < width ? this.startPositions.left + (this.startPositions.width - maxWidth) : left,
          top,
        });
      }
    }
  }

  public render() {
    const { panels } = this.props;
    const { height, left, top, width } = this.state;

    const panel = panels.find(pan => pan.id === this.id);

    if (!panel) {
      return null;
    }

    const moveToTop = () => this.props.moveToTop(this.id);
    const startMoving = (event: React.MouseEvent<HTMLDivElement>) => this.startMoving(event);
    const stopMoving = (event: React.MouseEvent<HTMLDivElement>) => this.stopMoving(event);
    const startResizing = (event: React.MouseEvent<HTMLDivElement>) => this.startResizing(event);
    const stopResizing = (event: React.MouseEvent<HTMLDivElement>) => this.stopResizing(event);

    return (
      <div
        className="panel"
        key={this.id}
        onClick={moveToTop}
        style={{
          height: Boolean(height) ? height : panel.height,
          left: Boolean(left) ? left : panel.left,
          top: Boolean(top) ? top : panel.top,
          width: Boolean(width) ? width : panel.width,
          zIndex: (3 * panels.length) + panel.position,
        }}
        ref={(ref) => { if (ref) { this.thisPanel = ref; } }}
        id={this.id}
      >
        <header className="panel__header">
          <span className="panel__title">{panel.title}</span>
        </header>
        <div className="panel__main" style={{ backgroundColor: this.props.backgroundColor || '#FFF' }} >
          {this.props.children || null}
        </div>
        <Control
          startMoving={startMoving}
          stopMoving={stopMoving}
          startResizing={startResizing}
          stopResizing={stopResizing}
        />
      </div>
    );
  }
}

export default Panel;
