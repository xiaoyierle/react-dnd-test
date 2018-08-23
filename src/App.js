import React, { Component } from 'react';
import 'antd/dist/antd.min.css';
import { DragDropContext, DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import {Dhwz} from './modal.js';
import './App.css';

class Test extends Component{
    dragDirection = (
        dragIndex,
        hoverIndex,
        initialClientOffset,
        clientOffset,
        sourceClientOffset,
    ) => {
        const hoverMiddleY = (initialClientOffset.y - sourceClientOffset.y) / 2;
        const hoverClientY = clientOffset.y - sourceClientOffset.y;
        if (dragIndex < hoverIndex && hoverClientY > hoverMiddleY) {
            return 'downward';
        }
        if (dragIndex > hoverIndex && hoverClientY < hoverMiddleY) {
            return 'upward';
        }
    }
    render() {
        const {
            connectDragSource,
            isDragging ,
            isOver,
            dragRow,
            moverow,
            clientOffset,
            sourceClientOffset,
            initialClientOffset,
            connectDropTarget,
            ...restProps
        } = this.props;
        const style = { ...restProps.style, cursor: 'move' };
        let className = restProps.className;
        // 判断向上移动还是向下移动
        if (isOver && initialClientOffset) {
            const direction = this.dragDirection(
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
        if(isDragging){
            className += ' dragging';
        }
        return connectDragSource(
                connectDropTarget(
                    <div {...restProps}
                         style={style}
                         className={className}
                    >
                    </div>
                )
        );
    }
}
const rowSource = {
    beginDrag(props) {
        return {
            index: props.index,
        };
    },
};

const rowTarget = {
    drop(props, monitor) {
        const dragIndex = monitor.getItem().index;
        const hoverIndex = props.index;
        // Don't replace items with themselves
        if (dragIndex === hoverIndex) {
            return;
        }

        // Time to actually perform the action
        props.moverow.moveRow(dragIndex, hoverIndex);

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
    DragSource('row',rowSource,(connector, monitor) => ({
            connectDragSource: connector.dragSource(),
            isDragging: monitor.isDragging(),
            initialClientOffset: monitor.getInitialClientOffset(),
            dragRow: monitor.getItem(),
            clientOffset: monitor.getClientOffset(),
            initialClientOffset: monitor.getInitialClientOffset(),
        })
    )(Test)
);
// 单独获取方法点击后可以看到弹出效果
/*const DragSource = DragSource('row',rowSource,(connector, monitor) => ({
        connectDragSource: connector.dragSource(),
        isDragging: monitor.isDragging(),
        initialClientOffset: monitor.getInitialClientOffset(),
    })
)(Test)*/
class DragSortingTable extends React.Component {
    state = {
        data: [
            {
                key: '1',
                title: '',
                width:1,
                childrenCount: 1,
                children:[
                    {
                        key: '5',
                        title: '单行文本1',
                        width: 0.25,
                        level:2,
                        type: 'dhwz',
                    },
                ],
                level:1,
            }, {
                key: '2',
                title: '',
                width: 1,
                childrenCount: 2,
                children:[
                    {
                        key: '6',
                        title: '单行文本2',
                        width: 0.5,
                        level:2,
                        type: 'dhwz',
                    },
                    {
                        key: '7',
                        title: '单行文本3',
                        width: 0.5,
                        level:2,
                        type: 'dhwz',
                    },
                ],
                level:1,
            }, {
                key: '3',
                title: '',
                width: 1,
                childrenCount: 3,
                level:1,
                children:[
                    {
                        key: '8',
                        title: '单行文本4',
                        width: 0.25,
                        level:2,
                        type: 'dhwz',
                    },
                    {
                        key: '9',
                        title: '单行文本5',
                        width: 0.5,
                        level:2,
                        type: 'dhwz',
                    },
                    {
                        key: '10',
                        title: '单行文本6',
                        width: 0.25,
                        level:2,
                        type: 'dhwz',
                    },
                ],
                level:1,
            }, {
                key: '4',
                title: '单行文本7',
                width:1,
                childrenCount: 1,
                level:1,
                children:[
                    {
                        key: '11',
                        title: '单行文本7',
                        width: 0.25,
                        level:2,
                        type: 'dhwz',
                    },
                ],
            },
        ],
    }
    moveRow = (dragIndex, hoverIndex) => {
        const { data } = this.state;
        const dragRow = data[dragIndex];
        this.setState(
            update(this.state, {
                data: {
                    $splice: [[dragIndex, 1], [hoverIndex, 0, dragRow]],
                },
            })
        )
    }
    formNodes = (data) => {
        return data.map((item,i) => {
            if(item.level === 1){
                return (
                    <DragableBodyRow className="form-outer" key={i} index={i} moverow={{moveRow: this.moveRow}}>
                        {this.formNodes(item.children)}
                    </DragableBodyRow>
                )
            }
            else {
                switch (item.type) {
                    case 'dhwz':
                        return <Dhwz width={item.width} key={item.key} index={item.key}>{item.title}</Dhwz>
                        break;
                    default:
                        break;
                }
            }
        })
    }
    render() {
        let formNodes = this.formNodes(this.state.data)
        return (

                <div className="form-builder">
                    <div className="form-left">

                    </div>
                    <div className="form-body">
                        <div className="form-body-header">

                        </div>
                        <div className="form-body-content">
                            {formNodes}
                            {/*<DragableBodyRow className="form-outer">
                                <Dhwz>单行文本1</Dhwz>
                            </DragableBodyRow>
                            <DragableBodyRow className="form-outer">
                                <Dhwz>单行文本9</Dhwz>
                            </DragableBodyRow>
                            <DragableBodyRow className="form-outer">
                                <Dhwz>单行文本2</Dhwz>
                            </DragableBodyRow>
                            <DragableBodyRow className="form-outer">
                                <Dhwz>单行文本3</Dhwz>
                            </DragableBodyRow>
                            <DragableBodyRow className="form-outer">
                                <Dhwz>单行文本4</Dhwz>
                            </DragableBodyRow>
                            <DragableBodyRow className="form-outer">
                                <Dhwz>单行文本5</Dhwz>
                            </DragableBodyRow>
                            <DragableBodyRow className="form-outer">
                                <Dhwz width={0.25}>单行文本6</Dhwz>
                                <Dhwz width={0.5}>单行文本6</Dhwz>
                                <Dhwz width={0.25}>单行文本6</Dhwz>
                            </DragableBodyRow>
                            <DragableBodyRow className="form-outer">
                                <Dhwz width={0.25}>单行文本7</Dhwz>
                                <Dhwz width={0.25}>单行文本9</Dhwz>
                                <Dhwz width={0.25}>单行文本9</Dhwz>
                                <Dhwz width={0.25}>单行文本9</Dhwz>
                            </DragableBodyRow>
                            <DragableBodyRow className="form-outer">
                                <Dhwz>单行文本8</Dhwz>
                            </DragableBodyRow>*/}

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