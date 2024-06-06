import { useEffect, useState } from "react";
import "../Components/App.css";
import * as XLSX from "xlsx";


function Excel() {
  // on change states
  const [excelFile, setExcelFile] = useState(null);
  const [excelFileError, setExcelFileError] = useState(null);

  // submit
  const [excelData, setExcelData] = useState(null);
  const [excelData1, setExcelData2] = useState(null);

  const [localData, setLocalData] = useState(null);
  const [filename, setFileName] = useState();

  const finalData = localData?.length > 0 ? localData : excelData;

  useEffect(() => {
    filename && localStorage.setItem(filename, JSON.stringify(excelData));
  }, [excelData]);
  let keyName = [];
  for (var i = 0; i < localStorage.length; i++) {
    keyName.push(localStorage.key(i));
  }

  // handle File
  const fileType = ["application/vnd.ms-excel"];
  const handleFile = (e) => {
    e.preventDefault();
    let selectedFile = e.target.files[0];
    if (selectedFile) {
      setFileName(selectedFile.name);
      console.log("filename", selectedFile.name)
      if (selectedFile && fileType.includes(selectedFile.type)) {
        let reader = new FileReader();
        reader.readAsArrayBuffer(selectedFile);
        reader.onload = (e) => {
          setExcelFileError(null);
          setExcelFile(e.target.result);
        };
      } else {
        setExcelFileError("Please select only excel file types");
        setExcelFile(null);
      }
    } else {
      console.log("plz select your file");
    }
  };

  // function for date

  const ExcelDateToJSDate = (serial) => {
    var utc_days = Math.floor(serial - 25569);
    var utc_value = utc_days * 86400;
    var date_info = new Date(utc_value * 1000);

    let month = date_info.getMonth().toString();
    let date = date_info.getDate().toString();
    return `${date_info.getFullYear()}-${month + 1}-${date.padStart(2, "0")}`;
  };
            
  // Handle file 2
  const handleFile2 = (e) => {
    let selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile && fileType.includes(selectedFile.type)) {
        let reader = new FileReader();
        reader.readAsArrayBuffer(selectedFile);
        reader.onload = (e) => {
          setExcelFileError(null);
          setExcelFile(e.target.result);
        };
      } else {
        setExcelFileError("Please select only excel file types");
        setExcelFile(null);
      }
    } else {
      console.log("plz select your file");
    }
  };

  // submit function
  const handleSubmit = (e) => {
    e.preventDefault();
    if (excelFile !== null) {
      const workbook = XLSX.read(excelFile, { type: "buffer" });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);
      setExcelData(data);
    } else {
      setExcelData(null);
    }
  };

  const handleSubmit2 = (e) => {
    e.preventDefault();
    if (excelFile !== null) {
      const workbook = XLSX.read(excelFile, { type: "buffer" });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);
      setExcelData2(data);
    } else {
      setExcelData2(null);
    }
  };
  const [comparedArr, setComparedArr] = useState([]);
  useEffect(() => {
    setComparedArr(
      finalData?.map((item1) => {
        return excelData1?.filter(
          (item2) => JSON.stringify(item1) === JSON.stringify(item2)
        );
      })
    );
  }, [finalData, excelData1]);

  //Total Amount function for excel -1

  const totalAmount = finalData
    ?.map((item) => {
      return item.Amount;
    })
    .reduce((a, b) => {
      return a + b;
    });

  // Total amount function for excel -2

  const totalAmount1 = excelData1
    ?.map((item) => {
      return item.Amount;
    })
    .reduce((a, b) => {
      return a + b;
    });

  // Clear LocalStorage
  const delteLocalStorage = () => {
    localStorage.clear();
    document.location.reload();
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6">
          {/* upload file section */}
          <div className="form">
            <form
              className="form-group"
              autoComplete="off"
              onSubmit={handleSubmit}
            >
              <label>
                <h5>Upload Previous File</h5>
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
                onChange={(e) =>
                  setLocalData(JSON.parse(localStorage.getItem(e.target.value)))
                }
                className="form-select form-select-sm mb-3"
                aria-label=".form-select-lg example"
              >
                <option selected>Select previuosly uploaded file</option>
                {keyName?.map((item) => {
                  return <option value={item}>{item}</option>;
                })}
              </select>
              <button
                type="submit"
                className="btn btn-success"
                style={{ marginTop: 5 + "px" }}
              >
                Submit
              </button>

              <button
                type="submit"
                className="btn btn-danger"
                onClick={delteLocalStorage}
                style={{ marginLeft: 45 + "px", marginTop: 5 + "px" }}
              >
                Clear
              </button>
            </form>
          </div>
        </div>

        <div className="col-md-6">
          {" "}
          <div className="form">
            <form
              className="form-group"
              autoComplete="off"
              onSubmit={handleSubmit2}
            >
              <label>
                <h5>Upload Current File </h5>
              </label>
              <br></br>
              <input
                type="file"
                className="form-control"
                onChange={handleFile2}
                required
              ></input>
              {excelFileError && (
                <div className="text-danger" style={{ marginTop: 5 + "px" }}>
                  {excelFileError}
                </div>
              )}
              <button
                type="submit"
                className="btn btn-success"
                style={{ marginTop: 5 + "px" }}
              >
                Submit
              </button>
            </form>
          </div>
        </div>

        <hr></hr>
        <center>
          <h5 style={{ textDecoration: "underline" }}>Excel Comparison</h5>
        </center>

        {/* Excel file - 1 */}

        <div className="col-md-6">
          <h5>Total Record: {finalData?.length}</h5>
          <h5>Total Amount: {totalAmount}</h5>
          <div className="viewer">
            {finalData === null && <>No file selected</>}
            {finalData !== null && (
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr style={{backgroundColor:"yellow"}}>
                      <th scope="col">Amount</th>
                      <th scope="col">Date</th>
                      <th scope="col">Name</th>
                      <th scope="col">Emp Account</th>
                      <th scope="col">Bank Ifsc</th>
                    </tr>
                  </thead>
                  <tbody>
                    {finalData?.map((individualExcelData, index) => {
                      const excel1Data = excelData1?.find(
                        (e1, index) =>
                          individualExcelData.EmpAccount == e1.EmpAccount
                      );
                      console.log(" aa",excel1Data)
                      return (
                        <>
                          <tr>
                            <th
                              className={`${
                                excelData1 !== null &&
                                excel1Data?.Amount !==
                                  finalData?.[index]?.Amount &&
                                "row-highlight"
                              }`}
                            >
                              
                              {individualExcelData.Amount}
                              
                            </th>
                            
                            <th
                              className={`${
                                excelData1 !== null &&
                                excel1Data?.Date !== finalData?.[index]?.Date &&
                                "row-highlight"
                              }`}
                            >
                              {ExcelDateToJSDate(individualExcelData.Date)}
                            </th>
                            <th
                              className={`${
                                excelData1 !== null &&
                                excel1Data?.Name !== finalData?.[index]?.Name &&
                                "row-highlight"
                              }`}
                            >
                              {individualExcelData.Name}
                            </th>
                            <th
                              className={`${
                                excelData1 !== null &&
                                excel1Data?.EmpAccount !==
                                  finalData?.[index]?.EmpAccount &&
                                "row-highlight"
                              }`}
                            >
                              {individualExcelData.EmpAccount}
                            </th>

                            <th
                              className={`${
                                excelData1 !== null &&
                                excelData1?.[index]?.BankIfsc !==
                                  finalData?.[index]?.BankIfsc &&
                                "row-highlight"
                              }`}
                            >
                              {individualExcelData.BankIfsc}
                            </th>
                          </tr>
                        </>
                      );
                    }
                    
                    )
                  }
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Excel file - 2 */}

        <div className="col-md-6">
          <h5>Total Record: {excelData1?.length}</h5>
          <h5>Total Amount: {totalAmount1}</h5>
          <div className="viewer">
            {excelData1 === null && <> No file selected </>}
            {excelData1 !== null && (
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr style={{backgroundColor:"yellow"}}>
                      <th scope="col">Amount</th>
                      <th scope="col">Date</th>
                      <th scope="col">Name</th>
                      <th scope="col">Emp Account</th>
                      <th scope="col">Bank Ifsc</th>
                    </tr>
                  </thead>
                  <tbody>
                    {excelData1.map((individualExcelData, index) => {
                      const excel2Data = finalData?.find(
                        (e1, index) =>
                          individualExcelData.EmpAccount == e1.EmpAccount
                      );

                      return (
                        <>
                          <tr>
                            <th
                              className={`${
                                excel2Data !== null &&
                                excelData1?.[index]?.Amount !==
                                excel2Data  ?.Amount &&
                                "row-highlight"
                              }`}
                            >
                              {individualExcelData.Amount}
                            </th>
                            <th
                              className={`${
                                excel2Data !== null &&
                                excelData1?.[index]?.Date !==
                                  excel2Data?.Date &&
                                "row-highlight"
                              }`}
                            >
                              {ExcelDateToJSDate(individualExcelData.Date)}
                            </th>
                            <th
                              className={`${
                                excel2Data !== null &&
                                excelData1?.[index]?.Name !==
                                  excel2Data?.Name &&
                                "row-highlight"
                              }`}
                            >
                              {individualExcelData.Name}
                            </th>
                            <th
                              className={`${
                                excel2Data !== null &&
                                excelData1?.[index]?.EmpAccount !==
                                  excel2Data?.EmpAccount &&
                                "row-highlight"
                              }`}
                            >
                              {individualExcelData.EmpAccount}
                            </th>

                            <th
                              className={`${
                                excel2Data !== null &&
                                excelData1?.[index]?.BankIfsc !==
                                  excel2Data?.BankIfsc &&
                                "row-highlight"
                              }`}
                            >
                              {individualExcelData.BankIfsc}
                            </th>
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
      </div>
    </div>
  );
}

export default Excel;
