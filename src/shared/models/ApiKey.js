import { model, Schema } from "mongoose";

const apiKeySchema = Schema({
    keyId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    keyValue: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    clientId: {
        type: Schema.Types.ObjectId,
        ref: 'Client',
        required: true,
        index: true
    },
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
    },
    description: {
        type: String,
        maxlength: 500,
        default: '',
    },
    environment: {
        type: String,
        enum: ['production', 'development', 'testing', 'staging'],
        default: 'production'
    },
    isActive: {
        type: Boolean,
        default: true,
    },

    permissions: {
        canIngest: {
            type: Boolean,
            default: true
        },
        canReadAnalytics: {
            type: Boolean,
            default: false,
        },
        allowedServices: [{
            type: String,
            trim: true
        }]
    },
    security: {
        allowedIPs: [{
            type: String,
            validate: {
                validator: function (ip) {
                    return /^(\d{1,3}\.){3}\d{1,3}(\/\d{1,2})?$/.test(ip) || ip === '0.0.0.0/0';
                },
                message: "Invalid IP address format"
            }
        }],
        allowedOrigins: [{
            type: String,
            validate: {
                validator: function (origin) {
                    return /^https?:\/\/[^\s]+$/.test(v) || v === '*';
                },
                message: "Invalid origin format"
            }
        }],
        lastRotated: {
            type: Date,
            default: Date.now
        },
        rotationWarningDats: {
            type: Number,
            default: 30
        }
    },
    expiresAt: {
        type: Date,
        index: true,
        default: () => {
            const days = parseInt(process.env.API_KEY_EXPIRY_DAYS || '365');
            return new Date(Date.now() + days * 24 * 60 * 60 * 1000)
        }
    },
    metadata: {
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        purpose: {
            type: String,
            trim: true,
            maxlength: 200,
        },
        tags: [{
            type: String,
            trim: true,
            maxlength: 50,
        }],
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
},
    {
        timestamps: true,
        collection: 'api_keys',
    }
)

apiKeySchema.index({ clientId: 1, isActive: 1 });
apiKeySchema.index({ keyValue: 1, isActive: 1 });
apiKeySchema.index({ environment: 1, clientId: 1 });
apiKeySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

const ApiKey = model("ApiKey", apiKeySchema)
export default ApiKey;