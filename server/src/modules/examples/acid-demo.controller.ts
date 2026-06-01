import type { Request, Response } from "express";
import {
  transferBalanceExample,
  demonstrateConsistencyViolation,
  demonstrateUniqueConstraint,
  purchaseProductWithLocking,
  purchaseProductWithoutLocking,
  createOrderWithDurabilityGuarantee,
  completeCheckoutWithFullACID,
} from "./acid-demo";

/**
 * ACID Demo Controller
 * 
 * These endpoints allow you to test ACID principles in action.
 * Use tools like Postman or curl to trigger these examples.
 */
export class AcidDemoController {
  /**
   * ACID: Atomicity Demo - Transfer balance between users
   * POST /api/acid-demo/atomicity
   * Body: { fromUserId: 1, toUserId: 2, amount: 100 }
   */
  atomicityDemo = async (req: Request, res: Response) => {
    const { fromUserId, toUserId, amount } = req.body;
    const result = await transferBalanceExample(fromUserId, toUserId, amount);
    res.json(result);
  };

  /**
   * ACID: Consistency Demo - Try to violate CHECK constraint
   * POST /api/acid-demo/consistency/violation
   */
  consistencyViolationDemo = async (_req: Request, res: Response) => {
    const result = await demonstrateConsistencyViolation();
    res.json(result);
  };

  /**
   * ACID: Consistency Demo - Try to create duplicate username
   * POST /api/acid-demo/consistency/unique
   * Body: { username: "testuser" }
   */
  uniqueConstraintDemo = async (req: Request, res: Response) => {
    const { username } = req.body;
    const result = await demonstrateUniqueConstraint(username);
    res.json(result);
  };

  /**
   * ACID: Isolation Demo - Purchase with row locking (SAFE)
   * POST /api/acid-demo/isolation/with-lock
   * Body: { productId: 1, quantity: 1 }
   */
  isolationWithLockDemo = async (req: Request, res: Response) => {
    const { productId, quantity } = req.body;
    const result = await purchaseProductWithLocking(productId, quantity);
    res.json(result);
  };

  /**
   * ACID: Isolation Demo - Purchase without locking (UNSAFE - for comparison)
   * POST /api/acid-demo/isolation/without-lock
   * Body: { productId: 1, quantity: 1 }
   */
  isolationWithoutLockDemo = async (req: Request, res: Response) => {
    const { productId, quantity } = req.body;
    const result = await purchaseProductWithoutLocking(productId, quantity);
    res.json(result);
  };

  /**
   * ACID: Durability Demo - Create order with durability guarantee
   * POST /api/acid-demo/durability
   * Body: { userId: 1, productId: 1, quantity: 1 }
   */
  durabilityDemo = async (req: Request, res: Response) => {
    const { userId, productId, quantity } = req.body;
    const result = await createOrderWithDurabilityGuarantee(
      userId,
      productId,
      quantity,
    );
    res.json(result);
  };

  /**
   * ACID: Complete Demo - Full checkout with all ACID properties
   * POST /api/acid-demo/complete-checkout
   * Body: { userId: 1, productId: 1, quantity: 1, price: 99.99 }
   */
  completeCheckoutDemo = async (req: Request, res: Response) => {
    const { userId, productId, quantity, price } = req.body;
    const result = await completeCheckoutWithFullACID(
      userId,
      productId,
      quantity,
      price,
    );
    res.json(result);
  };
}

export const acidDemoController = new AcidDemoController();
export default acidDemoController;
