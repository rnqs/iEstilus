const connection = require("../database/connection");

module.exports = {
  async index(req, res) {
    const { establishmentId } = req.params;

    try {
      const services = await connection("services").where({
        establishment_id: establishmentId,
      });

      return res.json(services);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  },

  async create(req, res) {
    const { uid } = req.headers;
    const { establishmentId } = req.params;
    const { name, photo_url, price } = req.body;

    try {
      const { firebase_uid } = await connection("establishments")
        .select(["establishments.firebase_uid"])
        .where({ _id: establishmentId })
        .first();

      if (firebase_uid === uid) {
        const [id] = await connection("services").insert(
          {
            establishment_id: establishmentId,
            name,
            photo_url,
            price,
          },
          "_id"
        );

        return res.status(201).json(id);
      }
      return res.status(401).send({ error: "Insufficient Permissions" });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  },

  async edit(req, res) {
    const { uid } = req.headers;
    const { establishmentId, serviceId } = req.params;
    const { name, photo_url, price } = req.body;

    try {
      const establishment = await connection("establishments")
        .select()
        .where({ _id: establishmentId })
        .first();

      const service = await connection("services")
        .select()
        .where({ _id: serviceId })
        .first();

      if (
        service.establishment_id + "" === establishmentId &&
        establishment.firebase_uid === uid
      ) {
        const [serviceUpdated] = await connection("services")
          .where({ _id: serviceId })
          .update(
            {
              name: name || service.name,
              photo_url: photo_url || service.photo_url,
              price: price || service.price,
            },
            "*"
          );

        return res.status(201).json(serviceUpdated);
      }
      return res.status(401).send({ error: "Insufficient Permissions" });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  },

  async delete(req, res) {
    const { uid } = req.headers;
    const { establishmentId, serviceId } = req.params;

    try {
      const { firebase_uid } = await connection("establishments")
        .select()
        .where({ _id: establishmentId })
        .first();

      const { establishment_id } = await connection("services")
        .select()
        .where({ _id: serviceId })
        .first();

      if (establishment_id + "" === establishmentId && firebase_uid === uid) {
        await connection("services").where({ _id: serviceId }).delete();

        return res.status(204).send();
      }
      return res.status(401).send({ error: "Insufficient Permissions" });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  },
};
