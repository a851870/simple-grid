let enquire: any;
if (typeof window !== 'undefined') {
    const matchMediaPolyfill = (mediaQuery: string) => {
      return {
        matches: false,
        media: mediaQuery,
        addListener() {
        },
        removeListener() {
        },
      };
    };
    window.matchMedia = window.matchMedia || matchMediaPolyfill;
    enquire = require('enquire.js');
  }

import * as PropTypes from 'prop-types';
import * as React from 'react';
import classNames from 'classnames';
import RowContext from './RowContext';

type Breakpoint = 'xxl' | 'xl' | 'lg' | 'md' | 'sm' | 'xs';
type BreakpointMap = Partial<Record<Breakpoint, string>>;

interface RowProps extends React.HTMLAttributes<HTMLDivElement> {
    gutter?: number | Partial<Record<Breakpoint, number>>;
    type?: 'flex';
    align?: 'top' | 'middle' | 'bottom';
    justify?: 'start' | 'end' | 'center' | 'space-around' | 'space-between';
    prefixCls?: string;
}

const responsiveMap: BreakpointMap = {
    xs: '(max-width: 575px)',
    sm: '(min-width: 576px)',
    md: '(min-width: 768px)',
    lg: '(min-width: 992px)',
    xl: '(min-width: 1200px)',
    xxl: '(min-width: 1600px)',
}

interface RowState {
    screens: BreakpointMap;
}

const responsiveArray: Breakpoint[] = ['xxl', 'xl', 'lg', 'md', 'sm', 'xs'];

export default class Row extends React.Component<RowProps, RowState> {
    static defaultProps = {
        gutter: 0,
    };

    static propTypes = {
        type: PropTypes.string,
        align: PropTypes.string,
        justify: PropTypes.string,
        className: PropTypes.string,
        children: PropTypes.node,
        gutter: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
        prefixCls: PropTypes.string,
    };

    state: RowState = {
        screens: {},
    };

    componentDidMount() {
        Object.keys(responsiveMap)
            .map((screen: Breakpoint) => enquire.register(responsiveMap[screen], {
                match: () => {
                    if (typeof this.props.gutter !== 'object') {
                        return;
                    }
                    this.setState((prevState) => ({
                        screens: {
                        ...prevState.screens,
                        [screen]: true,
                        },
                    }));
                },
                unmatch: () => {
                    if (typeof this.props.gutter !== 'object') {
                      return;
                    }
                    this.setState((prevState) => ({
                      screens: {
                        ...prevState.screens,
                        [screen]: false,
                      },
                    }));
                },
                // Keep a empty destory to avoid triggering unmatch when unregister
                destroy() {},
            }))

    }
    componentWillUnmount() {
        Object.keys(responsiveMap)
          .map((screen: Breakpoint) => enquire.unregister(responsiveMap[screen]));
    }

    getGutter(): number | undefined {
        const { gutter } = this.props;
        if (typeof gutter === 'object') {
          for (let i = 0; i <= responsiveArray.length; i++) {
            const breakpoint: Breakpoint = responsiveArray[i];
            if (this.state.screens[breakpoint] && gutter[breakpoint] !== undefined) {
              return gutter[breakpoint];
            }
          }
        }
        return gutter as number;
    }

    render() {
        const {
            type, justify, align, className, style, children,
            prefixCls = 'grid-row', ...others
        } = this.props;
        const gutter = this.getGutter();
        const classes = classNames({
            [prefixCls]: !type,
            [`${prefixCls}-${type}`]: type,
            [`${prefixCls}-${type}-${justify}`]: type && justify,
            [`${prefixCls}-${type}-${align}`]: type && align,
        }, className);
        const rowStyle = (gutter as number) > 0 ? {
            marginLeft: (gutter as number) / -2,
            marginRight: (gutter as number) / -2,
            ...style,
        } : style;
        const otherProps = { ...others };
        delete otherProps.gutter;
        return (
            <RowContext.Provider value={{ gutter }}>
                <div {...otherProps} className={classes} style={rowStyle} >
                    {children}
                </div>
            </RowContext.Provider>
        );
    }
}


