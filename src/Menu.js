import {Redirect,Link} from 'react-router-dom';
import React from 'react';
class Menu extends React.Component{
    render(){
        return (
            <ul>
                <li><Link to="/sort">拖拽排序</Link></li>
                <li><Link to="/table">可调整顺序表格</Link></li>
                <li><Link to="/table-resize">调整宽度+调整顺序表格</Link></li>
            </ul>
        )
    }
}
export default Menu;