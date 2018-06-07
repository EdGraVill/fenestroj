import {
  IAction,
  IAddFenestroParam,
  IFenestro,
  IMoveFenestroParam,
  IResizeFenestroParam,
} from '../@types';

const initialState: IFenestro[] = [];

export default (state: IFenestro[] = initialState, action: IAction) => {
  const { type, payload } = action;

  const alterValue = (id: string, field: string, value: any): IFenestro[] =>
    state.map((fenestro) => {
      if (fenestro.id !== id) {
        return fenestro;
      }

      return {
        ...fenestro,
        [field]: value,
      };
    });

  if (type === 'FACTORY_MODE') {
    return initialState;
  } else if (type === 'ADD_FENESTRO') {
    const {
      icon,
      iconTitle,
      id,
      title,
      left,
      top,
      height,
      width,
    }: IAddFenestroParam = payload;

    return [
      ...state,
      {
        active: true,
        height,
        icon: {
          src: icon,
          title: iconTitle || title,
        },
        id,
        left: typeof left === 'number' ?
          `calc(${left}px + ${state.length}rem)` :
          `calc(${left.replace('calc(', '').replace(')', '')} + ${state.length}rem)`,
        maximized: false,
        minimized: false,
        moving: false,
        position: state.length,
        resizing: false,
        title,
        top: typeof top === 'number' ?
          `calc(${top}px + ${state.length * 2.2}rem)` :
          `calc(${top.replace('calc(', '').replace(')', '')} + ${state.length * 2.2}rem)`,
        width,
      },
    ];
  } else if (type === 'MOVE_FENESTRO') {
    const { id, left, top }: IMoveFenestroParam = payload;

    return state.map((fenestro) => {
      if (fenestro.id !== id) {
        return fenestro;
      }

      return {
        ...fenestro,
        left,
        top,
      };
    });
  } else if (type === 'MOVE_FENESTRO_TO_TOP') {
    const id: string = payload;

    if (state.length === 1) {
      return state;
    }

    return state.map((fenestro) => {
      const actualFenestro = state.find(pan => pan.id === id);

      if (fenestro.id !== id && actualFenestro) {
        return {
          ...fenestro,
          position: fenestro.position >= actualFenestro.position ?
            fenestro.position - 1 : fenestro.position,
        };
      }

      return {
        ...fenestro,
        position: state.length - 1,
      };
    });
  } else if (type === 'REMOVE_FENESTRO') {
    const id: string = payload;

    return state.reduce((prev, current) => [
      ...prev,
      ...(current.id !== id ? [current] : []),
    ], []);
  } else if (type === 'RESIZE_FENESTRO') {
    const { id, height, width }: IResizeFenestroParam = payload;

    return state.map((fenestro) => {
      if (fenestro.id !== id) {
        return fenestro;
      }

      return {
        ...fenestro,
        height,
        width,
      };
    });
  } else if (type === 'START_MOVING_FENESTRO') {
    const id: string = payload;

    return alterValue(id, 'moving', true);
  } else if (type === 'START_RESIZING_FENESTRO') {
    const id: string = payload;

    return alterValue(id, 'resizing', true);
  } else if (type === 'STOP_MOVING_FENESTRO') {
    const id: string = payload;

    return alterValue(id, 'moving', false);
  } else if (type === 'STOP_RESIZING_FENESTRO') {
    const id: string = payload;

    return alterValue(id, 'resizing', false);
  } else if (type === 'TOGGLE_MINIMIZED') {
    const id: string = payload;

    return state.map((fenestro) => {
      if (fenestro.id !== id) {
        return fenestro;
      }

      return {
        ...fenestro,
        minimized: !fenestro.minimized,
      };
    });
  } else if (type === 'TOGGLE_MAXIMIZED') {
    const id: string = payload;

    return state.map((fenestro) => {
      if (fenestro.id !== id) {
        return fenestro;
      }

      return {
        ...fenestro,
        maximized: !fenestro.maximized,
      };
    });
  } else if (type === 'ADD_ICON_REF') {
    const { id, ref }: { id: string, ref: HTMLButtonElement } = payload;

    return state.map((fenestro) => {
      if (fenestro.id !== id) {
        return fenestro;
      }

      return {
        ...fenestro,
        icon: {
          ...fenestro.icon,
          ref,
        },
      };
    });
  }

  return state;
};
