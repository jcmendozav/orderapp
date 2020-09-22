import React, { useState, useEffect } from "react";
import OrderDataService from "../services/OrderService";
import { Link } from "react-router-dom";
import { Auth } from 'aws-amplify'
import DateHelper from "../util/date";

const orderStatus = {
  0: "CREATED",
  1: "INPROGRESS",
  2: "DONE",
  3: "PAUSED",
  4: "DELETED"
};
const OrdersList = () => {
  const [Orders, setOrders] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [searchTitle, setSearchTitle] = useState("");
  const [searchId, setSearchId] = useState("");

  useEffect(() => {
    retrieveOrders();
  }, []);

  const onChangeSearchTitle = e => {
    const searchTitle = e.target.value;
    setSearchTitle(searchTitle);
  };

  const onChangeSearchId = e => {
    const orderId = e.target.value;
    setSearchId(orderId);
  };
  const retrieveOrders = () => {
    OrderDataService.findByUserId(Auth.user.username)
      .then(response => {
        setOrders(response.data);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const refreshList = () => {
    retrieveOrders();
    setCurrentOrder(null);
    setCurrentIndex(-1);
  };

  const setActiveOrder = (Order, index) => {
    setCurrentOrder(Order);
    setCurrentIndex(index);
  };

  const getOrderLabel = (Order) => {
    return Order.orderType + " " + DateHelper.convertUTCDateToLocalDate(Order.creationDate);
  };

  const removeAllOrders = () => {
    OrderDataService.removeAll()
      .then(response => {
        console.log(response.data);
        refreshList();
      })
      .catch(e => {
        console.log(e);
      });
  };

  const findByTitle = () => {
    OrderDataService.findByTitle(searchTitle)
      .then(response => {
        setOrders(response.data);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };
  const findById = () => {
    OrderDataService.get(searchId)
      .then(response => {
        let result = response.data;
        if (!Array.isArray(result)) {
          result = [response.data];
        }


        setOrders(result);
        console.log(result);
      })
      .catch(e => {
        console.log(e);
      });
  };
  return (
    <div className="list row">
      <div className="col-md-8">
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by id"
            value={searchId}
            onChange={onChangeSearchId}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={findById}
            >
              Search
            </button>
          </div>
        </div>
      </div>
      <div className="col-md-6">
        <h4>Orders List</h4>

        <ul className="list-group">
          {Orders &&
            Orders.map((Order, index) => (
              <li
                className={
                  "list-group-item " + (index === currentIndex ? "active" : "")
                }
                onClick={() => setActiveOrder(Order, index)}
                key={index}
              >
                {/* {Order.id} */}
                {getOrderLabel(Order)}
              </li>
            ))}
        </ul>


      </div>
      <div className="col-md-6">
        {currentOrder ? (
          <div>
            <h4>Order</h4>
            <div>
              <label>
                <strong>id:</strong>
              </label>{" "}
              {currentOrder.id}
            </div>
            <div>
              <label>
                <strong>Type:</strong>
              </label>{" "}
              {currentOrder.orderType}
            </div>
            <div>
              <label>
                <strong>Creation Date:</strong>
              </label>{" "}
              {
                DateHelper.convertUTCDateToLocalDate((currentOrder.creationDate)).toString()
                // currentOrder.creationDate
              }
            </div>
            <div>
              <label>
                <strong>Status:</strong>
              </label>{" "}
              {orderStatus[currentOrder.status]}
            </div>
            <div>
              <label>
                <strong>Details:</strong>
              </label>{" "}
              {/* {JSON.stringify(currentOrder.details)} */}
              <textarea className="form-control" id="details"
                name="details"
                readOnly 
                value={JSON.stringify(currentOrder.details)}
              />
            </div>
            <Link
              to={"/Orders/" + currentOrder.id}
              className="badge badge-warning"
            >
              Edit
            </Link>
          </div>
        ) : (
            <div>
              <br />
              <p>Please click on a Order...</p>
            </div>
          )}
      </div>
    </div>
  );
};

export default OrdersList;
