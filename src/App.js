import React, { Component } from 'react';
import logo from './logo.svg';
import 'antd/dist/antd.min.css';
import { DragDropContext, DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import {Dhwz} from './modal.js';
import './App.css';
function dragDirection(
    dragIndex,
    hoverIndex,
    initialClientOffset,
    clientOffset,
    sourceClientOffset,
) {
    const hoverMiddleY = (initialClientOffset.y - sourceClientOffset.y) / 2;
    const hoverClientY = clientOffset.y - sourceClientOffset.y;
    if (dragIndex < hoverIndex && hoverClientY > hoverMiddleY) {
        return 'downward';
    }
    if (dragIndex > hoverIndex && hoverClientY < hoverMiddleY) {
        return 'upward';
    }
}


class BodyRow extends React.Component {
    render() {
        const {
            isOver,
            connectDragSource,
            connectDropTarget,
            moveRow,
            dragRow,
            clientOffset,
            sourceClientOffset,
            initialClientOffset,
            ...restProps
        } = this.props;
        const style = { ...restProps.style, cursor: 'move' };

        let className = restProps.className;
        if (isOver && initialClientOffset) {
            const direction = dragDirection(
                dragRow.index,
                restProps.index,
                initialClientOffset,
                clientOffset,
                sourceClientOffset
            );
            if (direction === 'downward') {
                className += ' drop-over-downward';
            }
            if (direction === 'upward') {
                className += ' drop-over-upward';
            }
        }

        return connectDragSource(
            connectDropTarget(
                <div  {...restProps}
                      className={className}
                      style={style}>
                    <Dhwz >单行文本1</Dhwz>
                    <div className="mask"></div>
                </div>
            )
        );
    }
}
class Test extends Component{
    render() {
        const {
            connectDragSource,
            isDragging ,
            isOver,
            dragRow,
            clientOffset,
            sourceClientOffset,
            initialClientOffset,
            ...restProps
        } = this.props;
        const style = { ...restProps.style, cursor: 'move' };
        if (isOver && initialClientOffset) {
            const direction = dragDirection(
                dragRow.index,
                restProps.index,
                initialClientOffset,
                clientOffset,
                sourceClientOffset
            );
            console.log(direction)
        }
        return connectDragSource(
            <div {...restProps}
                 style={style}>
                <Dhwz >单行文本1</Dhwz>
                <div className="mask"></div>
            </div>
        );
    }
}
const rowSource = {
    beginDrag(props) {
        console.log(props)
        return {
            index: props.index,
        };
    },
};

const rowTarget = {
    drop(props, monitor) {
        const dragIndex = monitor.getItem().index;
        const hoverIndex = props.index;
        console.log(monitor.getItem())
        // Don't replace items with themselves
        if (dragIndex === hoverIndex) {
            return;
        }

        // Time to actually perform the action
        props.moveRow(dragIndex, hoverIndex);

        // Note: we're mutating the monitor item here!
        // Generally it's better to avoid mutations,
        // but it's good here for the sake of performance
        // to avoid expensive index searches.
        monitor.getItem().index = hoverIndex;
    },
};

const DragableBodyRow = DropTarget('row', rowTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    sourceClientOffset: monitor.getSourceClientOffset(),
}))(
    DragSource('row', rowSource, (connect, monitor) => ({
        connectDragSource: connect.dragSource(),
        dragRow: monitor.getItem(),
        clientOffset: monitor.getClientOffset(),
        initialClientOffset: monitor.getInitialClientOffset(),
    }))(BodyRow)
);


const DragSource1 = DragSource('row',rowSource,(connector, monitor) => ({
        connectDragSource: connector.dragSource(),
        isDragging: monitor.isDragging(),
        initialClientOffset: monitor.getInitialClientOffset(),
    })
)(Test)
const columns = [{
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
}, {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
}, {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
}];

class DragSortingTable extends React.Component {
    state = {
        data: [{
            key: '1',
            name: 'John Brown',
            age: 32,
            address: 'New York No. 1 Lake Park',
        }, {
            key: '2',
            name: 'Jim Green',
            age: 42,
            address: 'London No. 1 Lake Park',
        }, {
            key: '3',
            name: 'Joe Black',
            age: 32,
            address: 'Sidney No. 1 Lake Park',
        }],
    }

    components = {
        body: {
            row: DragableBodyRow,
        },
    }

    moveRow = (dragIndex, hoverIndex) => {
        const { data } = this.state;
        const dragRow = data[dragIndex];

        this.setState(
            update(this.state, {
                data: {
                    $splice: [[dragIndex, 1], [hoverIndex, 0, dragRow]],
                },
            }),
        );
    }

    render() {
        return (

                <div className="form-builder">
                    <div className="form-left">

                    </div>
                    <div className="form-body">
                        <div className="form-body-header">

                        </div>
                        <div className="form-body-content">
                            <div className="form-outer">
                                <div className="form-item col-12">
                                    <Dhwz >单行文本1</Dhwz>
                                    <div className="mask"></div>
                                </div>
                            </div>
                            <div className="form-outer">
                                <DragSource1 className="form-item col-12"/>
                            </div>
                            <div className="form-outer">
                                <div className="form-item col-12">
                                    <Dhwz >单行文本2</Dhwz>
                                    <div className="mask"></div>
                                </div>
                            </div>
                            <div className="form-outer">
                                <div className="form-item col-12">
                                    <Dhwz >单行文本3</Dhwz>
                                    <div className="mask"></div>
                                </div>
                            </div>
                            <div className="form-outer">
                                <div className="form-item col-12">
                                    <Dhwz >单行文本4</Dhwz>
                                    <div className="mask"></div>
                                </div>
                            </div>
                            <div className="form-outer">
                                <div className="form-item col-12">
                                    <Dhwz >单行文本5</Dhwz>
                                    <div className="mask"></div>
                                </div>
                            </div>
                            <div className="form-outer">
                                <div className="form-item col-12">
                                    <Dhwz >单行文本6</Dhwz>
                                    <div className="mask"></div>
                                </div>
                            </div>
                            <div className="form-outer">
                                <div className="form-item col-6">
                                    <Dhwz >单行文本7</Dhwz>
                                    <div className="mask"></div>
                                </div>
                                <div className="form-item col-6">
                                    <Dhwz >单行文本9</Dhwz>
                                    <div className="mask"></div>
                                </div>
                            </div>
                            <div className="form-outer">
                                <div className="form-item col-12">
                                    <Dhwz >单行文本8</Dhwz>
                                    <div className="mask"></div>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className="form-right">

                    </div>
                </div>
        );
    }
}

const Demo = DragDropContext(HTML5Backend)(DragSortingTable);

export default Demo;