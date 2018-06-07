import * as md5 from 'md5';
import * as React from 'react';

import { ContextMenu, MenuItem } from 'react-contextmenu';
import { Buttons, FenestroContext } from '.';
import {
  IFenestro,
  IFenestroActions,
} from '../@types';
import Control from './Control';
import './Fenestro.css';

interface IFenestroProps extends IFenestroActions {
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
  fenestroj: IFenestro[];
}

interface IFenestroState {
  height: number;
  left: number;
  top: number;
  width: number;
}

class Fenestro extends React.Component<IFenestroProps, IFenestroState> {
  /**
   * The state will store values who can be mutated many times, keeping the state inside the
   * component itself, prevent unesesary re-renders in the other components.
   *
   * All values starts on zero because when a fenestro is created take the css sizes writen in
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
  public id: string = md5(`${Date.now()}+${JSON.stringify(this.props.fenestroj)}`);
  /**
   * Store the initial mouse value to calculate the direction. This will be deleted in future
   * versions when tap event be implemented
   */
  public startMouse: {
    x: number,
    y: number,
  }
  // Reference to the div container
  public thisFenestro: HTMLDivElement;
  // Listener when mouse up. This is saved to use when component will unmount
  public mouseMoveListener: (event: MouseEvent) => void;
  /**
   * Indication string of the rezising size of the fenestro. This is builded by 2 characteres:
   * vertical and horizontal. Ej: the top right corner is 'RT' and the top is 'CT' (Center Top)
   */
  public resizeSide?: string = undefined;

  public componentDidMount() {
    const {
      addFenestro,
      initialHeight,
      initialLeft,
      initialTop,
      initialWidth,
      icon,
      iconTitle,
      title,
    } = this.props;

    // Once the component was mounted is registered in the storage with initial values
    addFenestro({
      height: initialHeight || 500,
      icon,
      iconTitle,
      id: this.id,
      left: initialLeft || `calc(50% - ${initialWidth || 375}px)`,
      title,
      top: initialTop || `calc(50% - ${initialHeight || 250}px)`,
      width: initialWidth || 750,
    });
  }

