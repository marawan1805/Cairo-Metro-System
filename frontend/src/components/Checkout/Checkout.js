import React from "react";
import { Form, Field } from "react-final-form";
import { useMediaQuery } from "react-responsive";
import Card from "./Card";
import {
  formatCreditCardNumber,
  formatCVC,
  formatExpirationDate,
} from "./cardUtils";
import { useNavigate } from "react-router-dom";

const CheckoutComponent = ({ price }) => {
  const isDesktop = useMediaQuery({
    query: "(min-aspect-ratio: 1/1)",
  });
  let fieldCSS = {};
  if (!isDesktop) {
    fieldCSS = {
      marginLeft: "0px",
    };
  }

  const navigate = useNavigate();

  const onSubmit = async (values) => {
    navigate("/payment/success");
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <Form
        style={{
          width: "auto",
          alignItems: "center",
          justifyContent: "center",
        }}
        onSubmit={onSubmit}
        render={({
          handleSubmit,
          form,
          submitting,
          pristine,
          values,
          active,
        }) => {
          return (
            <form
              style={{ alignItems: "center", justifyContent: "center" }}
              onSubmit={handleSubmit}
            >
              <Card
                number={values.number || ""}
                name={values.name || ""}
                expiry={values.expiry || ""}
                cvc={values.cvc || ""}
                focused={active}
              />
              <div style={{ marginLeft: "3.7em" }}>
                <Field
                  style={fieldCSS}
                  name="number"
                  component="input"
                  type="text"
                  pattern="[\d| ]{16,22}"
                  placeholder="Card Number"
                  format={formatCreditCardNumber}
                />
                <Field
                  style={fieldCSS}
                  name="name"
                  component="input"
                  type="text"
                  placeholder="Name"
                />

                <Field
                  style={fieldCSS}
                  name="expiry"
                  component="input"
                  type="text"
                  pattern="\d\d/\d\d"
                  placeholder="Valid Thru"
                  format={formatExpirationDate}
                />
                <Field
                  style={fieldCSS}
                  name="cvc"
                  component="input"
                  type="text"
                  pattern="\d{3,4}"
                  placeholder="CVC"
                  format={formatCVC}
                />
              </div>
              <div>
                <button type="submit" disabled={pristine || submitting}>
                  Pay ${price}
                </button>
              </div>
            </form>
          );
        }}
      />
    </div>
  );
};

export default CheckoutComponent;
