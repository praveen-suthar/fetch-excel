import { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

function Notes() {
  // on change states

  const [excelFile, setExcelFile] = useState(null);
  const [excelFileError, setExcelFileError] = useState(null);

  // submit

  const [excelData, setExcelData] = useState(null);
  const [postJsonData, setPostJsonData] = useState(null);

  const [filename, setFileName] = useState();

  //Get Api
  useEffect(() => {
    axios
      .get('https://jsonplaceholder.typicode.com/posts')
      .then((res) => {
        setExcelData(res.data);
        console.log("Emp-Detail", res.data);
        console.log("excelData", excelData);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const fileType = ["application/vnd.ms-excel"];
  const handleFile = (e) => {
    let selectedFile = e.target.files;
    if (selectedFile.length) {
      const file = selectedFile[0];
      setFileName(file.name);
      console.log("file", file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const wb = XLSX.read(event.target.result);
        const sheets = wb.SheetNames;
        if (sheets.length) {
          const rows = XLSX.utils.sheet_to_json(wb.Sheets[sheets[0]]);

          const newRows = rows.map((element) => {
            return {
              Code: String(element["Code"]),
              Name: String(element["Name"]),
              Paid_Days: Number(element["Paid_Days"]),
              Old_Monthly_Salary: Number(element["Old_Monthly_Salary"]),
              New_Monthly_Salary: Number(element["New_Monthly_Salary"]),
              New_Salary_Month_From: String(element["New_Salary_Month_From"]),
              Arrer_Amount_Month: String(element["Arrer_Amount_Month"]),
              Arrer_Amount: Number(element["Arrer_Amount"]),
              Paid_Amount: Number(element["Paid_Amount"]),
              Remarks: String(element["Remarks"]),
            };
          });
          setPostJsonData(newRows);
        }
      };
      reader.readAsArrayBuffer(file);
    }
    setExcelFile(selectedFile);
  };

  //submit function

  const handleSubmit = (e) => {
    e.preventDefault();
    if (excelFile !== null) {
      axios
        .post(
          "https://6eb7-2409-4041-2e0e-40e9-18b3-fbe-4b48-376a.in.ngrok.io/v1/createEmp",
          postJsonData
        )
        .then((result) => {
          console.log("result", result);
        });
    } else {
      setExcelData(null);
    }
  };

  return (
    <div className="container">
      {/* upload file section */}
      <div className="form">
        <form className="form-group" autoComplete="off" onSubmit={handleSubmit}>
          <label>
            <h5>Upload Excel file</h5>
          </label>
          <br></br>
          <input
            type="file"
            className="form-control"
            onChange={handleFile}
            required
          ></input>
          {excelFileError && (
            <div className="text-danger" style={{ marginTop: 5 + "px" }}>
              {excelFileError}
            </div>
          )}
          <br />

          {/* Select previous Excel file */}

          <select
            className="form-select form-select-sm mb-3"
            aria-label=".form-select-lg example"
          >
            <option selected>Select previuosly uploaded file</option>          
          </select>
          <button
            type="submit"
            className="btn btn-success"
            style={{ marginTop: 5 + "px" }}
          >
            Upload file
          </button>
        </form>
      </div>
      <br></br>
      <hr></hr>
      {/* view file section */}
      <h5>View Excel file</h5>
      <div className="viewer">
        {excelData === null && <>No file selected</>}
        {excelData !== null && (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Code</th>
                  <th scope="col">Name</th>
                  <th scope="col">Paid Days</th>
                  <th scope="col">Old Monthly Salary</th>
                  <th scope="col">New Monthly Salary</th>
                  <th scope="col">New Salary Month from</th>
                  <th scope="col">Arrear Amount Month</th>
                  <th scope="col">Arrear Amount</th>
                  <th scope="col">Paid Amount</th>
                  <th scope="col">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {excelData?.map((individualExcelData, index) => {
                  return (
                    <>
                      <tr key={individualExcelData.userId}>
                      <th>{individualExcelData.id}</th>
                        <th>{individualExcelData.title}</th>
                        <th>{individualExcelData.completed}</th>
                        <th>{individualExcelData.Code}</th>
                        <th>{individualExcelData.Name}</th>
                        <th>{individualExcelData.Paid_Days}</th>
                        <th>{individualExcelData.Old_Monthly_Salary}</th>
                        <th>{individualExcelData.New_Monthly_Salary}</th>
                        <th>{individualExcelData.New_Salary_Month_From}</th>
                        <th>{individualExcelData.Arrer_Amount_Month}</th>
                        <th>{individualExcelData.Arrer_Amount}</th>
                        <th>{individualExcelData.Paid_Amount}</th>
                        <th>{individualExcelData.Remarks}</th>
                      </tr>
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
export default Notes;
