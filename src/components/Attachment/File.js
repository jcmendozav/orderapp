import React from 'react';
import './File.css'; 
import DateHelper from "../../util/date";


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
            
              {/* Name: {this.props.file.name}, size: {this.props.formatHumanReadable(this.props.file.size)} */}
              <h3>
              {/* <!-- track name will go here --> */}
              {this.props.file.name}
              </h3>
          <p>
              {/* <!-- track artist will go here--> | <!-- track album will go here --> */}
              Last modified data: {DateHelper.convertStrDateToLocalDateString(new Date(this.props.file.lastModified))} | Size: {this.props.formatHumanReadable(this.props.file.size)}
              </p>
        </div>
        {this.renderAction()}

      </div>);
    }
}

export default File;