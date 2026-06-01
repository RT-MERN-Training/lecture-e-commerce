import { Router } from "express";
import acidDemoController from "./acid-demo.controller";

const router = Router();

/**
 * ACID Demo Routes
 * 
 * These routes are for educational purposes to demonstrate ACID principles.
 * In production, you would remove or protect these endpoints.
 */

// Atomicity examples
router.post("/atomicity", acidDemoController.atomicityDemo);

// Consistency examples
router.post("/consistency/violation", acidDemoController.consistencyViolationDemo);
router.post("/consistency/unique", acidDemoController.uniqueConstraintDemo);

// Isolation examples
router.post("/isolation/with-lock", acidDemoController.isolationWithLockDemo);
router.post("/isolation/without-lock", acidDemoController.isolationWithoutLockDemo);

// Durability examples
router.post("/durability", acidDemoController.durabilityDemo);

// Complete ACID example
router.post("/complete-checkout", acidDemoController.completeCheckoutDemo);

export default router;
