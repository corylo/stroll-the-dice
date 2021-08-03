import React, { useContext } from "react";
import classNames from "classnames";

import Stripe from "@stripe/stripe-js";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";

import { Button } from "../../../../components/buttons/button";
import { Form } from "../../../../components/form/form";
import { FormActions } from "../../../../components/form/formActions";
import { FormBody } from "../../../../components/form/formBody";
import { FormBodySection } from "../../../../components/form/formBodySection";
import { FormStatusMessage } from "../../../../components/form/formStatusMessage";
import { InputWrapper } from "../../../../components/inputWrapper/inputWrapper";

import { GameDayPurchaseContext } from "../gameDayPurchaseModal/gameDayPurchaseModal";

import { PaymentService } from "../../../../services/paymentService";

import { PaymentFormUtility } from "../../../../utilities/paymentFormUtility";

import { IGameDayPurchaseStateFields } from "../../models/gameDayPurchaseState";
import { IPaymentBillingAddress, IPaymentBillingFields } from "../../../../../stroll-models/paymentBillingFields";
import { IStripeBillingDetails } from "../../../../../stroll-models/stripe/stripeBillingDetails";

import { FormStatus } from "../../../../enums/formStatus";
import { PaymentItemID } from "../../../../../stroll-enums/paymentItemID";

interface GameDayPaymentFormProps {
  children?: any;
  itemID: PaymentItemID;
  quantity: number;
}

