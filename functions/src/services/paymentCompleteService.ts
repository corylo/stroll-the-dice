import { logger } from "firebase-functions";
import stripe from "stripe";

import { GameDayUtility } from "../../../stroll-utilities/gameDayUtility"
import { PaymentUtility } from "../../../stroll-utilities/paymentUtility";

import { PaymentItemID } from "../../../stroll-enums/paymentItemID";
import { GameDayStatsTransactionService } from "./transaction/gameDayStatsTransactionService";
import { GameDayPurchaseOptionUnit } from "../../../stroll-enums/gameDayPurchaseOptionUnit";

interface IPaymentCompleteService {
  handlePaymentCompletion: (uid: string, intent: stripe.PaymentIntent) => Promise<void>;
}

export const PaymentCompleteService: IPaymentCompleteService = {
  handlePaymentCompletion: async (uid: string, intent: stripe.PaymentIntent): Promise<void> => {
    const itemID: PaymentItemID = PaymentUtility.getItemID(intent.description);

    if(GameDayUtility.isGameDayPurchase(itemID)) {
      const unit: GameDayPurchaseOptionUnit = GameDayUtility.getGameDayPurchaseOptionUnit(itemID),
        quantity: number = GameDayUtility.getDayQuantity(unit);

      logger.info(`Handling payment completion for user: [${uid}] for Game Day purchase option: [${unit}], quantity: [${quantity}].`);

      await GameDayStatsTransactionService.updateAvailableAndTotal(uid, {
        available: quantity,
        total: quantity
      });
    }
  }
}