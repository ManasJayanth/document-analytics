const React = require('react');
const { Component }  = React;
const { Link, browserHistory } = require('react-router');


const upload = (uploadUrl, formData, onProgress) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onprogress = (e) => {
      // console.log('xhr onprogress');
      // console.log(e);
      onProgress = onProgress || function () {};
      onProgress(e);
    };

    xhr.onload = (e) => {
      // console.log('xhr onload');
      // console.log(e);
      resolve(e.currentTarget.responseText);
    };

    xhr.onerror = (e) => {
      // console.log('xhr error');
      // console.log(e);
      reject(e);
    };

    xhr.open("put", uploadUrl, true);
    xhr.send(formData);

  });
};

const onChangeHandler = e => {
  // const formData = new FormData(e.currentTarget.form);
  const formData = new FormData();
  formData.append('pdfFile', e.currentTarget.files[0]);
  upload('/api/pdf', formData).then(redirect).catch(e => console.log(e));
};

const redirect = file => {
  browserHistory.push(`email-request?next=/pdf?file=${file}`)
};

module.exports = props => {
  return (
    <div>
      <form encType="multipart/form-data">
        <label>Upload pdf</label>
        <input onChange={onChangeHandler} type="file" name="pdfFile" />
      </form>
    </div>
  );
};