  public componentDidUpdate(prevProps: IFenestroProps) {
    const { fenestroj, moveFenestro } = this.props;

    /**
     * Cuase the fenestro is registered after is mounted, is needed do some jobs after creation of
     * it. That's why unless new fenestro was created the next lines don't need to change
     */
    if (fenestroj.length !== prevProps.fenestroj.length) {
      /**
       * moveFenestro() and setInitial() set the size and position in number to the storage and in
       * the component state
       */
      moveFenestro({
        id: this.id,
        left: this.thisFenestro.getBoundingClientRect().left,
        top: this.thisFenestro.getBoundingClientRect().top,
      });
      this.setInitial({
        height: this.thisFenestro.getBoundingClientRect().height,
        left: this.thisFenestro.getBoundingClientRect().left,
        top: this.thisFenestro.getBoundingClientRect().top,
        width: this.thisFenestro.getBoundingClientRect().width,
      });

      // If new fenestro is created, is needed delete unused listeners
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
    const { removeFenestro } = this.props;

    // If the fenestro is deleted, remove unnecesary events
    removeFenestro(this.id);
    document.removeEventListener('mousemove', this.mouseMoveListener, false);
  }
  // Set initial values
  public setInitial = ({
    height,
    left,
    top,
    width,
  }: IFenestroState) => this.setState({
    height,
    left,
    top,
    width,
  })
  // Get current fenestro
  public getFenestro = (): IFenestro => {
    const {
      title,
      fenestroj,
      icon,
      iconTitle,
    } = this.props;

    // This fenestro to access
    return fenestroj.find(fenestro => fenestro.id === this.id) || {
      active: true,
      height: this.thisFenestro.getBoundingClientRect().height,
      icon: {
        ref: document.createElement('button'),
        src: icon,
        title: iconTitle || title,
      },
      id: this.id,
      left: this.thisFenestro.getBoundingClientRect().left,
      maximized: false,
      minimized: false,
      moving: false,
      position: fenestroj.length,
      resizing: false,
      title,
      top: this.thisFenestro.getBoundingClientRect().top,
      width: this.thisFenestro.getBoundingClientRect().width,
    };
  };
  // Actions to perform when mouse down inside the fenestro control referent to moving
  public startMoving = (event: React.MouseEvent<HTMLDivElement>) => {
    const { fenestroj, startMoving, moveToTop } = this.props;
    // Set initial mouse position to calculate the relative movement
    this.startMouse = {
      x: event.clientX,
      y: event.clientY,
    };
    // Tell the fenestro to start to move
    startMoving(this.id);

    const fenestro = this.getFenestro();
    // If fenestro is back, move to top
    if (fenestro.position !== fenestroj.length - 1) {
      moveToTop(this.id);
    }
  }
  // Actions when move
  public move = ({ x, y }: { x: number, y: number }, force: boolean = false) => {
    const fenestro = this.getFenestro();

    if (force) {
      this.setState({
        left: x,
        top: y,
      });
    } else if (fenestro.moving && this.startMouse && !fenestro.maximized) {
      this.setState({
        left: Number(fenestro.left) + (x - this.startMouse.x),
        top: Number(fenestro.top) + (y - this.startMouse.y),
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
    const { moveFenestro, stopMoving } = this.props;

    const fenestro = this.getFenestro();
    // If fenestro is moving, tell storage to register moving as false
    if (fenestro.moving) {
      stopMoving(this.id);
    }

    /**
     * If the fenestro is moving outside the viewport, it will be replaced inside the viewport.
     * It works calculating if left is less than zero or more than the viewport width minus
     * fenestro's width and if top is less than zero or more than the viewport height minus
     * fenestro's height
     */
    const viewport = this.thisFenestro.parentElement ?
      this.thisFenestro.parentElement.getBoundingClientRect() :
      document.documentElement.getBoundingClientRect();
    const leftLT = left >= 0 ? left : 0;
    const topLT = top >= 0 ? top : 0;
    const leftRB = leftLT >= (viewport.width - width) ?
      viewport.width - width : leftLT;
    const topRB = topLT >= (viewport.height - height) ?
      viewport.height - height : topLT;

    /**
     * When the previous conditions doesn't match with the actual position, the fenestro changes it
     * position to the most reasonable position and stored in the reducer. But if the fenestro is
     * moved inside the viewport, it only store the position in the reducer
     */
    if (leftRB !== left || topRB !== top) {
      this.move({ x: leftRB, y: topRB }, true);
      moveFenestro({
        id: this.id,
        left: leftRB,
        top: topRB,
      });
    } else if (fenestro.left !== left || fenestro.top !== top) {
      moveFenestro({
        id: this.id,
        left: leftRB,
        top: topRB,
      });
    }
  }
  // Actions to perform when mouse down inside the fenestro control referent to resizing
  public startResizing = (event: React.MouseEvent<HTMLDivElement>) => {
    const { fenestroj, startResizing, moveToTop } = this.props;
    // Set initial mouse position to calculate the relative movement
    this.startMouse = {
      x: event.clientX,
      y: event.clientY,
    };
    // Catch the pressed corner
    this.resizeSide = event.currentTarget.className.replace('fenestro__control fenestro__control--', '');
    // Tell the fenestro to start to move
    startResizing(this.id);

    const fenestro = this.getFenestro();
    // If fenestro is back, move to top
    if (fenestro.position !== fenestroj.length - 1) {
      moveToTop(this.id);
    }
  }
  // Actions when resize
  public resize = ({ x, y }: { x: number, y: number }) => {
    const {
      maxHeight,
      maxWidth,
      minHeight,
      minWidth,
    } = this.props;

    const fenestro = this.getFenestro();

    if (fenestro.resizing && this.startMouse && this.resizeSide && !fenestro.maximized) {
      const deltaX = this.startMouse.x - x;
      const deltaY = this.startMouse.y - y;
      const xDelta = x - this.startMouse.x;
      const yDelta = y - this.startMouse.y;

      if (this.resizeSide === 'LT') {
        const height = Number(fenestro.height) + deltaY >= (minHeight || 300) ?
          Number(fenestro.height) + deltaY : (minHeight || 300);
        const width = Number(fenestro.width) + deltaX >= (minWidth || 400) ?
          Number(fenestro.width) + deltaX : (minWidth || 400);
        const left = Number(fenestro.width) + deltaX >= (minWidth || 400) ?
          Number(fenestro.left) + xDelta :
          Number(fenestro.left) + (Number(fenestro.width) - (minWidth || 400));
        const top = Number(fenestro.height) + deltaY >= (minHeight || 300) ?
          Number(fenestro.top) + yDelta :
          Number(fenestro.top) + (Number(fenestro.height) - (minHeight || 300));

        this.setState({
          height: maxHeight && maxHeight < height ? maxHeight : height,
          left: maxWidth && maxWidth < width ?
            Number(fenestro.left) + (Number(fenestro.width) - maxWidth) : left,
          top: maxHeight && maxHeight < height ?
            Number(fenestro.top) + (Number(fenestro.height) - maxHeight) : top,
          width: maxWidth && maxWidth < width ? maxWidth : width,
        });
      } else if (this.resizeSide === 'CT') {
        const height = Number(fenestro.height) + deltaY >= (minHeight || 300) ?
          Number(fenestro.height) + deltaY : (minHeight || 300);
        const width = Number(fenestro.width);
        const left = Number(fenestro.left);
        const top = Number(fenestro.height) + deltaY >= (minHeight || 300) ?
          Number(fenestro.top) + yDelta :
          Number(fenestro.top) + (Number(fenestro.height) - (minHeight || 300));

        this.setState({
          height: maxHeight && maxHeight < height ? maxHeight : height,
          left,
          top: maxHeight && maxHeight < height ?
            Number(fenestro.top) + (Number(fenestro.height) - maxHeight) : top,
          width,
        });
      } else if (this.resizeSide === 'RT') {
        const height = Number(fenestro.height) + deltaY >= (minHeight || 300) ?
          Number(fenestro.height) + deltaY : (minHeight || 300);
        const width = Number(fenestro.width) - deltaX >= (minWidth || 400) ?
          Number(fenestro.width) - deltaX : (minWidth || 400);
        const left = Number(fenestro.left);
        const top = Number(fenestro.height) + deltaY >= (minHeight || 300) ?
          Number(fenestro.top) + yDelta :
          Number(fenestro.top) + (Number(fenestro.height) - (minHeight || 300));

        this.setState({
          height: maxHeight && maxHeight < height ? maxHeight : height,
          left,
          top: maxHeight && maxHeight < height ?
            Number(fenestro.top) + (Number(fenestro.height) - maxHeight) : top,
          width: maxWidth && maxWidth < width ? maxWidth : width,
        });
      } else if (this.resizeSide === 'RC') {
        const height = Number(fenestro.height);
        const width = Number(fenestro.width) - deltaX >= (minWidth || 400) ?
          Number(fenestro.width) - deltaX : (minWidth || 400);

        this.setState({
          height: maxHeight && maxHeight < height ? maxHeight : height,
          width: maxWidth && maxWidth < width ? maxWidth : width,
        });
      } else if (this.resizeSide === 'RB') {
        const height = Number(fenestro.height) - deltaY >= (minHeight || 300) ?
          Number(fenestro.height) - deltaY : (minHeight || 300);
        const width = Number(fenestro.width) - deltaX >= (minWidth || 400) ?
          Number(fenestro.width) - deltaX : (minWidth || 400);

        this.setState({
          height: maxHeight && maxHeight < height ? maxHeight : height,
          width: maxWidth && maxWidth < width ? maxWidth : width,
        });
      } else if (this.resizeSide === 'CB') {
        const height = Number(fenestro.height) - deltaY >= (minHeight || 300) ?
          Number(fenestro.height) - deltaY : (minHeight || 300);
        const width = Number(fenestro.width);

        this.setState({
          height: maxHeight && maxHeight < height ? maxHeight : height,
          width: maxWidth && maxWidth < width ? maxWidth : width,
        });
      } else if (this.resizeSide === 'LB') {
        const height = Number(fenestro.height) - deltaY >= (minHeight || 300) ?
          Number(fenestro.height) - deltaY : (minHeight || 300);
        const width = Number(fenestro.width) + deltaX >= (minWidth || 400) ?
          Number(fenestro.width) + deltaX : (minWidth || 400);
        const left = Number(fenestro.width) + deltaX >= (minWidth || 400) ?
          Number(fenestro.left) + xDelta :
          Number(fenestro.left) + (Number(fenestro.width) - (minWidth || 400));
        const top = Number(fenestro.top);

        this.setState({
          height: maxHeight && maxHeight < height ? maxHeight : height,
          left: maxWidth && maxWidth < width ?
            Number(fenestro.left) + (Number(fenestro.width) - maxWidth) : left,
          top,
          width: maxWidth && maxWidth < width ? maxWidth : width,
        });
      } else if (this.resizeSide === 'LC') {
        const height = Number(fenestro.height);
        const width = Number(fenestro.width) + deltaX >= (minWidth || 400) ?
          Number(fenestro.width) + deltaX : (minWidth || 400);
        const left = Number(fenestro.width) + deltaX >= (minWidth || 400) ?
          Number(fenestro.left) + xDelta :
          Number(fenestro.left) + (Number(fenestro.width) - (minWidth || 400));
        const top = Number(fenestro.top);

        this.setState({
          height,
          left: maxWidth && maxWidth < width ?
            Number(fenestro.left) + (Number(fenestro.width) - maxWidth) : left,
          top,
          width: maxWidth && maxWidth < width ? maxWidth : width,
        });
      }
    }
  }
  // Actions to perform when mouse up referent to resizing
  public stopResizing = (event: React.MouseEvent<HTMLDivElement> | MouseEvent) => {
    const {
      height,
      left,
      top,
      width,
    } = this.state;
    const { stopResizing, moveFenestro, resizeFenestro } = this.props;
    // Reset pressed corner
    this.resizeSide = undefined;

    const fenestro = this.getFenestro();
    // If fenestro is moving, tell storage to register moving as false
    if (fenestro.resizing) {
      stopResizing(this.id);
    }
    // If the dimentions has ben changed, register the new values in the reducer
    if (height !== fenestro.height || width !== fenestro.width) {
      resizeFenestro({ height, id: this.id, width });
    }
    // If the direction has ben changed, register the new values in the reducer
    if (left !== fenestro.left || top !== fenestro.top) {
      moveFenestro({ left, id: this.id, top });
    }
  }

  public render() {
    const {
      fenestroj,
      moveToTop,
      toggleMaximized,
      toggleMinimized,
    } = this.props;
    const {
      height,
      left,
      top,
      width,
    } = this.state;

    const fenestro = fenestroj.find(pan => pan.id === this.id);

    if (!fenestro) {
      return null;
    }

    // If click inside the fenestro, it comes to top
    const moveTop = () => moveToTop(this.id);
    const startMoving = (event: React.MouseEvent<HTMLDivElement>) => this.startMoving(event);
    const stopMoving = (event: React.MouseEvent<HTMLDivElement>) => this.stopMoving(event);
    const startResizing = (event: React.MouseEvent<HTMLDivElement>) => this.startResizing(event);
    const stopResizing = (event: React.MouseEvent<HTMLDivElement>) => this.stopResizing(event);
    const toggleMax = () => toggleMaximized(this.id);
    const toggleMin = () => toggleMinimized(this.id);

    let situation = '';

    if (fenestro.minimized) {
      situation = ' fenestro--minimized';
    } else if (fenestro.maximized) {
      situation = ' fenestro--maximized';
    }

    return (
      <div
        role="button"
        tabIndex={fenestro.position}
        onKeyDown={moveTop}
        className={`fenestro${situation}`}
        key={this.id}
        onClick={moveTop}
        style={{
          height: fenestro.minimized ?
            fenestro.icon.ref.getBoundingClientRect().height :
            height || fenestro.height,
          left: fenestro.minimized ?
            fenestro.icon.ref.getBoundingClientRect().left :
            left || fenestro.left,
          top: fenestro.minimized ?
            fenestro.icon.ref.getBoundingClientRect().top :
            top || fenestro.top,
          width: fenestro.minimized ?
            fenestro.icon.ref.getBoundingClientRect().width :
            width || fenestro.width,
          zIndex: (3 * fenestroj.length) + fenestro.position,
        }}
        ref={(ref) => { if (ref) { this.thisFenestro = ref; } }}
        id={this.id}
      >
        <header className="fenestro__header">
          <span className="fenestro__title">{fenestro.title}</span>
        </header>
        <div className="fenestro__main" style={{ backgroundColor: this.props.backgroundColor || '#FFF' }} >
          {this.props.children || null}
        </div>
        <Control
          startMoving={startMoving}
          stopMoving={stopMoving}
          startResizing={startResizing}
          stopResizing={stopResizing}
          toggleMaximized={toggleMax}
          id={this.id}
        />
        <FenestroContext.Provider value={this.id}>
          <Buttons />
        </FenestroContext.Provider>
        <ContextMenu id={this.id}>
          <MenuItem onClick={toggleMax}>
            {fenestro.maximized ? 'Reduce' : 'Expand'}
          </MenuItem>
          <MenuItem onClick={toggleMin}>
            Hide
          </MenuItem>
        </ContextMenu>
      </div>
    );
  }
}

export default Fenestro;
