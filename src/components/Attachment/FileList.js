import React from 'react';
import './FileList';
import File from './File';

class FileList extends React.Component{
    render(){
        // console.log(`files: ${JSON.stringify(this.props)}`);
        return (<div className="FileList">
        {/* <!-- You will add a map method that renders a set of file components  --> */}
        {this.props.files && this.props.files.map((file,index)=>{
            return (<File file={file} key={index} onAdd={this.props.onAdd} onRemove={this.props.onRemove} isRemoval={this.props.isRemoval} />);
        })}
    </div>);
    }
}

export default FileList;