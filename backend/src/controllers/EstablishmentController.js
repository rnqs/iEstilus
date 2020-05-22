const connection = require("../database/connection");
const st = require("../database/postgis");

module.exports = {
  async index(req, res) {
    const { page = 1 } = req.query;

    const [{ count }] = await connection("establishments").count();

    const setDistances = st.distance(
      st.transform(
        st.setSRID(
          st.makePoint(req.query.longitude || 0, req.query.latitude || 0),
          4326
        ),
        3857
      ),
      st.transform(st.setSRID("coordinate", 4326), 3857)
    );
    try {
      let establishments = await connection("establishments")
        .limit(5)
        .offset((page - 1) * 5)
        .select([
          "*",
          req.query.latitude && req.query.longitude
            ? setDistances.as("distance")
            : "*",
          st.asGeoJSON("coordinate"),
        ])
        .whereRaw(
          req.query.q
            ? `to_tsvector('portuguese', name || ' ' || description || ' ' || address) @@ to_tsquery('portuguese', '${req.query.q
                .trim()
                .replace(/\s/g, " & ")}')`
            : ``
        )
        .orderBy(
          req.query.latitude && req.query.longitude ? "distance" : "_id"
        );

      establishments.forEach((establishment) => {
        const { coordinates } = JSON.parse(establishment.coordinate);
        establishment.coordinate = {
          latitude: coordinates[1],
          longitude: coordinates[0],
        };
      });

      res.header("X-Total-count", count);

      return res.json(establishments);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  },

  async create(req, res) {
    const {
      name,
      description,
      photo_url,
      phone_number,
      whatsapp_available,
      address,
      coordinate,
    } = req.body;
    const { uid } = req.headers;

    try {
      const [id] = await connection("establishments").insert(
        {
          firebase_uid: uid,
          name,
          description,
          photo_url,
          phone_number,
          whatsapp_available,
          address,
          coordinate: st.geomFromText(
            `Point(${coordinate.longitude} ${coordinate.latitude})`,
            4326
          ),
        },
        "_id"
      );

      return res.status(201).json({ id });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  },

  async edit(req, res) {
    const {
      name,
      description,
      photo_url,
      phone_number,
      whatsapp_available,
      address,
      coordinate,
    } = req.body;
    const { establishmentId } = req.params;
    const { uid } = req.headers;

    try {
      let establishment = await connection("establishments")
        .where("_id", establishmentId)
        .select(["establishments.*", st.asGeoJSON("coordinate")])
        .first();

      if (establishment.firebase_uid !== uid) {
        return res.status(401).json({
          error: "Insufficient Permissions",
        });
      }

      await connection("establishments")
        .update({
          name: name || establishment.name,
          description: description || establishment.description,
          photo_url: photo_url || establishment.photo_url,
          phone_number: phone_number || establishment.phone_number,
          whatsapp_available:
            whatsapp_available || establishment.whatsapp_available,
          address: address || establishment.address,
          coordinate: coordinate
            ? st.geomFromText(
                `Point(${coordinate.longitude} ${coordinate.latitude})`,
                4326
              )
            : st.geomFromText(
                `Point(${establishment.coordinate.longitude} ${establishment.coordinate.latitude})`,
                4326
              ),
        })
        .where("_id", establishmentId);

      establishment = await connection("establishments")
        .where("_id", establishmentId)
        .select(["establishments.*", st.asGeoJSON("coordinate")])
        .first();

      const { coordinates } = JSON.parse(establishment.coordinate);
      establishment.coordinate = {};
      establishment.coordinate.latitude = coordinates[1];
      establishment.coordinate.longitude = coordinates[0];

      return res.status(200).json(establishment);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  },

  async delete(req, res) {
    const { establishmentId } = req.params;
    const { uid } = req.headers;

    try {
      const establishment = await connection("establishments")
        .where("_id", establishmentId)
        .select("firebase_uid")
        .first();

      if (establishment.firebase_uid !== uid) {
        return res.status(401).json({ error: "Insufficient Permissions" });
      }

      await connection("establishments").where("_id", establishmentId).delete();

      return res.status(204).send();
    } catch (error) {
      return res.status(500).json(error.message);
    }
  },
};
