import React, { useState } from "react";

import Input from "../../shared/components/FormElements/Input";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_EMAIL,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import Button from "../../shared/components/FormElements/Button";
import { useForm } from "../../shared/hooks/form-hook";
import "./Auth.css";

function NewPlace() {
  const [userHasAccount, setUserHasAccount] = useState(true);
  const [formState, inputHandler, setFormData] = useForm(
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

  const toggleHasAccountHandler = (event) => {
    event.preventDefault();
    if (!userHasAccount) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: "",
            isValid: false,
          },
        },
        false
      );
    }
    setUserHasAccount((prev) => !prev);
  };

  return (
    <form className="auth-form" onSubmit={authSubmitHandler}>
      <h2 className="auth-form__title">Login Required</h2>
      <button
        className="auth-form__button--toggle-signup"
        onClick={toggleHasAccountHandler}
      >
        {userHasAccount
          ? "Don't have an account? Click here"
          : "Already have an account? Click here!"}
      </button>
      <hr />
      {!userHasAccount && (
        <Input
          id="name"
          element="input"
          type="text"
          label="Name"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a name"
          onInput={inputHandler}
        />
      )}
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
        {userHasAccount ? "Login" : "Create Account"}
      </Button>
    </form>
  );
}

export default NewPlace;
