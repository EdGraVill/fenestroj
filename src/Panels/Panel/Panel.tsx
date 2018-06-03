import * as md5 from 'md5';
import * as React from 'react';

import {
  IPanel,
  IPanelActions,
} from '../@types';
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
  /**
   * The state will store values who can be mutated many times, keeping the state inside the
   * component itself, prevent unesesary re-renders in the other components.
   *
   * All values starts on zero because when a panel is created take the css sizes writen in
   * css calc string, and after the second render take the integer value from the html element
   */
  public state = {
    height: 0,
    left: 0,
    top: 0,
    width: 0,
  }
  /**
   * Unique id created taking current time and merging json string of the props. This prevent
   * repeat ids
   */
  public id: string = md5(`${Date.now()}+${JSON.stringify(this.props)}`);
  /**
   * This will be deleted in the next version, cause resizing method also will be changed by the
   * self value contain method
   */
  public startPositions: {
    height: number,
    width: number,
  };
  /**
   * Store the initial mouse value to calculate the direction. This will be deleted in future
   * versions when tap event be implemented
   */
  public startMouse: {
    x: number,
    y: number,
  }
  // Reference to the div container
  public thisPanel: HTMLDivElement;
  // Listener when mouse up. This is saved to use when component will unmount
  public mouseMoveListener: (event: MouseEvent) => void;
  /**
   * Indication string of the rezising size of the panel. This is builded by 2 characteres:
   * vertical and horizontal. Ej: the top right corner is 'RT' and the top is 'CT' (Center Top)
   */
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

    // Once the component was mounted is registered in the storage with initial values
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

    /**
     * Cuase the panel is registered after is mounted, is needed do some jobs after creation of it.
     * That's why unless new panel was created the next lines don't need to change
     */
    if (panels.length !== prevProps.panels.length) {
      /**
       * movePanel() and setInitial() set the size and position in number to the storage and in the
       * component state
       */
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

      // If new panel is created, is needed delete unused listeners
      if (this.mouseMoveListener) {
        document.removeEventListener('mousemove', this.mouseMoveListener, false);
      }

      /**
       * Register of the mouse move lister over the document to handle mouse movement even
       * outside the viewport
       */
      this.mouseMoveListener = (event: MouseEvent) => {
        this.move({ x: event.clientX, y: event.clientY });
        this.resize({ x: event.clientX, y: event.clientY });
      };
      document.addEventListener('mousemove', this.mouseMoveListener, false);

      // When mouse is released, movement or resize is finished
      document.addEventListener('mouseup', (event) => {
        this.stopMoving(event);
        this.stopResizing(event);
      });
    }
  }

  public componentWillUnmount() {
    const { removePanel } = this.props;

    // If the panel is deleted, remove unnecesary events
    removePanel(this.id);
    document.removeEventListener('mousemove', this.mouseMoveListener, false);
  }
  // Set initial values
  public setInitial = ({
    height,
    left,
    top,
    width,
  }: IPanelState) => this.setState({
    height,
    left,
    top,
    width,
  })
  // Get current panel
  public getPanel = (): IPanel => {
    const { title, panels } = this.props;

    // This panel to access
    return panels.find(panel => panel.id === this.id) || {
      active: true,
      height: this.thisPanel.getBoundingClientRect().height,
      icon: {
        id: this.id,
        title,
      },
      id: this.id,
      left: this.thisPanel.getBoundingClientRect().left,
      minimized: false,
      moving: false,
      position: panels.length,
      resizing: false,
      title,
      top: this.thisPanel.getBoundingClientRect().top,
      width: this.thisPanel.getBoundingClientRect().width,
    };
  };
  // Actions to perform when mouse down inside the panel control referent to moving
  public startMoving = (event: React.MouseEvent<HTMLDivElement>) => {
    const { panels, startMoving, moveToTop } = this.props;

    // Set initial mouse position to calculate the relative movement
    this.startMouse = {
      x: event.clientX,
      y: event.clientY,
    };

    // Tell the panel to start to move
    startMoving(this.id);

    const panel = this.getPanel();

    // If panel is back, move to top
    if (panel.position !== panels.length - 1) {
      moveToTop(this.id);
    }
  }
  // Actions when move
  public move = ({ x, y }: { x: number, y: number }, force: boolean = false) => {
    const panel = this.getPanel();

    if (force) {
      this.setState({
        left: x,
        top: y,
      });
    } else if (panel.moving && this.startMouse) {
      this.setState({
        left: Number(panel.left) + (x - this.startMouse.x),
        top: Number(panel.top) + (y - this.startMouse.y),
      });
    }
  }
  // Actions to perform when mouse up referent to moving
  public stopMoving = (event: React.MouseEvent<HTMLDivElement> | MouseEvent) => {
    const {
      height,
      left,
      top,
      width,
    } = this.state;
    const { movePanel, stopMoving } = this.props;

    const panel = this.getPanel();

    // If panel is moving, tell storage to register moving as false
    if (panel.moving) {
      stopMoving(this.id);
    }

    /**
     * If the panel is moving outside the viewport, it will be replaced inside the viewport.
     * It works calculating if left is less than zero or more than the viewport width minus panel's
     * width and if top is less than zero or more than the viewport height minus panel's height
     */
    const viewport = document.documentElement.getBoundingClientRect();
    const leftLT = left >= 0 ? left : 0;
    const topLT = top >= 0 ? top : 0;
    const leftRB = leftLT >= (viewport.width - width) ?
      viewport.width - width : leftLT;
    const topRB = topLT >= (viewport.height - height) ?
      viewport.height - height : topLT;

    /**
     * When the previous conditions doesn't match with the actual position, the panel changes it
     * position to the most reasonable position and stored in the reducer. But if the panel is
     * moved inside the viewport, it only store the position in the reducer
     */
    if (leftRB !== left || topRB !== top) {
      this.move({ x: leftRB, y: topRB }, true);
      movePanel({
        id: this.id,
        left: leftRB,
        top: topRB,
      });
    } else if (panel.left !== left || panel.top !== top) {
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

    const panel = this.getPanel();

    if (panel.position !== panels.length - 1) {
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
      width: this.thisPanel.getBoundingClientRect().width,
    };
  }

  public resize = ({ x, y }: { x: number, y: number }) => {
    const {
      resizePanel,
      maxHeight,
      maxWidth,
      minHeight,
      minWidth,
      movePanel,
    } = this.props;

    const panel = this.getPanel();

    if (panel.resizing && this.startMouse && this.resizeSide) {
      const moveIt = ({ left, top }: { left: number, top: number }) =>
        movePanel({ id: this.id, left, top });
      const resizeIt = ({ height, width }: { height: number, width: number }) =>
        resizePanel({ height, id: this.id, width });

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
          Number(panel.left) + xDelta :
          Number(panel.left) + (this.startPositions.width - (minWidth || 400));
        const top = this.startPositions.height + deltaY >= (minHeight || 300) ?
          Number(panel.top) + yDelta :
          Number(panel.top) + (this.startPositions.height - (minHeight || 300));

        resizeIt({
          height: maxHeight && maxHeight < height ? maxHeight : height,
          width: maxWidth && maxWidth < width ? maxWidth : width,
        });
        moveIt({
          left: maxWidth && maxWidth < width ?
            Number(panel.left) + (this.startPositions.width - maxWidth) : left,
          top: maxHeight && maxHeight < height ?
            Number(panel.top) + (this.startPositions.height - maxHeight) : top,
        });
      } else if (this.resizeSide === 'CT') {
        const height = this.startPositions.height + deltaY >= (minHeight || 300) ?
          this.startPositions.height + deltaY : (minHeight || 300);
        const { width } = this.startPositions;
        const left = Number(panel.left);
        const top = this.startPositions.height + deltaY >= (minHeight || 300) ?
          Number(panel.top) + yDelta :
          Number(panel.top) + (this.startPositions.height - (minHeight || 300));

        resizeIt({
          height: maxHeight && maxHeight < height ? maxHeight : height,
          width,
        });
        moveIt({
          left,
          top: maxHeight && maxHeight < height ?
            Number(panel.top) + (this.startPositions.height - maxHeight) : top,
        });
      } else if (this.resizeSide === 'RT') {
        const height = this.startPositions.height + deltaY >= (minHeight || 300) ?
          this.startPositions.height + deltaY : (minHeight || 300);
        const width = this.startPositions.width - deltaX >= (minWidth || 400) ?
          this.startPositions.width - deltaX : (minWidth || 400);
        const left = Number(panel.left);
        const top = this.startPositions.height + deltaY >= (minHeight || 300) ?
          Number(panel.top) + yDelta :
          Number(panel.top) + (this.startPositions.height - (minHeight || 300));

        resizeIt({
          height: maxHeight && maxHeight < height ? maxHeight : height,
          width: maxWidth && maxWidth < width ? maxWidth : width,
        });
        moveIt({
          left,
          top: maxHeight && maxHeight < height ?
            Number(panel.top) + (this.startPositions.height - maxHeight) : top,
        });
      } else if (this.resizeSide === 'RC') {
        const { height } = this.startPositions;
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
        const { width } = this.startPositions;

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
          Number(panel.left) + xDelta :
          Number(panel.left) + (this.startPositions.width - (minWidth || 400));
        const top = Number(panel.top);

        resizeIt({
          height: maxHeight && maxHeight < height ? maxHeight : height,
          width: maxWidth && maxWidth < width ? maxWidth : width,
        });
        moveIt({
          left: maxWidth && maxWidth < width ?
            Number(panel.left) + (this.startPositions.width - maxWidth) : left,
          top,
        });
      } else if (this.resizeSide === 'LC') {
        const { height } = this.startPositions;
        const width = this.startPositions.width + deltaX >= (minWidth || 400) ?
          this.startPositions.width + deltaX : (minWidth || 400);
        const left = this.startPositions.width + deltaX >= (minWidth || 400) ?
          Number(panel.left) + xDelta :
          Number(panel.left) + (this.startPositions.width - (minWidth || 400));
        const top = Number(panel.top);

        resizeIt({
          height,
          width: maxWidth && maxWidth < width ? maxWidth : width,
        });
        moveIt({
          left: maxWidth && maxWidth < width ?
            Number(panel.left) + (this.startPositions.width - maxWidth) : left,
          top,
        });
      }
    }
  }

  public render() {
    const { panels, moveToTop } = this.props;
    const {
      height,
      left,
      top,
      width,
    } = this.state;

    const panel = panels.find(pan => pan.id === this.id);

    if (!panel) {
      return null;
    }

    // If click inside the panel, it comes to top
    const moveTop = () => {
      if (panel.position !== panels.length) {
        moveToTop(this.id);
      }
    };
    const startMoving = (event: React.MouseEvent<HTMLDivElement>) => this.startMoving(event);
    const stopMoving = (event: React.MouseEvent<HTMLDivElement>) => this.stopMoving(event);
    const startResizing = (event: React.MouseEvent<HTMLDivElement>) => this.startResizing(event);
    const stopResizing = (event: React.MouseEvent<HTMLDivElement>) => this.stopResizing(event);

    return (
      <div
        role="button"
        tabIndex={panel.position}
        onKeyDown={moveTop}
        className="panel"
        key={this.id}
        onClick={moveTop}
        style={{
          height: height || panel.height,
          left: left || panel.left,
          top: top || panel.top,
          width: width || panel.width,
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
