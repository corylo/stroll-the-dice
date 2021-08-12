import firebase from "firebase/app";

import { PaymentItemID } from "../stroll-enums/paymentItemID";

export interface IPayment {  
  amount: number;
  checkoutSessionID: string;
  createdAt: firebase.firestore.FieldValue;
  id: string;
  itemID: PaymentItemID;
}

export const defaultPayment = (): IPayment => ({
  amount: 0,
  checkoutSessionID: "",
  createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  id: "",
  itemID: PaymentItemID.None
});

export const paymentConverter: any = {
  toFirestore(payment: IPayment): firebase.firestore.DocumentData {
    return {
      amount: payment.amount,
      checkoutSessionID: payment.checkoutSessionID,
      createdAt: payment.createdAt,        
      itemID: payment.itemID
    }
  },
  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot<IPayment>
  ): IPayment {
    const data: IPayment = snapshot.data();

    return {
      amount: data.amount,
      checkoutSessionID: data.checkoutSessionID,
      createdAt: data.createdAt,     
      id: snapshot.id,
      itemID: data.itemID
    }
  }
}