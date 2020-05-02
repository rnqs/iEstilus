const connection = require("../database/connection");

module.exports = {
    async index(req, res) {
        const { firebaseUid } = req.params;

        const establishments = await connection("establishment")
            .join("service", "service.establishment_id", "=", "establishment._id")
            .select([
                "establishment.*",
                "service.*"
            ]);

        return res.json(establishments);
    },

    async create(req, res) {
        const { establishment, services } = req.body;
        const { firebaseUid } = req.params;

        const dbEstablishment = await connection("establishment").insert({
            
        });

        services.forEach(async (service) => {
            const dbService = await connection("service").insert({

            });
        });

        return res.json();
    },

    async edit(req, res) {
        const { establishment, services } = req.body;
        const { firebaseUid } = req.params;

        const dbEstablishment = await connection("establishment").insert({

        });

        services.forEach(async (service) => {
            const dbService = await connection("service").insert({

            });
        });

        return res.json();
    },

    async delete(req, res) {
        const { firebaseUid, establishmentId } = req.params;

        const establishment = await connection("establishment")
            .where("_id", establishmentId)
            .select("firebase_uid")
            .first();

        if (establishment.firebase_uid !== firebaseUid) {
            return res.status(401).json({
                error: "Insufficient Permissions"
            });
        }

        await connection("establishment")
            .where("_id", establishmentId)
            .delete();

        return res.status(204).send();
    }
};