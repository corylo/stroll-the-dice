import firebase from "firebase-admin";

import { db } from "../../../config/firebase";

import { IPayment, paymentConverter } from "../../../../stroll-models/payment";

interface IPaymentHistoryTransactionService {
  create: (transaction: firebase.firestore.Transaction, uid: string, payment: IPayment) => void;
}

export const PaymentHistoryTransactionService: IPaymentHistoryTransactionService = {
  create: (transaction: firebase.firestore.Transaction, uid: string, payment: IPayment): void => {
    const ref: firebase.firestore.DocumentReference = db.collection("profiles")      
      .doc(uid)
      .collection("payments")
      .withConverter(paymentConverter)
      .doc();
    
    transaction.set(ref, payment);
  }
}