export const GameDayPaymentForm: React.FC<GameDayPaymentFormProps> = (props: GameDayPaymentFormProps) => {
  const { state, setState } = useContext(GameDayPurchaseContext);

  const { errors, fields } = state;

  const stripe: Stripe.Stripe = useStripe(),
    stripeElements: Stripe.StripeElements = useElements();

  const updateFields = (fields: IGameDayPurchaseStateFields): void => {
    if(state.status !== FormStatus.Submitting) {
      setState({ ...state, fields });  
    }
  }

  const updateBillingFields = (billing: IPaymentBillingFields): void => {
    updateFields({ ...state.fields, billing });
  }

  const updateBillingAddressFields = (address: IPaymentBillingAddress): void => {
    updateBillingFields({  ...state.fields.billing, address });
  }

  const submit = async () => {
    if(state.status !== FormStatus.Submitting) {
      try {
        setState({ ...state, status: FormStatus.Submitting });

        const cardElement: Stripe.StripeCardElement = stripeElements.getElement(CardElement);

        const billing_details: IStripeBillingDetails = PaymentFormUtility.mapStripeBillingDetails(state.fields.billing);

        const intentID: string = await PaymentService.createPayment({        
          itemID: props.itemID,
          quantity: 1
        });

        const { paymentMethod } = await stripe.createPaymentMethod({
          billing_details,
          card: cardElement,
          type: "card"
        });

        setState({ ...state, status: FormStatus.Submitting });

        await PaymentService.confirmPayment({ intentID, paymentMethodID: paymentMethod.id });

        setState({ ...state, status: FormStatus.SubmitSuccess });
      } catch (err) {
        console.error(err);

        setState({ ...state, status: FormStatus.SubmitError });
      }
    }
  }

  const getChildContent = (): JSX.Element => {
    if(props.children) {
      return (
        <FormBodySection>
          {props.children}
        </FormBodySection>
      )
    }
  }

  const getSubmitStatusMessage = (): JSX.Element => {
    if(state.status === FormStatus.SubmitSuccess) {
      return (
        <FormStatusMessage 
          status={state.status} 
          text="Purchase complete! If you opened the shop in a new tab you may now close it." 
        />
      )
    } else if (state.status === FormStatus.SubmitError) {
      return (
        <FormStatusMessage 
          status={state.status} 
          text="There was an issue completing the purchase. Please refresh and try again!" 
        />
      )
    }
  }

  const getFormPaymentFields = (): JSX.Element => {
    if(state.status !== FormStatus.SubmitSuccess) {
      return (
        <FormBodySection className="form-payment-fields-section">          
          <InputWrapper
            id="billing-name-input" 
            label="Name"           
            value={fields.billing.name}
            error={errors.billing.name}
          >
            <input 
              type="text"
              className="passion-one-font"
              disabled={state.status === FormStatus.Submitting}
              placeholder="Name"
              value={fields.billing.name}
              onChange={(e: any) => updateBillingFields({ ...state.fields.billing, name: e.target.value })}
            />
          </InputWrapper>        
          <InputWrapper
            id="billing-email-input" 
            label="Email"           
            value={fields.billing.email}
            error={errors.billing.email}
          >
            <input 
              type="text"
              className="passion-one-font"
              disabled={state.status === FormStatus.Submitting}
              placeholder="Email"
              value={fields.billing.email}
              onChange={(e: any) => updateBillingFields({ ...state.fields.billing, email: e.target.value })}
            />
          </InputWrapper>        
          <InputWrapper
            id="billing-address-input" 
            label="Address"           
            value={fields.billing.address.line1}
            error={errors.billing.address.line1}
          >
            <input 
              type="text"
              className="passion-one-font"
              disabled={state.status === FormStatus.Submitting}
              placeholder="Address"
              value={fields.billing.address.line1}
              onChange={(e: any) => updateBillingAddressFields({ ...state.fields.billing.address, line1: e.target.value })}
            />
          </InputWrapper>      
          <InputWrapper
            id="billing-address-2-input" 
            label="Apt / Suite / Etc"           
            value={fields.billing.address.line2}
            error={errors.billing.address.line2}
          >
            <input 
              type="text"
              className="passion-one-font"
              disabled={state.status === FormStatus.Submitting}
              placeholder="Apt / Suite / Etc"
              value={fields.billing.address.line2}
              onChange={(e: any) => updateBillingAddressFields({ ...state.fields.billing.address, line2: e.target.value })}
            />
          </InputWrapper>   
          <InputWrapper
            id="billing-city-input" 
            label="City"           
            value={fields.billing.address.city}
            error={errors.billing.address.city}
          >
            <input 
              type="text"
              className="passion-one-font"
              disabled={state.status === FormStatus.Submitting}
              placeholder="City"
              value={fields.billing.address.city}
              onChange={(e: any) => updateBillingAddressFields({ ...state.fields.billing.address, city: e.target.value })}
            />
          </InputWrapper>   
          <InputWrapper
            id="billing-state-input" 
            label="State"           
            value={fields.billing.address.state}
            error={errors.billing.address.state}
          >
            <input 
              type="text"
              className="passion-one-font"
              disabled={state.status === FormStatus.Submitting}
              placeholder="State"
              value={fields.billing.address.state}
              onChange={(e: any) => updateBillingAddressFields({ ...state.fields.billing.address, state: e.target.value })}
            />
          </InputWrapper>   
          <InputWrapper
            id="billing-zip-input" 
            label="Zip"           
            value={fields.billing.address.zip}
            error={errors.billing.address.zip}
          >
            <input 
              type="text"
              className="passion-one-font"
              disabled={state.status === FormStatus.Submitting}
              placeholder="Zip"
              value={fields.billing.address.zip}
              onChange={(e: any) => updateBillingAddressFields({ ...state.fields.billing.address, zip: e.target.value })}
            />
          </InputWrapper>
          <InputWrapper id="billing-credit-card-input" label="Card">
            <CardElement options={PaymentFormUtility.getCreditCardInputOptions()} />
          </InputWrapper>
        </FormBodySection>
      )
    }
  }

  const getSubmitButton = (): JSX.Element => {
    if(state.status !== FormStatus.SubmitSuccess) {
      const getContent = (): JSX.Element | string => {
        if(state.status === FormStatus.Submitting) {
          return (
            <i className="fal fa-spinner-third" />
          )
        }

        return "Buy!";
      }

      return (
        <Button
          className="submit-button fancy-button passion-one-font" 
          handleOnClick={submit}
        >
          {getContent()}
        </Button>
      )
    }
  }

  return (
    <Form id="game-day-payment-form" className={classNames({ submitting: state.status === FormStatus.Submitting })}>
      <FormBody>
        {getChildContent()}
        {getFormPaymentFields()}
      </FormBody>
      <FormActions>
        {getSubmitButton()}
      </FormActions>
      {getSubmitStatusMessage()}
    </Form>
  )
}