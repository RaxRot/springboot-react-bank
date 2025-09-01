import React from "react";
import ReactDOM, {createRoot} from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css"; // Tailwind подключен
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
            <Toaster position="top-right" />
        </BrowserRouter>
    </React.StrictMode>
)
