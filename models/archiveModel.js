const mongoose = require('mongoose');

const archiveSchema = mongoose.Schema({
    project_name : {
        type: String,
        required: [true, "Please enter a product name"]
    },
    project_member_name : {
        type: String,
        required: [true, "Please add member name"]
    },
    project_member_type : {
        type: String,
        required: [true, "Please add member type"]
    }
}, {
    timestamps: true
})

const Archive = mongoose.model("Archive", archiveSchema);

module.exports = Archive;