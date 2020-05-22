const { Router } = require("express");

const routes = Router();

const verifyToken = require("./authentication/firebaseAuthentication");

const ManagerController = require("./controllers/ManagerController");
const ServiceController = require("./controllers/ServiceController");
const EstablishmentController = require("./controllers/EstablishmentController");
const ManagerEstablishmentsController = require("./controllers/ManagerEstablishmentsController");

routes
  .post("/managers", verifyToken, ManagerController.create)

  .get(
    "/managers/establishments",
    verifyToken,
    ManagerEstablishmentsController.index
  )

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

  .get("/establishments/:establishmentId/services", ServiceController.index)
  .post(
    "/establishments/:establishmentId/services",
    verifyToken,
    ServiceController.create
  )
  .put(
    "/establishments/:establishmentId/services/:serviceId",
    verifyToken,
    ServiceController.edit
  )
  .delete(
    "/establishments/:establishmentId/services/:serviceId",
    verifyToken,
    ServiceController.delete
  );

module.exports = routes;
