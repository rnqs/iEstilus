const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const ServiceSchema = new Schema({
    name: String,
    description: String,
    price: Number
})

const EstablishmentSchema = new Schema({
  name: { 
      type: String, 
      index: { unique: true }
  },
  services: [ServiceSchema],
  address: String,
  thumbnail_URL: String,
  description: String,
  rating: Number,
  phone: String,
  whatsappAvailable: Boolean,
  email: String,
  password: {
      type: String,
      required: true 
  }
});

EstablishmentSchema.pre('save', function(next) {
    let establishment = this;

    // only hash the password if it has been modified (or is new)
    if (!establishment.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(10, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(establishment.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            establishment.password = hash;
            next();
        });
    });
});

EstablishmentSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('Establishment', EstablishmentSchema);