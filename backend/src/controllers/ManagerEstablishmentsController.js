const connection = require("../database/connection");
const st = require("../database/postgis");

module.exports = {
  async index(req, res) {
    const { uid } = req.headers;
    const { id } = req.query;

    try {
      let establishments = await connection("establishments")
        .select(["*", st.asGeoJSON("coordinate")])
        .where({
          firebase_uid: uid,
        })
        .andWhere(id ? { _id: id } : {});

      if (id && establishments.length === 0) {
        return res.status(401).json({
          error: "Insufficient Permissions",
        });
      }

      if (id && establishments.length === 1) {
        const services = await connection("services")
          .select()
          .where({ establishment_id: id });

        establishments[0].services = services;
      }

      establishments.forEach((establishment) => {
        const { coordinates } = JSON.parse(establishment.coordinate);
        establishment.coordinate = {
          latitude: coordinates[1],
          longitude: coordinates[0],
        };
      });

      return res.json(id ? establishments[0] : establishments);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  },
};
