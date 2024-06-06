import React from "react";
import { Link } from "react-router-dom";
function Dashboard() {
  return (
    <>
    <div className="center" style={{marginTop:"50px"}}>
    <h1>Welcome to Dashboard page</h1>
      <ul>
       <li> <Link to="excel">Go for Excel Compare</Link></li>
       <li> <Link to="ctc">Go for CTC Compare </Link></li>
       <li> <Link to="notes">Go for Fluctuation Notes</Link></li>
      </ul>
    </div>    
    </>
  );
}
export default Dashboard;
