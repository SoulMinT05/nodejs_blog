const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
const mongooseDelete = require('mongoose-delete');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        // _id: { type: Number },
        name: { type: String, unique: true },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        isAdmin: {
            type: Boolean,
            required: true,
            default: false,
        },
        password: {
            type: String,
            required: true,
        },
        confirmPassword: { type: String, required: true },
        slug: { type: String, slug: 'name', unique: true },
    },
    {
        // _id: false,
        timestamps: true,
    },
);

// Add plugin run
mongoose.plugin(slug);
// UserSchema.plugin(AutoIncrement, );
UserSchema.plugin(mongooseDelete, {
    deletedAt: true,
    deletedBy: true,
    overrideMethods: 'all',
});

module.exports = mongoose.model('User', UserSchema);
