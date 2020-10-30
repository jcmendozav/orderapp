import React, { useState, useEffect } from "react";
import OrderDataService from "../../services/OrderService";
import Storage from '@aws-amplify/storage'
import { Auth, sectionBody } from 'aws-amplify'
import DateTimePicker from 'react-datetime-picker';
import TemplateDataService from "../../services/TemplateService";
import IdentityService from "../../services/IdentityService";
import Select from 'react-select';
// import {default as Select} from 'react-select'

// import { default as Select } from "react-select";
// import Select from "react-select/lib/Select";

import Upload from "../Attachment/Upload";
import ProgressBar from "../ProgressBar/PrograssBar";


// import API, { graphqlOperation } from '@aws-amplify/api';
// const apiName = 'api927be96a'; // replace this with your api name.
// const path = '/orders'; //replace this with the path you have configured on your API
// const myInit = {
//   body: {}, // replace this with attributes you need
//   headers: {
//     "Access-Control-Allow-Origin": "*"
//   }, // OPTIONAL
// };


const s3Configuration = {
  customPrefix: {
    public: 'input/'
  },
  AWSS3: {
    level: 'public',
    bucket: 'pilot-mowa-mail-data-order',
    region: 'us-east-1'
  }
};
Storage.configure(s3Configuration);

const maxAttachmentSize = 8 * 1024 * 1024; // 8MB
const maxAttachmentNumber = 10; // TODO

const maxTemplateDataFileSize = 10 * 1024 * 1024; // 10MB
const maxTemplateDataFileNumber = 1; // TODO

