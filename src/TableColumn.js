import { Table } from 'antd';
import React from 'react';
import './App.css'
import { DragDropContext, DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'immutability-helper';

function dragDirection(
    dragIndex,
    hoverIndex,
    initialClientOffset,
    clientOffset,
    sourceClientOffset,
) {
    // console.log(sourceClientOffset,initialClientOffset)
    const hoverMiddleX = (initialClientOffset.x - sourceClientOffset.x) / 2;
    const hoverClientX = clientOffset.x - sourceClientOffset.x;
    console.log(hoverClientX,hoverMiddleX)
    if (dragIndex < hoverIndex && hoverClientX > hoverMiddleX) {
        return 'rightward';
    }
    if (dragIndex > hoverIndex && hoverClientX < hoverMiddleX) {
        return 'leftward';
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
                <tr
                    {...restProps}
                    className={className}
                    style={style}
                />
            )
        );
    }
}
class HeaderCell extends React.Component {
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
            if (direction === 'leftward') {
                className += ' drop-over-leftward';
            }
            if (direction === 'rightward') {
                className += ' drop-over-rightward';
            }
        }

        return connectDragSource(
            connectDropTarget(
                <th
                    {...restProps}
                    className={className}
                    style={style}
                />
            )
        );
    }
}

const rowSource = {
    beginDrag(props) {
        console.log(props,'抓起来了');
        return {
            index: props.index,
        };
    },
};

const rowTarget = {
    drop(props, monitor) {
        const dragIndex = monitor.getItem().index;
        const hoverIndex = props.index;
        console.log(props,'准备放下了')
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
const DragableHeaderCell = DropTarget('row', rowTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    sourceClientOffset: monitor.getSourceClientOffset(),
}))(
    DragSource('row', rowSource, (connect, monitor) => ({
        connectDragSource: connect.dragSource(),
        dragRow: monitor.getItem(),
        clientOffset: monitor.getClientOffset(),
        initialClientOffset: monitor.getInitialClientOffset(),
    }))(HeaderCell)
);



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
        columns: [{
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            onHeaderCell: (column) =>({
                index: 0,
                moveRow: this.moveRow
            })
        }, {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
            onHeaderCell: (column) =>({
                index: 1,
                moveRow: this.moveRow
            })
        }, {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
            onHeaderCell: (column) =>({
                index: 2,
                moveRow: this.moveRow
            })
        }],

    }

    components = {
      /*  body: {
            row: DragableBodyRow,
        },*/
        header:{
            cell: DragableHeaderCell,
        }
    }

    moveRow = (dragIndex, hoverIndex) => {
        const { columns } = this.state;
        const dragRow = columns[dragIndex];
        this.renderColumns(
            update(this.state, {
                columns: {
                    $splice: [[dragIndex, 1], [hoverIndex, 0, dragRow]],
                },
            }).columns
        )
    }
    renderColumns = (columns) => {
        columns.forEach((v,i) => {
            v.onHeaderCell= () =>({
                index: i,
                moveRow: this.moveRow
            })
        })
        this.setState({
            columns
        })
    }
    render() {
        return (
            <Table
                bordered
                columns={this.state.columns}
                dataSource={this.state.data}
                components={this.components}
            />
        );
    }
}

const Demo = DragDropContext(HTML5Backend)(DragSortingTable);
export default Demo;