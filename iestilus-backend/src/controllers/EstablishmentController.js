const Establishment = require('../models/Establishment');

module.exports = {
    async index(req, res) {
        const perPage = 15;
        const page = Math.max(0, req.query.page);

        const establishments = await Establishment.find().limit(perPage).skip(perPage * page);

        return res.json(establishments);
    },

    async store(req, res) {
        const {
            name,
            services,
            address,
            thumbnail_URL,
            description,
            rating,
            phone,
            whatsappAvailable,
            email,
            password
        } = req.body;

        const establishment = await Establishment.create({
            name,
            services,
            address,
            thumbnail_URL,
            description,
            rating,
            phone,
            whatsappAvailable,
            email,
            password
        })

        return res.json(establishment);
    },

    async login(req, res) {
        const { email, password } = req.body;

        await Establishment.findOne({ email }, function (err, user) {
            if (err) throw err;

            // test a matching password
            this.comparePassword(password, function (err, isMatch) {
                if (err) throw err;
                console.log(password, isMatch);
            });
        });
    }
}