const AddOrder = () => {
  const initialOrderState = {
    // id: null,
    // title: "",
    orderType: "pushMailAttachment",
    configuration: "PilotConfigurationSet",
    quota: 10,
    time: 60,
    scheduleDate: new Date(),
    inputData: "",
    replyTo: "",
    sourceTitle: ""
  };
  const [Order, setOrder] = useState(initialOrderState);
  const [submitted, setSubmitted] = useState(false);
  const [value, onDateChange] = useState(new Date());
  const [orderError, setOrderError] = useState('');
  const [templates, setTemplates] = useState([]);
  const [templatesOption, setTemplatesOption] = useState([]);
  const [identitiesOption, setIdentitiesOption] = useState([]);

  const [fileToAttachList, setFileToAttachList] = useState([]);
  // const [attachmentsInfo, setAttachmentsInfo] = useState([]);
  let attachmentsInfo;
  const [templateDataFile, setTemplateDataFile] = useState();
  // const [templateDataFileInfo, setTemplateDataFileInfo] = useState({});
  let templateDataFileInfo;
  // const [fileToUploadList, setFileToAttachList] = useState([]);

  const [validReplyToAddress, setValidReplyToAddress] = useState(true);

  const [progressLog, setProgressLog] = useState([]);

  const [completed, setCompleted] = useState(0);

  const retrieveTemplates = () => {
    TemplateDataService.getAll()
      .then(response => {
        let sortedTemplates = response.data.slice().sort((a, b) => (new Date(b.CreatedTimestamp)).getTime() - (new Date(a.CreatedTimestamp)).getTime());

        setTemplates(sortedTemplates);
        setTemplatesOption(sortedTemplates.map(template => {
          return {
            value: template.id,
            label: template.Name
          }
        }));
        console.log(sortedTemplates);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const retrieveIdentities = () => {
    IdentityService.getAll()
      .then(response => {
        // let sortedTemplates = response.data.slice().sort((a, b) => (new Date(b.CreatedTimestamp)).getTime() - (new Date(a.CreatedTimestamp)).getTime());

        // setTemplates(sortedTemplates);
        setIdentitiesOption(response.data.slice()
          .filter(identity => identity.VerificationStatus === 'Success')
          .map(identity => {
            return {
              value: identity.id,
              label: identity.identity
            }
          }));
        // console.log(sortedTemplates);
      })
      .catch(e => {
        console.log(e);
      });
  };

  useEffect(() => {
    retrieveTemplates();
    retrieveIdentities();
  }, []);

  // const _handleInputTemplateDataFile = async (event) => {
  //   // console.log("Inside handleInputTemplateDataFile");
  //   // console.log(event.target.files);
  //   // console.log(Auth.user);

  //   let file = event.target.files[0];
  //   setTemplateDataFile(file);
  //   let fileName = file.name;
  //   let fileType = file.type;
  //   let userName = Auth.user.username;
  //   var d = new Date();
  //   let newName = userName + "_" + d.getTime() + "_" + fileName;
  //   // let newName = fileName;
  //   console.log("New file name: " + newName);
  //   // const { key } = await Storage.put(newName, file, {
  //   Storage.put(newName, file, {
  //     contentType: fileType
  //   })
  //     .then(result => {
  //       console.log(result);
  //       setOrder({ ...Order, inputData: newName });
  //       console.log(Order);
  //       setNewFileName(newName);

  //     }
  //     )
  //     .catch(err => console.log(err));

  //   // Storage.get(newName)
  //   // .then(result => console.log(result))
  //   // .catch(err => console.log(err));


  //   // console.log('S3 Object key', key)
  // }


  const readFileLines = file => {
    if (!file) return;
    const reader = new FileReader();

    reader.onload = (event) => {
      const file = event.target.result;
      const allLines = file.split(/\r\n|\n/);
      // Reading line by line
      allLines.forEach((line) => {
        console.log(line);
      });
    };

    reader.onerror = (event) => {
      alert(event.target.error.name);
    };

    reader.readAsText(file);
  }
  const handleInputTemplateDataFile = async (event) => {
    console.log("Inside handleInputTemplateDataFile");
    event.preventDefault();
    // let id = event.target.id;
    // console.log(`id: ${id}`);
    let file = event.target.files[0];
    if (file.size >= maxTemplateDataFileSize) {
      // setValidSize(false);
      alert(`Files size not allowed: ${formatHumanReadable(file.size)} bytes > ${formatHumanReadable(maxTemplateDataFileSize)} `);
      // setAlertSizeMsg(`Files size not allowed: ${potentialSize} bytes > ${maxAttachmentSize} bytes`);
      return;
    }
    // readFileLines(file);
    setTemplateDataFile(file);


    // console.log(`Adding: ${JSON.stringify(newArr)}`);
    // setTemplateDataFileList([...templateDataFileList, ...newArr]);

  }
  const uploadTemplateDataFile = async () => {
    readFileLines(templateDataFile);
    const storageResponse = await uploadToStorage(templateDataFile);
    // setTemplateDataFileInfo(storageResponse);
    templateDataFileInfo = storageResponse;
    console.log(`templateDataFileInfo: ${templateDataFileInfo}`);
    // readFileLines(templateDataFileInfo);
    pushProgressLog('Template uploading success');

  }

  const handleInputChange = event => {
    const { name, value } = event.target;
    setOrder({ ...Order, [name]: value });
    // console.log(response.data);

  };

  const handleDateInputChange = event => {
    // const { name, value } = event.target;
    // setOrder({ ...Order, [name]: value });
    if (!event) return;
    console.log(event.toISOString());
    setOrder({ ...Order, scheduleDate: event });
    console.log(Order);

    onDateChange(event);

  };






  //
  // Attachment section begin
  //

  const uploadToStorage = async file => {
    if (!file) return;
    console.log(`uploadToStorage: ${file.name}`);

    try {
      // const response = await fetch(file.uri);

      // const blob = await response.blob();
      let fileName = file.name;
      let fileType = file.type;
      let userName = Auth.user.username;
      var d = new Date();
      let newFileName = userName + "_" + d.getTime() + "_" + fileName;
      const storageResponse = await Storage.put(newFileName, file, {
        contentType: fileType,
      });
      console.log(`uploadToStorage: ${newFileName} -> ${JSON.stringify(storageResponse)}`);
      readFileLines(file);
      return {
        "name": fileName,
        "key": `${s3Configuration.customPrefix.public}${storageResponse.key}`,
        "responseKey": storageResponse.key,
        "bucket": s3Configuration.AWSS3.bucket
      }

    } catch (err) {
      console.log(err);
      throw Error(err);
    }
  }

  const uploadAttachments = async (event) => {
    if (fileToAttachList && fileToAttachList.length == 0) return;
    attachmentsInfo = await Promise.all(fileToAttachList.map(file => uploadToStorage(file)));
    console.log(`attachmentsInfo: ${attachmentsInfo}`);
    pushProgressLog('Attachments uploading success');

  };


  const handleInputAttachment = async (event) => {
    console.log("Inside handleInputAttachment");
    event.preventDefault();
    const currentSize = getAttachmentTotalSize();
    let id = event.target.id;
    console.log(`id: ${id}`);
    let newArr = event.target.files;
    let newSize = 0;

    for (let i = 0; i < newArr.length; i++) {
      let e = (newArr[i]);
      let id = `${e.name}_${e.size}_${e.type}_${e.lastModified}`;
      e.id = id;
      newSize += e.size;
    }

    const potentialSize = newSize + currentSize;

    if (potentialSize >= maxAttachmentSize) {
      // setValidSize(false);
      alert(`Files size not allowed: ${formatHumanReadable(potentialSize)}  > ${formatHumanReadable(maxAttachmentSize)} `);
      // setAlertSizeMsg(`Files size not allowed: ${potentialSize} bytes > ${maxAttachmentSize} bytes`);
      return;
    } else {
      // setValidSize(true);
      // setAlertSizeMsg(`Total size: ${potentialSize}`);
    }

    // console.log(`Adding: ${JSON.stringify(newArr)}`);
    setFileToAttachList([...fileToAttachList, ...newArr]);

    // console.log(`fileToAttachList: ${JSON.stringify(fileToAttachList)}`);
    // fileToAttachList.forEach((file, index) => console.log(`index ${index}: ${file.name}`));



  }



  // const addFile = (file) => {
  //     const fileListLocal = fileToAttachList.slice();
  //     const result = fileListLocal.findIndex(t => t.id === file.id);
  //     if (result < 0) {
  //         fileListLocal.push(file);
  //         setFileToAttachList(fileListLocal);
  //         // this.setState({
  //         //     fileList: fileList
  //         // })
  //     }
  //     // if(result && result.length>0)
  // }

  const getAttachmentTotalSize = () => {

    return (fileToAttachList.map(e => e.size).reduce((acc, cur) => { acc += cur; return acc; }, 0));
  }

  const getAttachmentNumber = () => {

    return fileToAttachList.length;
  }

  const formatHumanReadable = (bytes) => {
    const sufixes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return !bytes && '0 Bytes' || (bytes / Math.pow(1024, i)).toFixed(2) + " " + sufixes[i];

  }
  const removeAttachmentFile = (file) => {
    setFileToAttachList(fileToAttachList.filter(t => t.id != file.id));
  }


  //
  // Attachment section end
  //



  const validateEmail = email => {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  const validateReplyTo = email => {
    return email ? validateEmail(email) : true;
  }
  const getProgressLog = () => {
    return progressLog ? progressLog.reduce((acc, cur) => {
      acc += `${cur}` + '\n';
      return acc;
    }, "") : '';
  }

  const pushProgressLog = (message) => {
    setProgressLog([...progressLog, message]);

  }
  const orderFormError = (data) => {
    if (!validReplyToAddress) {
      return "Invalid reply to address, try again";
    }

    if (!fileToAttachList) {
      return "Invalid attachmentsInfo, try again";
    }
    if (!templateDataFile) {
      return "Invalid templateDataFileInfo, try again";
    }
    if (!data.template) {
      return "Invalid template, try again";
    }
    if (!data.configuration) {
      return "Invalid configuration, try again";
    }
    if (!data.source) {
      return "Invalid source, try again";
    }

    return false;
  };

  const saveOrder = async () => {


    const error = orderFormError(Order);
    if (error) {
      alert(error);
      // setOrderError(error);
      return;
    }
    pushProgressLog('Order form valid');
    setCompleted(1);

    try {

      await uploadAttachments();
      setCompleted(33);
      await uploadTemplateDataFile();
      setCompleted(66);

      // return;

      // pushProgressLog('Template data uploading success');


      // console.log(`templateDataFileInfo: ${JSON.stringify(templateDataFileInfo)}`);
      // console.log(`attachmentsInfo: ${JSON.stringify(attachmentsInfo)}`);




      var data = {
        orderType: Order.orderType,
        userId: Auth.user.username,
        name: Order.orderName,
        details: {
          scheduleDate: Order.scheduleDate.toISOString(),
          // inputData: Order.inputData,
          inputData: templateDataFileInfo.responseKey,
          quota: parseInt(Order.quota),
          time: parseInt(Order.time),
          configuration: (Order.configuration),
          template: (Order.template.value),
          source: (Order.source.value),
          sourceTitle: (Order.sourceTitle),
          replyTo: Order.replyTo,
          templateDataFileInfo,
          attachmentsInfo
        }
      };

      // console.log(`data request: ${JSON.stringify(data)}`);

      // return;
      // if(!Order.inputData){

      // }
      let response = await OrderDataService.create(data);

      setOrder({
        id: response.data.orderId
        // title: response.data.title,
        // description: response.data.description,
        // published: response.data.published
      });
      setCompleted(100);
      pushProgressLog('Order sent');

      await new Promise(r => setTimeout(r, 2000));

      setSubmitted(true);

    } catch (e) {
      console.log(e);
      pushProgressLog(e);
    }

    // console.log("API.post :"+apiName);

    // myInit['body']=data;
    // API
    // .post(apiName, path, myInit)
    // .then(response => {
    //   // Add your code here

    //     setOrder({
    //       id: response.data.id,
    //       title: response.data.title,
    //       description: response.data.description,
    //       published: response.data.published
    //     });
    //     setSubmitted(true);
    //     console.log(response.data);
    // })
    // .catch(error => {
    //   console.log(error);
    // });

  };
  const newOrder = () => {
    setOrder(initialOrderState);
    setSubmitted(false);
    setProgressLog([]);
    setFileToAttachList([]);
    setTemplateDataFile([]);
    setValidReplyToAddress(true);
  };
  return (
    <div className="list row">
      {submitted ? (
        <div>
          <h4>You submitted successfully! OrderId:</h4>
          <h4>{Order.id}</h4>
          <button className="btn btn-success" onClick={newOrder}>
            Add
          </button>
        </div>
      ) : (
          <div >
            <h4>Add Order</h4>

            <div className="article-container" >


              <div className="form-group">
                <label htmlFor="scheduleDate">Schedule Date</label>
                <DateTimePicker
                  id="scheduleDate"
                  className="form-control"
                  onChange={handleDateInputChange}
                  value={Order.scheduleDate}
                  format="y-MM-ddTHH:mm:ss"
                  name="scheduleDate"
                  menuPosition="fixed"
                />
              </div>

              <div className="form-group">
                <label htmlFor="template">Template</label>
                <Select
                  // value={options.filter((option) => option.value === currentOrder.status)}
                  onChange={(event) => handleInputChange({ target: { name: 'template', value: event } })}
                  options={templatesOption}
                  // isDisabled={!canEditStatus}
                  menuPosition="fixed"

                />
              </div>
              <div className="form-group">
                <label htmlFor="source">Source</label>
                <Select
                  // value={options.filter((option) => option.value === currentOrder.status)}
                  onChange={(event) => handleInputChange({ target: { name: 'source', value: event } })}
                  options={identitiesOption}
                  // isDisabled={!canEditStatus}
                  autosize={false}
                  menuPosition="fixed"
                />
              </div>
              <div className="form-group">
                <label htmlFor="replyTo">Reply to</label>
                <input
                  type="email"
                  className="form-control"
                  id="replyTo"
                  required
                  // readOnly
                  value={Order.replyTo}
                  onChange={handleInputChange}
                  onBlur={() => { setValidReplyToAddress(validateReplyTo(Order.replyTo)) }}
                  name="replyTo"
                />
              </div>
              <div className="form-group">
                <label htmlFor="sourceTitle">Source Title</label>
                <input
                  type="text"
                  className="form-control"
                  id="sourceTitle"
                  required
                  // readOnly
                  value={Order.sourceTitle}
                  onChange={handleInputChange}
                  name="sourceTitle"
                />
              </div>
              <div className="form-group">
                <label htmlFor="orderName">Order name</label>
                <input
                  type="text"
                  className="form-control"
                  id="orderName"
                  required
                  // readOnly
                  value={Order.orderName}
                  onChange={handleInputChange}
                  name="orderName"
                />
              </div>

              <div className="form-group">
                <label htmlFor="quota">Quota</label>
                <input
                  type="number"
                  className="form-control"
                  id="quota"
                  required
                  value={Order.quota}
                  onChange={handleInputChange}
                  name="quota"
                />
              </div>
              <div className="form-group">
                <label>Interval</label>
                <input
                  type="number"
                  className="form-control"
                  id="time"
                  required
                  value={Order.time}
                  onChange={handleInputChange}
                  name="time"
                />
              </div>

              <div className="form-group">
                <label htmlFor="time">Template data file</label>
                <input
                  type="file"
                  className="form-control"
                  id="file"
                  accept='text/csv'
                  required
                  value={Order.file}
                  onChange={(e) => handleInputTemplateDataFile(e)}
                  name="file"
                />
              </div>

              <div className="form-group">
                <label htmlFor="Attachments">Attachments: {getAttachmentNumber()}, size: {formatHumanReadable(getAttachmentTotalSize())}</label>
                <Upload
                  fileToUploadList={fileToAttachList}
                  uploadFiles={uploadAttachments}
                  getTotalSize={getAttachmentTotalSize}
                  removeFile={removeAttachmentFile}
                  handleInputFile={handleInputAttachment}
                  formatHumanReadable={formatHumanReadable}
                  multipleFiles={true}
                  openModalLabel={"Edit attachments"}
                  acceptExtentions={".csv, .pdf, .txt"}
                />
              </div>
              <div className="form-group">
                <label htmlFor="orderType">Order Type</label>
                <input
                  type="text"
                  className="form-control"
                  id="orderType"
                  required
                  readOnly
                  value={Order.orderType}
                  onChange={handleInputChange}
                  name="orderType"
                />
              </div>
              <div className="form-group">
                <label htmlFor="configuration">Configuration</label>
                <input
                  type="text"
                  className="form-control"
                  id="configuration"
                  required
                  readOnly
                  value={Order.configuration}
                  onChange={handleInputChange}
                  name="configuration"
                />
              </div>



            </div>
            <div>
              {progressLog.length > 0 &&
                <label className='inProgress'>{getProgressLog()}</label>

              }
            </div>

            <div>
              {Order.inputData &&
                <label className='success'>File uploaded successfully</label>

              }
            </div>
            <div>
              {orderError &&
                <label className='error'>{orderError}</label>

              }
            </div>
            <div>

            </div>


            <button onClick={saveOrder} className="btn btn-success">
              Submit
          </button>
            <p></p>
            {completed > 0 && <div><ProgressBar bgcolor={"#6a1b9a"} completed={completed} /></div>}

          </div>

        )
      }
    </div >
  );
};

export default AddOrder;
