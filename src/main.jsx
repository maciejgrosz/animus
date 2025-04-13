import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import SettingsPanel from "@core/SettingsPanel";
import "./styles/index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ReadmePage from "./ReadmePage"; // New README page component

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/settings" element={<SettingsPanel />} />
                <Route path="/README" element={<ReadmePage />} />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);