import { Table,Radio } from 'antd';
import React from 'react';
import './App.css'
import { DragDropContext, DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import { Resizable } from 'react-resizable';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
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
            onResize,
            width,
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
            width: 100,
        }, {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
            width: 100,
        }, {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
            width: 100,
        }],
        type: 0, // 类型 0 不修改   1  调整列宽    2   调整顺序

    }



    moveRow = (dragIndex, hoverIndex) => {
        const { columns } = this.state;
        const dragRow = columns[dragIndex];
        this.setState(update(this.state, {
            columns: {
                $splice: [[dragIndex, 1], [hoverIndex, 0, dragRow]],
            },
        }))
    }

    handleResize = index => (e, { size }) => {
        this.setState(({ columns }) => {
            const nextColumns = [...columns];
            nextColumns[index] = {
                ...nextColumns[index],
                width: size.width,
            };
            return { columns: nextColumns };
        });
    };
    ResizeableTitle = (props) => {
        const { onResize, width, moveRow,index,...restProps } = props;
        console.log(this.props)
        if (!width) {
            return <th {...restProps} />;
        }
        return (
            <Resizable width={width} height={0} onResize={onResize}>
                <th {...restProps} />
            </Resizable>
        );
    };
    onChange = (e) => {
        console.log(`radio checked:${e.target.value}`);
        this.setState({
            type: e.target.value
        })
    }
    render() {
        const columns = this.state.columns.map((col, index) => ({
            ...col,
            onHeaderCell: column => ({
                width: column.width,
                onResize: this.handleResize(index),
                index: index,
                moveRow: this.moveRow
            }),
        }));



        const components = {
            /*  body: {
                  row: DragableBodyRow,
              },*/
            header:{
                cell: this.state.type === 1 ? this.ResizeableTitle :  DragableHeaderCell ,
            }
        }
        return (
            <div>
                <RadioGroup onChange={this.onChange} defaultValue="a">
                    <RadioButton value={1}>调整列宽</RadioButton>
                    <RadioButton value={2}>调整顺序</RadioButton>
                </RadioGroup>
                <Table
                    bordered
                    columns={columns}
                    dataSource={this.state.data}
                    components={components}
                />
            </div>
        );
    }
}

const Demo = DragDropContext(HTML5Backend)(DragSortingTable);
export default Demo;