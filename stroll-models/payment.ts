import firebase from "firebase/app";

import { PaymentItemID } from "../stroll-enums/paymentItemID";

export interface IPayment {  
  amount: number;
  createdAt: firebase.firestore.FieldValue;
  id: string;
  checkoutSessionID: string;
  itemID: PaymentItemID;
}

export const defaultPayment = (): IPayment => ({
  amount: 0,
  createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  id: "",
  checkoutSessionID: "",
  itemID: PaymentItemID.None
});

export const paymentConverter: any = {
  toFirestore(payment: IPayment): firebase.firestore.DocumentData {
    return {
      amount: payment.amount,
      createdAt: payment.createdAt,         
      checkoutSessionID: payment.checkoutSessionID,
      itemID: payment.itemID
    }
  },
  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot<IPayment>
  ): IPayment {
    const data: IPayment = snapshot.data();

    return {
      amount: data.amount,
      createdAt: data.createdAt,            
      id: snapshot.id,
      checkoutSessionID: data.checkoutSessionID,
      itemID: data.itemID
    }
  }
}