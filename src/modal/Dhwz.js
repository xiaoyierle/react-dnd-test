import React,{Component} from 'react';
import {Input} from 'antd';
import '../App.css'
class Dhwz extends Component{
    render(){
        return(
            <div className='dhwz' { ...this.props}>
                <p>{this.props.children}</p>
                <Input/>
            </div>
        )
    }
};
export default Dhwz ;