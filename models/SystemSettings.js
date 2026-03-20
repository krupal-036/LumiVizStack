import mongoose from "mongoose";

const { Schema } = mongoose;

const SystemSettingsSchema = new Schema({
    configName: {
        type: String,
        default: "global_config",
        unique: true
    },
    isLoginEnabled: {
        type: Boolean,
        default: true
    },
    isSignupEnabled: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const SystemSettings = mongoose.models.SystemSettings || mongoose.model("SystemSettings", SystemSettingsSchema);

export default SystemSettings;