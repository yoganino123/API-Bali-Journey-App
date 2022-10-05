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

// ? route ke midtrans
userPaymentRoute.post("/pay/:id", UserPaymentController.payMidtrans);
userPaymentRoute.get("/pay/:code", UserPaymentController.getStatusMidtrans);
userPaymentRoute.get("/detail/:id", UserPaymentController.getDetailOrder);

module.exports = userPaymentRoute;
