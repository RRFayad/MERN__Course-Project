import React from "react";

import Input from "../../shared/components/FormElements/Input";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_EMAIL,
} from "../../shared/util/validators";
import Button from "../../shared/components/FormElements/Button";
import { useForm } from "../../shared/hooks/form-hook";
import "./Auth.css";

function NewPlace() {
  const [formState, inputHandler] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const authSubmitHandler = (event) => {
    event.preventDefault();
    // Create the logic ofr sending this to the backend
    console.log(formState.inputs);
  };

  return (
    <form className="place-form" onSubmit={authSubmitHandler}>
      <h2 className="place-form__title">Login Required</h2>
      <hr />
      <Input
        id="email"
        element="input"
        type="text"
        label="E-mail"
        validators={[VALIDATOR_EMAIL()]}
        errorText="Please enter a valid email"
        onInput={inputHandler}
      />
      <Input
        id="password"
        element="input"
        type="password"
        label="Password"
        validators={[VALIDATOR_MINLENGTH(6)]}
        errorText="Please, at least 6 characters"
        onInput={inputHandler}
      />

      <Button type="submit" disabled={!formState.isValid}>
        Login
      </Button>
    </form>
  );
}

export default NewPlace;
