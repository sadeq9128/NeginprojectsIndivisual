
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './containers/main/App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter} from "react-router-dom";
import 'antd/dist/antd.css';
import { ConfigProvider } from 'antd';


ReactDOM.render(
    <ConfigProvider direction="rtl">
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </ConfigProvider>,
  document.getElementById('container')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
