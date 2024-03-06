import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import { RouterProvider, createBrowserRouter} from "react-router-dom";
import PostList from './PostList';
//import Duplicate from './Duplicate';
import SignIn from './SignIn';
import ResetPwd from './ResetPwd';
const router = createBrowserRouter([
  {
     path:"/",
     element:<App/>
  },
  {
     path:"/postlist",
     element: <PostList/>
  },
  
  {
    path:"/signin",
    element:<SignIn/>
  },
  {
    path:"/password-reset",
    element:<ResetPwd/>
  }
  
]);
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RouterProvider router = {router} />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
/**{
  path:"/duplicate",
  element:<Duplicate/>
},**/



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

