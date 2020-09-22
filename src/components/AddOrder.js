import React, { useState } from "react";
import OrderDataService from "../services/OrderService";
import Storage from '@aws-amplify/storage'
import { Auth } from 'aws-amplify'
import DateTimePicker from 'react-datetime-picker';


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
    quota: 10,
    time: 60,
    scheduleDate: new Date(),
    inputData: ""
  };
  const [Order, setOrder] = useState(initialOrderState);
  const [submitted, setSubmitted] = useState(false);
  const [value, onDateChange] = useState(new Date());
  const [newFileName, setNewFileName] = useState('');
  const [orderError, setOrderError] = useState(false);


  const handleInputFile = async (event) => {
    // console.log("Inside handleInputFile");
    // console.log(event.target.files);
    // console.log(Auth.user);
    let file = event.target.files[0];
    let fileName = file.name;
    let fileType = file.type;
    let userName = Auth.user.username;
    var d = new Date();
    let newName = userName + "_"+d.getTime()+"_" + fileName;
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
    console.log(event.toISOString());
    setOrder({ ...Order, scheduleDate: event });
    console.log(Order);

    onDateChange(event);

  };

  const orderFormError = (data) => {
    if(!data.details.inputData){
      return "Invalid file name, try again";
    }
    return false;
  };

  const saveOrder = () => {

    
    var data = {
      orderType: Order.orderType,
      userId: Auth.user.username,
      details: {
        scheduleDate: Order.scheduleDate.toISOString(),
        inputData: Order.inputData,
        quota: parseInt(Order.quota),
        time: parseInt(Order.time)
      }
    };
    const error = orderFormError(data);
    if(error){
      setOrderError(error);
      return;
    }
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

  const newOrder = () => {
    setOrder(initialOrderState);
    setSubmitted(false);
  };

  return (
    <div className="submit-form">
      {submitted ? (
        <div>
          <h4>You submitted successfully! OrderId:</h4>
          <h4>{Order.id}</h4>
          <button className="btn btn-success" onClick={newOrder}>
            Add
          </button>
        </div>
      ) : (
          <div>
            <div className="form-group">
              <label htmlFor="orderType">Order Type</label>
              <input
                type="text"
                className="form-control"
                id="orderType"
                required
                value={Order.orderType}
                onChange={handleInputChange}
                name="orderType"
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
              <label htmlFor="scheduleDate">Schedule Date</label>
              <DateTimePicker
                id="scheduleDate"
                className="form-control"
                onChange={handleDateInputChange}
                value={Order.scheduleDate}
                format="y-MM-ddTHH:mm:ss"
                name="scheduleDate"
              />
            </div>
            <div className="form-group">
              <label htmlFor="time">Interval</label>
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
            {orderError && 
              <label className='error'>{orderError}</label>

          }
            <div>
              </div>
            <button onClick={saveOrder} ena className="btn btn-success">
              Submit
          </button>
          

          </div>
        )}
    </div>
  );
};

export default AddOrder;
