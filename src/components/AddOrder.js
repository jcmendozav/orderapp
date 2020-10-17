import React, { useState, useEffect } from "react";
import OrderDataService from "../services/OrderService";
import Storage from '@aws-amplify/storage'
import { Auth } from 'aws-amplify'
import DateTimePicker from 'react-datetime-picker';
import TemplateDataService from "../services/TemplateService";
import IdentityService from "../services/IdentityService";
import Select from 'react-select'


// import API, { graphqlOperation } from '@aws-amplify/api';
// const apiName = 'api927be96a'; // replace this with your api name.
// const path = '/orders'; //replace this with the path you have configured on your API
// const myInit = {
//   body: {}, // replace this with attributes you need
//   headers: {
//     "Access-Control-Allow-Origin": "*"
//   }, // OPTIONAL
// };

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

const AddOrder = () => {
  const initialOrderState = {
    // id: null,
    // title: "",
    orderType: "pushMailScheduledWithQuota",
    configuration: "PilotConfigurationSet",
    quota: 10,
    time: 60,
    scheduleDate: new Date(),
    inputData: ""
  };
  const [Order, setOrder] = useState(initialOrderState);
  const [submitted, setSubmitted] = useState(false);
  const [value, onDateChange] = useState(new Date());
  const [newFileName, setNewFileName] = useState('');
  const [orderError, setOrderError] = useState('');
  const [templates, setTemplates] = useState([]);
  const [templatesOption, setTemplatesOption] = useState([]);
  const [identitiesOption, setIdentitiesOption] = useState([]);
  const [fileToAttachList, setFileToAttachList] = useState([]);


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

  const handleInputFile = async (event) => {
    // console.log("Inside handleInputFile");
    // console.log(event.target.files);
    // console.log(Auth.user);
    let file = event.target.files[0];
    let fileName = file.name;
    let fileType = file.type;
    let userName = Auth.user.username;
    var d = new Date();
    let newName = userName + "_" + d.getTime() + "_" + fileName;
    // let newName = fileName;
    console.log("New file name: " + newName);
    // const { key } = await Storage.put(newName, file, {
    Storage.put(newName, file, {
      contentType: fileType
    })
      .then(result => {
        console.log(result);
        setOrder({ ...Order, inputData: newName });
        console.log(Order);
        setNewFileName(newName);

      }
      )
      .catch(err => console.log(err));

    // Storage.get(newName)
    // .then(result => console.log(result))
    // .catch(err => console.log(err));


    // console.log('S3 Object key', key)
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

  const orderFormError = (data) => {
    if (!data.inputData) {
      return "Invalid file name, try again";
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

  const saveOrder = () => {

    const error = orderFormError(Order);
    if (error) {
      setOrderError(error);
      return;
    }
    var data = {
      orderType: Order.orderType,
      userId: Auth.user.username,
      name: Order.orderName,
      details: {
        scheduleDate: Order.scheduleDate.toISOString(),
        inputData: Order.inputData,
        quota: parseInt(Order.quota),
        time: parseInt(Order.time),
        configuration: (Order.configuration),
        template: (Order.template.value),
        source: (Order.source.value),
        sourceTitle: (Order.sourceTitle)
      }
    };

    // if(!Order.inputData){

    // }
    OrderDataService.create(data)
      .then(response => {
        setOrder({
          id: response.data.orderId
          // title: response.data.title,
          // description: response.data.description,
          // published: response.data.published
        });
        setSubmitted(true);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });

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

  const handleAttachFile = async (event) => {
    console.log("Inside handleAttachFile");

    let id = event.target.id;
    console.log(`id: ${id}`);

    let file = event.target.files[0];
    let fileName = file.name;
    let fileType = file.type;
    let userName = Auth.user.username;
    var d = new Date();
    let newName = userName + "_" + d.getTime() + "_" + fileName;
    console.log(`newName: ${newName}`);

  }

  const newOrder = () => {
    setOrder(initialOrderState);
    setSubmitted(false);
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
                <label htmlFor="time">File</label>
                <input
                  type="file"
                  className="form-control"
                  id="file"
                  accept='text/csv'
                  required
                  value={Order.file}
                  onChange={(e) => handleInputFile(e)}
                  name="file"
                />
              </div>

              <div className="form-group">
                <label htmlFor="Attachments">Attachments</label>
                <input
                  type="file"
                  className="form-control"
                  id="Attachments"
                  accept='text/csv'
                  required
                  // value={Order.file}
                  onChange={(e) => handleAttachFile(e)}
                  name="Attachments"
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
          </div>

        )
      }
    </div >
  );
};

export default AddOrder;
