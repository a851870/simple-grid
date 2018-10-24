import * as PropTypes from 'prop-types';
import * as React from 'react';
import classNames from 'classnames';
import RowContext from './RowContext';

const stringOrNumber = PropTypes.oneOfType([PropTypes.string, PropTypes.number]);
const objectOrNumber = PropTypes.oneOfType([PropTypes.object, PropTypes.number]);

interface ColSize {
    span?: number,
    offset?: number
}

interface ColProps extends React.HTMLAttributes<HTMLDivElement> {
    span?: number,
    offset?: number,
    xs?: number | ColSize;
    sm?: number | ColSize;
    md?: number | ColSize;
    lg?: number | ColSize;
    xl?: number | ColSize;
    xxl?: number | ColSize;
    prefixCls?: string
}

export default class Col extends React.Component<ColProps> {

    static propTypes = {
        span: stringOrNumber,
        offset: stringOrNumber,
        className: PropTypes.string,
        children: PropTypes.node,
        xs: objectOrNumber,
        sm: objectOrNumber,
        md: objectOrNumber,
        lg: objectOrNumber,
        xl: objectOrNumber,
        xxl: objectOrNumber,
    };

    render() {
        const props = this.props;
        const {
            span, offset, xs, sm, md, lg, xl, xxl, className, prefixCls = 'col', children, ...others
        } = props;
        console.log(className)
        let sizeClassObj = {};
        ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'].forEach(size => {
            let sizeProps: ColSize = {}
            if(typeof props[size] === 'number') {
                sizeProps.span = props[size]
            } else if (typeof props[size] === 'object') {
                sizeProps = props[size] || {};
            }

            delete others[size];

            sizeClassObj = {
                ...sizeClassObj,
                [`${prefixCls}-${size}-${sizeProps.span}`]: sizeProps.span !== undefined,
                [`${prefixCls}-${size}-${sizeProps.offset}`]: sizeProps.offset || sizeProps.offset === 0,
            }
        })
        const classes = classNames({
            [`${prefixCls}`]: prefixCls,
            [`col-span-${span}`]: span,
            [`col-offset-${offset}`]: offset,
        },  sizeClassObj, className)
        return (
            <RowContext.Consumer>
                {({ gutter }) => {
                    let style = others.style;
                    if (gutter as number > 0) {
                        style = {
                            paddingLeft: (gutter as number) / 2,
                            paddingRight: (gutter as number) / 2,
                            ...style,
                        }
                    }
                    return <div {...others} style={style} className={classes}>{children}</div>;
                }}
            </RowContext.Consumer>
        )
    }
}
