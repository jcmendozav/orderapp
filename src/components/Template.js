import React, { useState, useEffect } from "react";
import TemplateDataService from "../services/TemplateService";
import MailService from "../services/MailService";
import Select from 'react-select'
import DateHelper from "../util/date";




const TemplateStatus = {
  0: "CREATED",
  1: "INPROGRESS",
  2: "DONE",
  3: "PAUSED",
  4: "DELETED"
};



const Template = props => {
  const initialTemplateState = {};
  const [currentTemplate, setCurrentTemplate] = useState(initialTemplateState);
  const [currentEventStats, setCurrentMailEventStats] = useState([]);
  const [currentRecordStats, setCurrentMailRecordStats] = useState([]);
  const [message, setMessage] = useState("");
  const [messageResult, setMessageResult] = useState("");
  const [TemplateError, setTemplateError] = useState(false);
  // const [initStatusOption, setInitStatusOption] = useState({});
  // const isStatusEditable = false;
  const getTemplate = id => {
    TemplateDataService.get(id)
      .then(response => {
        setCurrentTemplate(response.data);
        // console.log(JSON.stringify(response.data));
        // setCanEditStatus(TemplateStatus[response.data.status] == "INPROGRESS" || TemplateStatus[response.data.status] == "PAUSED")

        // console.log(canEditStatus);
        // setInitStatusOption(options.filter((option) => option.value===response.data.status));
        // console.log("selected option: ",initStatusOption);

      })
      .catch(e => {
        console.log(e);
      });
  };


  useEffect(() => {

    getTemplate(props.match.params.id);

  }, [props.match.params.id]);

  const handleInputChange = event => {
    const { name, value } = event.target;
    setCurrentTemplate({ ...currentTemplate, [name]: value });
  };
  // const handleStatusInputChange = event => {
  //   // const { name, value } = event.target;
  //   // setTemplate({ ...Template, [name]: value });
  //   console.log(event);
  //   setCurrentTemplate({ ...currentTemplate, status: event.value });
  //   console.log(currentTemplate);

  //   // onDateChange(event);

  // };


  const deleteTemplate = () => {
    TemplateDataService.remove(currentTemplate.id)
      .then(response => {
        console.log(response.data);

        props.history.push("/Templates");
      })
      .catch(e => {
        console.log(e);
      });
  };
  const updateTemplate = () => {
    const data = {Template: {
      TemplateName: currentTemplate.TemplateName,
      HtmlPart: currentTemplate.HtmlPart,
      SubjectPart: currentTemplate.SubjectPart,
      TextPart: currentTemplate.TextPart
    }};

    console.log(JSON.stringify(data));
    TemplateDataService.update(data)
      .then(response => {
        console.log(response.data);
        let result = response.data.result || '';
        result = result.toLowerCase();
        if (result !== 'success') {
          setTemplateError(JSON.stringify(response.data));
        } else {
          props.history.push("/Templates");
        }
      })
      .catch(e => {
        console.log(e);
      });
  };
  return (
    <div>
      {currentTemplate ? (
        <div className="submit-form" >
        {/* <div className="list row"> */}
        {/* <div className="col-md-6"> */}
          <div>
            <h4>Template</h4>
            <form>

              <div className="form-group">
                <label htmlFor="TemplateName">Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="TemplateName"
                  required
                  readOnly
                  value={currentTemplate.TemplateName}
                  onChange={handleInputChange}
                  name="TemplateName"
                />
              </div>



              <div className="form-group">
                <label htmlFor="SubjectPart">Subject</label>
                <input
                  type="text"
                  className="form-control"
                  id="SubjectPart"
                  required
                  value={currentTemplate.SubjectPart}
                  onChange={handleInputChange}
                  name="SubjectPart"
                />
              </div>

              <div>
                <label htmlFor="HtmlPart">HTML</label>
                <textarea
                  className="form-control"
                  id="HtmlPart"
                  name="HtmlPart"
                  required

                  value={currentTemplate.HtmlPart}
                  onChange={handleInputChange}

                >

                </textarea>
              </div>
              <div>
                <label htmlFor="TextPart">Text</label>
                <textarea
                  className="form-control"
                  id="TextPart"
                  name="TextPart"
                  required

                  value={currentTemplate.TextPart}
                  onChange={handleInputChange}

                >

                </textarea>
              </div>

            </form>
            </div>
            {TemplateError &&
              <label className='error'>{TemplateError}</label>

            }
            <div>

            <button className="badge badge-danger mr-2" onClick={deleteTemplate}>
              Delete
          </button>
            <button className="badge badge-danger mr-2" onClick={updateTemplate}>
              Update
          </button>

            <p>{messageResult}</p>
          </div>


        </div>
      ) : (
          <div>
            <br />
            <p>{messageResult}</p>
          </div>
        )}
    </div>
  );
};

export default Template;
