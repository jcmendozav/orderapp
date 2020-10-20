import React from 'react';
import './File.css'; 

class File extends React.Component{

    constructor(props){
        super(props);
        this.addFile=this.addFile.bind(this);
        this.removeFile = this.removeFile.bind(this);
    }
    renderAction(){
        if(this.props.isRemoval){
            return (<button className="File-action" onClick={this.removeFile}>-</button>);
        }
        return (<button className="File-action" onClick={this.addFile}>+</button>);

    }

    addFile(){
        this.props.onAdd(this.props.file);
    }

    removeFile(){
        this.props.onRemove(this.props.file);
    }
    render(){
        return (<div className="File">
        <div className="File-information">
          <h3>
              {/* <!-- File name will go here --> */}
              {this.props.file.name} | {this.props.file.size}
              </h3>
          <p>
              {/* <!-- File artist will go here--> | <!-- File album will go here --> */}
              {/* {this.props.file.name} | {this.props.file.size} */}

              </p>
        </div>
        {this.renderAction()}

      </div>);
    }
}

export default File;