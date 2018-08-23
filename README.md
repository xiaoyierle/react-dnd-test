# 结合antd 实现拖拽排序功能
### 给App根组件声明DragDropContext，例如：
```reacthtml
    import React, { Component } from 'react';
    import 'antd/dist/antd.min.css';
    import { DragDropContext, DragSource, DropTarget } from 'react-dnd';
    import HTML5Backend from 'react-dnd-html5-backend';
    import update from 'immutability-helper';
    import {Dhwz} from './modal.js';
    import './App.css';
    
    class App extends Component {}
    export default DragDropContext(HTML5Backend)(App);
```
### 添加DragSource以及DropTarget
```
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
```