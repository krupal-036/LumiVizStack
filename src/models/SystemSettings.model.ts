import mongoose, { Model, Schema } from "mongoose";
export interface ISystemsetting {
    configName: string;
    isLoginEnabled: boolean;
    isSignupEnabled: boolean;
    createdAt: Date;
}
const SystemSettingsSchema = new Schema<ISystemsetting>({
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
}, { timestamps: false });

const SystemSettings: Model<ISystemsetting> = mongoose.models.SystemSettings as Model<ISystemsetting> || mongoose.model<ISystemsetting>("SystemSettings", SystemSettingsSchema);

export default SystemSettings;