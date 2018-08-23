import React,{Component} from 'react';
import {Input} from 'antd';
import '../App.css'
class Dhwz extends Component{
    render(){
        let classWidth = 'col-12';
        if(this.props.width === 0.25) {
            classWidth = 'col-3'
        }
        else if(this.props.width === 0.5){
            classWidth = 'col-6'
        }
        else if (this.props.width === 0.75){
            classWidth = 'col-9'
        }
        else {
            classWidth = 'col-12'
        }
        return(
            <div className={['form-item',classWidth].join(' ')}>
                <div className='dhwz' { ...this.props}>
                    <p>{this.props.children}</p>
                    <Input/>
                </div>
                <div className="mask"></div>
            </div>
        )
    }
};
export default Dhwz ;