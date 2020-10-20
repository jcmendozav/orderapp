import React, { useState, useEffect } from "react";
import Storage from '@aws-amplify/storage';
import { Auth } from 'aws-amplify';
import FileList from './FileList';
import Modal from 'react-modal';
// import Select from "react-select";

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
};
Modal.setAppElement('#root')


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
const maxSize = 10 * 1024;
// const minSize = 0;


const Upload = ({fileToAttachList}) => {

    // const fileInput = React.useRef();
    // const {fileToAttachList} = props;
    console.log(`fileToAttachList: ${JSON.stringify(fileToAttachList)}`);

    let subtitle;
    const [modalIsOpen, setIsOpen] = React.useState(false);
    const openModal = () => {
        setIsOpen(true);
    }

    const afterOpenModal = () => {
        // references are now sync'd and can be accessed.
        subtitle.style.color = '#f00';
    }

    const closeModal = () => {
        setIsOpen(false);
    }

    const [fileToUploadList, setFileToUploadList] = useState([]);
    const [validSize, setValidSize] = useState(false);
    const [alertSizeMsg, setAlertSizeMsg] = useState('');
    const [filesTotalSize, setFilesTotalSize] = useState(0);


    const handleClick = (event) => {
        // event.preventDefault();
        // let newArr = fileInput.current.files;

        for (let i = 0; i < fileToUploadList.length; i++) {
            handleUpload(fileToUploadList[i]);
        }
    };

    const handleUpload = (file) => {

        // let file = event.target.files[0];
        let fileName = file.name;
        let fileType = file.type;
        // Size in MB
        // let fileSize = file.size / 1024 / 1024;

        let userName = Auth.user.username;
        var d = new Date();
        let newFileName = userName + "_" + d.getTime() + "_" + fileName;
        console.log(`newName: ${newFileName}`);

        // let newFileName = file.name.replace(/\..+$/, "");

        console.log(`Uploading new file to s3: ${newFileName}`);


        Storage.put(newFileName, file, {
            contentType: fileType
        })
            .then(result => {
                console.log(JSON.stringify(result));
                //   setOrder({ ...Order, inputData: newName });
                //   console.log(Order);
                //   setNewFileName(newName);

            }
            )
            .catch(err => console.log(err));
    };


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

    const getTotalSize = () => {

        return (fileToUploadList.map(e => e.size).reduce((acc, cur) => { acc += cur; return acc; }, 0));
    }
    const removeFile = (file) => {
        setFileToUploadList(fileToUploadList.filter(t => t.id != file.id));
    }


    const handleInputFile = async (event) => {

        console.log("Inside handleInputFile");
        event.preventDefault();
        const currentSize = getTotalSize();

        let id = event.target.id;
        console.log(`id: ${id}`);

        let newArr = event.target.files;
        let newSize = 0;

        for (let i = 0; i < newArr.length; i++) {
            let e = (newArr[i]);
            // console.log(`file.name: ${e.name}`);
            // console.log(`file.size: ${e.size}`);
            let id = `${e.name}_${e.size}_${e.type}_${e.lastModified}`;
            e.id = id;

            newSize += e.size;

        }

        const potentialSize = newSize + currentSize;
        // console.log(`potentialSize: ${potentialSize}, currentSize: ${currentSize}, newSize: ${newSize}`);

        if (potentialSize >= maxSize) {
            setValidSize(false);
            alert(`Files size not allowed: ${potentialSize} bytes > ${maxSize} bytes`);
            // setAlertSizeMsg(`Files size not allowed: ${potentialSize} bytes > ${maxSize} bytes`);
            return;
        } else {
            setValidSize(true);
            // setAlertSizeMsg(`Total size: ${potentialSize}`);
        }

        // console.log(`Adding: ${JSON.stringify(newArr)}`);
        setFileToUploadList([...fileToUploadList, ...newArr]);

        // console.log(`fileToUploadList: ${JSON.stringify(fileToUploadList)}`);
        fileToUploadList.forEach((file, index) => console.log(`index ${index}: ${file.name}`));



    }
    return (
        <div>
            <button onClick={openModal}>Open Modal</button>
            <Modal
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Edit attachments"
            >
                <h2 ref={_subtitle => (subtitle = _subtitle)}>Hello</h2>
                <button onClick={closeModal}>close</button>
                {/* <div>I am a modal</div> */}
                <div className="form-group">
                    <label htmlFor="upload">Upload</label>
                    <input
                        type="file"
                        id="file-input-id"
                        onChange={handleInputFile}
                        className="form-control"

                        multiple
                        // ref={fileInput} 
                        accept=".csv, .pdf, .txt"


                    />
                </div>
                <div>
                    <label >Total size: {getTotalSize()}</label>
                </div>

                {(getTotalSize() > 0) && (<button onClick={handleClick}>Upload files!!!</button>)}
                <FileList

                    files={fileToUploadList}
                    isRemoval={true}
                    onRemove={removeFile}
                />
            </Modal>

        </div>
    );
};
export default Upload;
