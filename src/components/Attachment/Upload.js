import React from "react";
import Storage from '@aws-amplify/storage';
// import { Auth } from 'aws-amplify';
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
// const maxSize = 10 * 1024;
// const minSize = 0;


const Upload = ({fileToUploadList,uploadFiles,getTotalSize,removeFile,handleInputFile,multipleFiles,acceptExtentions,formatHumanReadable,openModalLabel}) => {

    // const fileInput = React.useRef();
    // const {fileToUploadList} = props;
    console.log(`fileToUploadList: ${JSON.stringify(fileToUploadList)}`);

    // let subtitle;
    const [modalIsOpen, setIsOpen] = React.useState(false);
    const openModal = () => {
        setIsOpen(true);
    }

    const afterOpenModal = () => {
        // references are now sync'd and can be accessed.
        // subtitle.style.color = '#f00';
    }

    const closeModal = () => {
        setIsOpen(false);
    }

    // const [fileToUploadList, setFileToUploadList] = useState([]);
    // const [validSize, setValidSize] = useState(false);
    // const [alertSizeMsg, setAlertSizeMsg] = useState('');
    // const [filesTotalSize, setFilesTotalSize] = useState(0);


    // const handleClick = (event) => {
    //     // event.preventDefault();
    //     // let newArr = fileInput.current.files;

    //     uploadFiles(event)
    // };

    
    return (
        <div>
            <button onClick={openModal}>{openModalLabel}</button>
            <Modal
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Edit attachments"
            >
                {/* <h2 ref={_subtitle => (subtitle = _subtitle)}>Hello</h2> */}
                {/* <button onClick={closeModal}>close</button> */}
                {/* <div>I am a modal</div> */}
                <div className="form-group">
                    <label htmlFor="upload">Select</label>
                    {multipleFiles && (<input
                        type="file"
                        id="file-input-id"
                        onChange={handleInputFile}
                        className="form-control"
                        accept={acceptExtentions}
                        multiple

                    />)}
                    {!multipleFiles && (<input
                        type="file"
                        id="file-input-id"
                        onChange={handleInputFile}
                        className="form-control"
                        accept={acceptExtentions}
                    />)}
                </div>
                <div>
                    <label >Total size: {formatHumanReadable(getTotalSize())}</label>
                </div>

                {/* {(getTotalSize() > 0) && (<button onClick={handleClick}>Upload files!!!</button>)} */}
                <FileList

                    files={fileToUploadList}
                    isRemoval={true}
                    onRemove={removeFile}
                    formatHumanReadable={formatHumanReadable}
                />
            </Modal>

        </div>
    );
};
export default Upload;
