import firebase from "firebase/app";

import { PaymentItemID } from "../stroll-enums/paymentItemID";

export interface IPayment {  
  amount: number;
  createdAt: firebase.firestore.FieldValue;
  id: string;
  intentID: string;
  itemID: PaymentItemID;
}

export const defaultPayment = (): IPayment => ({
  amount: 0,
  createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  id: "",
  intentID: "",
  itemID: PaymentItemID.None
});

export const paymentConverter: any = {
  toFirestore(payment: IPayment): firebase.firestore.DocumentData {
    return {
      amount: payment.amount,
      createdAt: payment.createdAt,         
      intentID: payment.intentID,
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
      intentID: data.intentID,
      itemID: data.itemID
    }
  }
}