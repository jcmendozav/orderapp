import React, { useState, useEffect } from "react";
import TemplateDataService from "../../services/TemplateService";
import { Link } from "react-router-dom";
// import { Auth } from 'aws-amplify'
import DateHelper from "../../util/date";

const TemplateStatus = {
  0: "CREATED",
  1: "INPROGRESS",
  2: "DONE",
  3: "PAUSED",
  4: "DELETED"
};
const TemplatesList = () => {
  const [Templates, setTemplates] = useState([]);
  const [currentTemplate, setCurrentTemplate] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [searchTitle, setSearchTitle] = useState("");
  const [searchId, setSearchId] = useState("");

  useEffect(() => {
    retrieveTemplates();
  }, []);

  // const onChangeSearchTitle = e => {
  //   const searchTitle = e.target.value;
  //   setSearchTitle(searchTitle);
  // };

  const onChangeSearchId = e => {
    const TemplateId = e.target.value;
    setSearchId(TemplateId);
  };
  const retrieveTemplates = () => {
    TemplateDataService.getAll()
      .then(response => {
        let sortedTemplates = response.data.slice().sort((a,b)=>(new Date(b.CreatedTimestamp)).getTime()-(new Date(a.CreatedTimestamp)).getTime());

        setTemplates(sortedTemplates);
        console.log(sortedTemplates);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const refreshList = () => {
    retrieveTemplates();
    setCurrentTemplate(null);
    setCurrentIndex(-1);
  };

  const setActiveTemplate = (Template, index) => {
    setCurrentTemplate(Template);
    setCurrentIndex(index);
  };

  const getTemplateLabel = (Template) => {
    return `${Template.Name} - ${DateHelper.convertStrDateToLocalDateString(Template.CreatedTimestamp)}`;
  };

  const findById = () => {
    TemplateDataService.get(searchId)
      .then(response => {
        let result = response.data;
        if(Object.entries(result).length === 0) return;
        if(result.result) {
          console.log(JSON.stringify(result));
          return;
        }
        if (!Array.isArray(result)) {
          result = [response.data];
        }

        // creation date is only available in get all responses
        // console.log(`${JSON.stringify(Templates)}`)
        // console.log(`${JSON.stringify(result)}`)
        // result.forEach(e => e['CreatedTimestamp'] = Templates.filter(t => t['Name'] === e['Name'])[0] );
        const newResult = result.map(e => {
          e['CreatedTimestamp'] = Templates.filter(t => t['Name'] === e['Name'])[0]['CreatedTimestamp'];
          return e;
        })
        setTemplates(newResult);
        console.log(newResult);
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
        <h4>Templates List</h4>

        <ul className="list-group">
          {Templates &&
            Templates.map((Template, index) => (
              <li
                className={
                  "list-group-item " + (index === currentIndex ? "active" : "")
                }
                onClick={() => setActiveTemplate(Template, index)}
                key={index}
              >
                {/* {Template.id} */}
                {getTemplateLabel(Template)}
              </li>
            ))}
        </ul>


      </div>
      <div className="col-md-6">
        {currentTemplate ? (
          <div>
            <h4>Template</h4>
            <div>
              <label>
                <strong>Id:</strong>
              </label>{" "}
              {currentTemplate.id}
            </div>
            <div>
              <label>
                <strong>Name:</strong>
              </label>{" "}
              {currentTemplate.Name}
            </div>

            <div>
              <label>
                <strong>Creation Date:</strong>
              </label>{" "}
              {
                DateHelper.convertStrDateToLocalDateString(currentTemplate.CreatedTimestamp)
                // currentTemplate.creationDate
              }
            </div>

            <Link
              to={"/Templates/" + currentTemplate.id}
              className="badge badge-warning"
            >
              Edit
            </Link>
          </div>
        ) : (
            <div>
              <br />
              <p>Please click on a Template...</p>
            </div>
          )}
      </div>
    </div>
  );
};

export default TemplatesList;
