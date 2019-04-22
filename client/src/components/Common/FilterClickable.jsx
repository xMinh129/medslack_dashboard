import React from 'react';

class FilterClickable extends React.Component {

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.props.onClick(this.props.index)
    }

    render() {
        return <th
            className={
                this.props.isActive ? 'col active' : 'col white non-active'
            }
            onClick={this.handleClick}
        >
            {this.props.name}
        </th>
    }
}

export default FilterClickable;
