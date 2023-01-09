import './App.css';
import React from "react";
//import Form from "react-bootstrap/Form";
//import Button from "react-bootstrap/Button";
import Login from './auth/login';

function App() {

  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  // function validateForm() {
  //   return email.length > 0 && password.length > 0;
  // }
  // function handleSubmit(event) {
  //   event.preventDefault();
  // }

  return (
    <div className="App">
      <Login />
    </div>
  );
}

export default App;
