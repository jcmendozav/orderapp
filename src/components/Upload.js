import React, { useState, useEffect } from "react";
import Storage from '@aws-amplify/storage';
import { Auth } from 'aws-amplify';
import FileList from './FileList';


Storage.configure({
    customPrefix: {
        public: 'input/'
    },
    AWSS3: {
        level: 'public',
        bucket: 'pilot-mowa-mail-data-order',
        region: 'us-east-1'
    }
})

const Upload = () => {
    const fileInput = React.useRef();
    const [fileToUploadList, setFileToUploadList] = useState([]);

    //   const config = {
    //     bucketName: process.env.REACT_APP_BUCKET_NAME,
    //     dirName: process.env.REACT_APP_DIR_NAME /* optional */,
    //     region: process.env.REACT_APP_REGION,
    //     accessKeyId: process.env.REACT_APP_ACCESS_ID,
    //     secretAccessKey: process.env.REACT_APP_ACCESS_KEY,
    //   };

    // const handleClick = (event) => {
    //     event.preventDefault();
    //     let newArr = fileInput.current.files;
    //     for (let i = 0; i < newArr.length; i++) {
    //         handleUpload(newArr[i]);
    //     }
    // };

    // const handleUpload = (file) => {

    //     // let file = event.target.files[0];
    //     let fileName = file.name;
    //     let fileType = file.type;
    //     // Size in MB
    //     let fileSize = file.size / 1024 / 1024;

    //     let newFileName = file.name.replace(/\..+$/, "");
    //     // const ReactS3Client = new S3(config);
    //     // ReactS3Client.uploadFile(file, newFileName).then((data) => {
    //     //   if (data.status === 204) {
    //     //     console.log("success");
    //     //   } else {
    //     //     console.log("fail");
    //     //   }
    //     // });

    //     Storage.put(newFileName, file, {
    //         contentType: fileType
    //     })
    //         .then(result => {
    //             console.log(result);
    //             //   setOrder({ ...Order, inputData: newName });
    //             //   console.log(Order);
    //             //   setNewFileName(newName);

    //         }
    //         )
    //         .catch(err => console.log(err));
    // };


    // const addFile = (file) => {
    //     const fileListLocal = fileToUploadList.slice();
    //     const result = fileListLocal.findIndex(t => t.id === file.id);
    //     if (result < 0) {
    //         fileListLocal.push(file);
    //         setFileToUploadList(fileListLocal);
    //         // this.setState({
    //         //     fileList: fileList
    //         // })
    //     }
    //     // if(result && result.length>0)
    // }

    const removeFile = (file) => {

        setFileToUploadList(fileToUploadList.filter(t => t.id != file.id));
        // const fileList = fileList.slice();
        // // const result = fileList.filter(t=>t.id!=file.id);
        // this.setState({
        //     fileList: fileList.filter(t => t.id != file.id)
        // });

    }

    // const saveFileList = () => {
    //     const trackURIs = this.state.fileList.map(t => t.uri);
    //     // Spotify.savePlayList(this.state.playlistName, trackURIs)
    //     // .then(()=>{
    //     //   this.setState({
    //     //     playlistName: 'New Playlist',
    //     //     playlistTracks: []
    //     //   });
    //     // });
    // }

    const handleInputFile = async (event) => {
        console.log("Inside handleInputFile");
       event.preventDefault();

        // event.preventDefault();

        // console.log("Inside handleInputFile");
        // console.log(event.target.files);
        // console.log(Auth.user);
        // let fileList = event.target.files;
        // const fileList = this.state.fileList.slice();
        // console.log(JSON.stringify(fileList));
  
        let id = event.target.id;
        console.log(`id: ${id}`);
    
        let file = event.target.files[0];
        let fileName = file.name;
        let fileType = file.type;
        let userName = Auth.user.username;
        var d = new Date();
        let newName = userName + "_" + d.getTime() + "_" + fileName;
        console.log(`newName: ${newName}`);


        const fileListCopy = fileToUploadList ? fileToUploadList : [];
        // fileListCopy.push(event.target.files[0]);
        let newArr = event.target.files;
        for (let i = 0; i < newArr.length; i++) {
            let e = (newArr[i]);
            console.log(`file.name: ${e.name}`);
            console.log(`file.size: ${e.size}`);
            let id = `${e.name}_${e.size}_${e.type}_${e.lastModified}`;
            e.id =id;
            setFileToUploadList([...fileToUploadList, e]);

        }
        // console.log(JSON.stringify(fileToUploadList));

        console.log(`fileToUploadList: ${JSON.stringify(fileToUploadList)}`);
        fileToUploadList.forEach((file,index)=>console.log(`index ${index}: ${file.name}`));

        // setFileToUploadList(fileListCopy);


    }
    return (
    <div>
            <div className="form-group">


                <label htmlFor="upload">Upload</label>

                <input 
                    type="file"
                    id="file-input-id"
                    onChange={handleInputFile} 
                    className="form-control"
                    // accept='text/csv'
                    // name="file"

                      multiple 
                    // ref={fileInput} 
                    accept=".csv, .pdf, .txt"
                    // onChange={(e)=> {
                    //     // console.log(`fileInput: ${JSON.stringify(fileInput)}`);
                    //     console.log(`e.target.files: ${JSON.stringify(e.target.files)}`);
                    //     handleInputFile(e);
                    // }}
                    // onChange={(e) => handleInputFile(e)}

                    />
            </div>
            <FileList 
            // onRemove={removeFile}
            // onNameChange={this.updatePlaylistName}
            // onSave={this.saveFileList}
            // onAdd={this.addFile} 
            files={fileToUploadList} 
            isRemoval={true}
            onRemove={removeFile}
            />
        </div>
    );
};
export default Upload;
