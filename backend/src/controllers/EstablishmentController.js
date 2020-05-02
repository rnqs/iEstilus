const connection = require("../database/connection");

module.exports = {
    async index(req, res) {
        const {
            page = 1
        } = req.query;

        const [count] = await connection("establishment").count();

        const establishments = await connection("establishment")
            .join("service", "service.establishment_id", "=", "establishment._id")
            .limit(5)
            .offset((page - 1) * 5)
            .select([
                "establishment.*",
                "service.*"
            ]);

        res.header("X-Total-count", count["count(*)"]);

        return res.json(establishments);
    }
};