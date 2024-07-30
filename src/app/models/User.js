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
            // type: String,
            // validate: {
            //     validator: async function (email) {
            //         const user = await this.constructor.findOne({ email });
            //         if (user) {
            //             if (this.id === user.id) {
            //                 return true;
            //             }
            //             return false;
            //         }
            //         return true;
            //     },
            //     message: props =>
            //         'The specified email address is already in use.',
            // },
            // required: [true, 'User email required'],
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
