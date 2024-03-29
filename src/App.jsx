import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { CMSParserPage } from "./pages/CMSParserPage";
import { Header } from "./common/header/Header";
import {API_BASE} from "../constants";

export default function App() {
  const [cmsData, setCMSData] = useState([]);

  useEffect(() => {
    fetch(
      `${API_BASE}/Pages.json`
    ).then(async (res) => {
      const data = await res.json();
      setCMSData(data);
    });
  }, []);

  return (
    <div>
      <Router>
        <Routes>
          {cmsData?.map((page) => (
            <Route
              path={page.Url}
              element={
                <>
                  <Header cmsData={cmsData} />
                  <CMSParserPage key={page.Url} url={page.Sheet} />
                </>
              }
            />
          ))}
        </Routes>
      </Router>
    </div>
  );
}
