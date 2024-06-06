import React from "react";
import Excel from "./Components/Excel";
import Ctccompare from "./Components/Ctccompare";
import { BrowserRouter,Route,Routes} from "react-router-dom";
import Dashboard from "./Components/Dashboard";
import Notes from "./Components/Notes";

function App() {
  return (
<>
<BrowserRouter>
<Routes>
  <Route path="notes" element={<Notes/>}/>
  <Route path="ctc" element={<Ctccompare/>}/>
  <Route path="excel" element={<Excel/>}/>
  <Route path="/" element={<Dashboard/>}/>
  </Routes>
</BrowserRouter>
</>
  );
}

export default App;
