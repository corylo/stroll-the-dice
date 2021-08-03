import { functions } from "../config/firebase";

import { IConfirmPaymentRequest } from "../../stroll-models/confirmPaymentRequest";
import { ICreatePaymentRequest } from "../../stroll-models/createPaymentRequest";

interface IPaymentService {
  createPayment: (request: ICreatePaymentRequest) => Promise<string>;
  confirmPayment: (request: IConfirmPaymentRequest) => Promise<void>;
}

export const PaymentService: IPaymentService = {
  confirmPayment: async (request: IConfirmPaymentRequest): Promise<void> => {
    const res: any = await functions.httpsCallable("confirmPayment")(request);

    return res.data;
  },
  createPayment: async (request: ICreatePaymentRequest): Promise<string> => {
    const res: any = await functions.httpsCallable("createPayment")(request);

    return res.data;
  }
}