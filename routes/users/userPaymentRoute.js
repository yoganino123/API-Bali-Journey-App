const userPaymentRoute = require("express").Router();
const { UserPaymentController } = require("../../controllers");

userPaymentRoute.get("/carts", UserPaymentController.getCarts);
userPaymentRoute.post("/carts", UserPaymentController.addCarts);
userPaymentRoute.delete("/carts/:id", UserPaymentController.deleteCarts);
userPaymentRoute.put("/carts", UserPaymentController.addPayments);
userPaymentRoute.get("/unpaids", UserPaymentController.getUnpaids);
userPaymentRoute.delete("/unpaids/:id", UserPaymentController.deletePayments);
userPaymentRoute.put("/unpaids/:id", UserPaymentController.successPayments);
userPaymentRoute.get("/paids", UserPaymentController.getPaids);

module.exports = userPaymentRoute;
