import React, { useState, useEffect } from "react";
import OrderDataService from "../services/OrderService";
import MailService from "../services/MailService";
import Select from 'react-select'
import DateHelper from "../util/date";




const orderStatus = {
  0: "CREATED",
  1: "INPROGRESS",
  2: "DONE",
  3: "PAUSED",
  4: "DELETED"
};

const options = [
  { value: 0, label: 'CREATED' },
  { value: 1, label: 'INPROGRESS' },
  { value: 3, label: 'PAUSED' },
  { value: 4, label: 'DELETED' },
  { value: 2, label: 'DONE' }
]


const Order = props => {
  const initialOrderState = {
    id: null,
    title: "",
    description: "",
    published: false
  };
  const [currentOrder, setCurrentOrder] = useState(initialOrderState);
  const [currentEventStats, setCurrentMailEventStats] = useState([]);
  const [currentRecordStats, setCurrentMailRecordStats] = useState([]);
  const [message, setMessage] = useState("");
  const [canEditStatus, setCanEditStatus] = useState(false);
  // const [initStatusOption, setInitStatusOption] = useState({});
  // const isStatusEditable = false;
  const getOrder = id => {
    OrderDataService.get(id)
      .then(response => {
        setCurrentOrder(response.data);
        console.log(response.data);
        setCanEditStatus(orderStatus[response.data.status] == "INPROGRESS" || orderStatus[response.data.status] == "PAUSED")

        // console.log(canEditStatus);
        // setInitStatusOption(options.filter((option) => option.value===response.data.status));
        // console.log("selected option: ",initStatusOption);

      })
      .catch(e => {
        console.log(e);
      });
  };
  const getMailEventStats = (id, timeResolution = 'year') => {
    MailService.findEventsStatsByOrderId(id, timeResolution)
      .then(response => {
        console.log(response.data);
        setCurrentMailEventStats(response.data);
        // setCanEditStatus(orderStatus[response.data.status] == "INPROGRESS" || orderStatus[response.data.status] == "PAUSED")

        // console.log(canEditStatus);
        // setInitStatusOption(options.filter((option) => option.value===response.data.status));
        // console.log("selected option: ",initStatusOption);

      })
      .catch(e => {
        console.log(e);
      });
  };
  const getMailRecordStats = (id, timeResolution = 'year') => {
    MailService.findMailStatsByOrderId(id, timeResolution)
      .then(response => {
        console.log(response.data);
        setCurrentMailRecordStats(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };
  useEffect(() => {

    getOrder(props.match.params.id);
    getMailEventStats(props.match.params.id);
    getMailRecordStats(props.match.params.id);
  }, [props.match.params.id]);

  const handleInputChange = event => {
    const { name, value } = event.target;
    setCurrentOrder({ ...currentOrder, [name]: value });
  };
  const handleStatusInputChange = event => {
    // const { name, value } = event.target;
    // setOrder({ ...Order, [name]: value });
    console.log(event);
    setCurrentOrder({ ...currentOrder, status: event.value });
    console.log(currentOrder);

    // onDateChange(event);

  };


  const updateOrder = () => {
    OrderDataService.update(currentOrder.id, currentOrder)
      .then(response => {
        console.log(response.data);
        setMessage("The Order was updated successfully!");
      })
      .catch(e => {
        console.log(e);
      });
  };


  const updateStatus = (newStatus) => {
    var data = {
      id: currentOrder.id,
      orderType: currentOrder.orderType,
      userId: currentOrder.userId,
      details: currentOrder.details,
      status: newStatus
    };
    console.log(JSON.stringify(data));
    OrderDataService.update(data)
      .then(response => {
        // setCurrentOrder({ ...currentOrder, published: status });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const pauseOrder = () => {
    var newStatus = 3;
    setCurrentOrder({ ...currentOrder, status: newStatus });
    updateStatus(newStatus);
  }

  const resumeOrder = () => {
    var newStatus = 1;
    setCurrentOrder({ ...currentOrder, status: newStatus });
    updateStatus(newStatus);
  }

  const deleteOrder = () => {
    OrderDataService.remove(currentOrder.id)
      .then(response => {
        console.log(response.data);
        props.history.push("/Orders");
      })
      .catch(e => {
        console.log(e);
      });
  };
  const getEventStatLabel = (eventStat) => {
    return `Type: ${eventStat.eventType} ,\nCounter: ${eventStat.counter} `;
  };

  const getMailRecordStatLabel = (eventStat) => {
    return `Type: ${eventStat.status} ,\nCounter: ${eventStat.counter} `;
  };
  return (
    <div>
      {currentOrder ? (
        <div className="list row">
          <div className="col-md-6">
            <h4>Order</h4>
            <form>
              <div className="form-group">
                <label htmlFor="orderId">Id</label>
                <input
                  type="text"
                  className="form-control"
                  id="orderId"
                  name="orderId"
                  value={currentOrder.id}
                // onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="status">Status</label>
                <input
                  type="text"
                  className="form-control"
                  id="status"
                  name="status"
                  value={orderStatus[currentOrder.status]}
                // onChange={handleInputChange}
                />
                {/* <Select
                value={options.filter((option) => option.value === currentOrder.status)}
                onChange={handleStatusInputChange}
                options={options}
                isDisabled={!canEditStatus}
              /> */}

              </div>


              <div className="form-group">
                <label htmlFor="orderType">Type</label>
                <input
                  type="text"
                  className="form-control"
                  id="orderType"
                  name="orderType"
                  value={currentOrder.orderType}
                // onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="creationDate">Creation Date</label>
                <input
                  type="text"
                  className="form-control"
                  id="creationDate"
                  name="creationDate"
                  // value={DateHelper.convertUTCDateToLocalDate(new Date(currentOrder.creationDate))}
                  value={(DateHelper.convertUTCDateToLocalDate((currentOrder.creationDate)).toString())}
                // onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="details">Details</label>
                {/* <input
                type="text"
                className="form-control"
                id="details"
                name="details"
                value={JSON.stringify(currentOrder.details)}
              // onChange={handleInputChange}
              /> */}
                <textarea className="form-control" id="details"
                  name="details"
                  readOnly
                  value={JSON.stringify(currentOrder.details)}
                >

                </textarea>


              </div>
              {/* <div className="form-group">
              <label>
                <strong>Status:</strong>
              </label>
              {orderStatus[currentOrder.status]}
            </div> */}
            </form>
            {/* orderStatus[currentOrder.status] == "INPROGRESS" */}
            {orderStatus[currentOrder.status] == "INPROGRESS" && (
              <div>
                <button
                  type="submit"
                  className="badge badge-success"
                  onClick={pauseOrder}
                >
                  Pause
              </button>
              </div>
            )}
            {orderStatus[currentOrder.status] == "PAUSED" && (
              <div>
                <button
                  type="submit"
                  className="badge badge-success"
                  onClick={resumeOrder}
                >
                  Resume
              </button>
              </div>
            )}
            <button className="badge badge-danger mr-2" onClick={deleteOrder}>
              Delete
          </button>


            <p>{message}</p>
          </div>
 
          <div className="col-md-6">
            <h4>Mail Records Stats</h4>
            <ul className="list-group">
              {currentRecordStats &&
                currentRecordStats.map((eventStat, index) => (
                  <li
                    className="list-group-item"
                    key={index}
                  >
                    {getMailRecordStatLabel(eventStat)}
                  </li>
                ))}
            </ul>
            <h4>Mail Events Stats</h4>
            <ul className="list-group">
              {currentEventStats &&
                currentEventStats.map((eventStat, index) => (
                  <li
                    className="list-group-item"
                    key={index}
                  >
                    {getEventStatLabel(eventStat)}
                  </li>
                ))}
            </ul>
          </div >
        </div>
      ) : (
          <div>
            <br />
            <p>Please click on a Order...</p>
          </div>
        )}
    </div>
  );
};

export default Order;
