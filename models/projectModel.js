const mongoose = require('mongoose')

const projectSchema = mongoose.Schema({
    project_name : {
        type: String,
        required: [true, "Please enter a product name"]
    },
    project_description : {
        type: String,
        required: [true, "Please add a project description"]
    },
    project_price : {
        type: Number,
        required: [true, "Please add a project price"]
    },
    project_tasks : {
        type: String,
        required: [true, "Please specify project tasks"]
    },
    project_start_date : {
        type: Date,
        required: [true, "Please add start date"]
    },
    project_end_date : {
        type: Date,
        required: [true, "Please add end date"]
    },
    project_participant : {
        type: String,
        required: false
    }
}, {
    timestamps: true
})

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;