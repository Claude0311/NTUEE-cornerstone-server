import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../pages/app.css";
import {wrapper} from '../store';

const MyApp = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};
export default wrapper.withRedux(MyApp)
