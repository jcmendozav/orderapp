import React, { useState } from "react";
import TemplateDataService from "../services/TemplateService";
import Storage from '@aws-amplify/storage'
import { Auth } from 'aws-amplify'
import DateTimePicker from 'react-datetime-picker';


// import API, { graphqlOperation } from '@aws-amplify/api';
// const apiName = 'api927be96a'; // replace this with your api name.
// const path = '/Templates'; //replace this with the path you have configured on your API
// const myInit = {
//   body: {}, // replace this with attributes you need
//   headers: {
//     "Access-Control-Allow-Origin": "*"
//   }, // OPTIONAL
// };

const AddTemplate = () => {
  const initialTemplateState = {};
  const [Template, setTemplate] = useState(initialTemplateState);
  const [submitted, setSubmitted] = useState(false);
  const [value, onDateChange] = useState(new Date());
  const [newFileName, setNewFileName] = useState('');
  const [TemplateError, setTemplateError] = useState(false);



  const handleInputChange = event => {
    const { name, value } = event.target;
    setTemplate({ ...Template, [name]: value });
    // console.log(response.data);

  };

  const handleDateInputChange = event => {
    // const { name, value } = event.target;
    // setTemplate({ ...Template, [name]: value });
    console.log(event.toISOString());
    setTemplate({ ...Template, scheduleDate: event });
    console.log(Template);

    onDateChange(event);

  };

  const TemplateFormError = (data) => {
    if (!data.details.inputData) {
      return "Invalid file name, try again";
    }
    return false;
  };

  const saveTemplate = () => {


    // var data = {
    //   TemplateType: Template.TemplateType,
    //   userId: Auth.user.username,
    //   details: {
    //     scheduleDate: Template.scheduleDate.toISOString(),
    //     inputData: Template.inputData,
    //     quota: parseInt(Template.quota),
    //     time: parseInt(Template.time)
    //   }
    // };
    const data = {
      Template: Template
    }
    // const error = TemplateFormError(data);
    // if (error) {
    //   setTemplateError(error);
    //   return;
    // }
    // if(!Template.inputData){

    // }
    TemplateDataService.create(data)
      .then(response => {
        setTemplate({
          id: response.data.TemplateId
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

  };

  const newTemplate = () => {
    setTemplate(initialTemplateState);
    setSubmitted(false);
  };

  return (
    <div className="submit-form">
      {submitted ? (
        <div>
          <h4>You submitted successfully! TemplateId:</h4>
          <h4>{Template.id}</h4>
          <button className="btn btn-success" onClick={newTemplate}>
            Add
          </button>
        </div>
      ) : (
          <div>
            <div className="form-group">
              <label htmlFor="TemplateName">Name</label>
              <input
                type="text"
                className="form-control"
                id="TemplateName"
                required
                value={Template.TemplateName}
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
                value={Template.SubjectPart}
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

                value={Template.HtmlPart}
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

                value={Template.TextPart}
                onChange={handleInputChange}

              >

              </textarea>
            </div>
            {TemplateError &&
              <label className='error'>{TemplateError}</label>

            }
            <div>
            </div>
            <button onClick={saveTemplate} ena className="btn btn-success">
              Submit
          </button>


          </div>
        )}
    </div>
  );
};

export default AddTemplate;
