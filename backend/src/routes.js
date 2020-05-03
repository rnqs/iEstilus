const { Router } = require("express");

const routes = Router();

const verifyToken = require("./authentication/firebaseAuthentication");

const ManagerController = require("./controllers/ManagerController");
const EstablishmentController = require("./controllers/EstablishmentController");
const ServiceController = require("./controllers/ServiceController");

routes
  .post("/managers", verifyToken, ManagerController.create)

  .get("/establishments", EstablishmentController.index)
  .post("/establishments", verifyToken, EstablishmentController.create)
  .put(
    "/establishments/:establishmentId",
    verifyToken,
    EstablishmentController.edit
  )
  .delete(
    "/establishments/:establishmentId",
    verifyToken,
    EstablishmentController.delete
  )

  .get("/services", ServiceController.index)
  .post("/services", verifyToken, ServiceController.create)
  .put("/services/:serviceId", verifyToken, ServiceController.edit)
  .delete("/services/:serviceId", verifyToken, ServiceController.delete);

module.exports = routes;
