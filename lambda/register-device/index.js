const { SNSClient, CreatePlatformEndpointCommand, SetEndpointAttributesCommand } = require('@aws-sdk/client-sns');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand, PutCommand } = require('@aws-sdk/lib-dynamodb');

const snsClient = new SNSClient({});
const dynamoClient = new DynamoDBClient({});
const dynamodb = DynamoDBDocumentClient.from(dynamoClient);

/**
 * Lambda function to register device tokens for push notifications
 * 
 * Expected input:
 * {
 *   userId: string,
 *   deviceId: string,
 *   platform: 'ios' | 'android',
 *   token: string
 * }
 */
exports.handler = async (event) => {
    console.log('Register device request:', JSON.stringify(event, null, 2));

    try {
        // Parse request body
        const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
        const { userId, deviceId, platform, token } = body;

        // Validate input
        if (!userId || !deviceId || !platform || !token) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({
                    error: 'Missing required fields',
                    required: ['userId', 'deviceId', 'platform', 'token']
                })
            };
        }

        if (!['ios', 'android'].includes(platform)) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({
                    error: 'Invalid platform',
                    message: 'Platform must be either "ios" or "android"'
                })
            };
        }

        // Get platform ARN from environment
        const platformArn = platform === 'ios'
            ? process.env.APNS_PLATFORM_ARN
            : process.env.FCM_PLATFORM_ARN;

        if (!platformArn) {
            console.error(`Platform ARN not configured for ${platform}`);
            return {
                statusCode: 500,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({
                    error: 'Platform not configured',
                    message: `${platform.toUpperCase()} platform ARN not set`
                })
            };
        }

        // Check if endpoint already exists for this device
        let endpointArn;
        const existingDevice = await dynamodb.send(new GetCommand({
            TableName: process.env.DEVICE_TOKENS_TABLE || 'device-tokens',
            Key: { userId, deviceId }
        }));

        if (existingDevice.Item && existingDevice.Item.endpointArn) {
            // Update existing endpoint
            try {
                await snsClient.send(new SetEndpointAttributesCommand({
                    EndpointArn: existingDevice.Item.endpointArn,
                    Attributes: {
                        Token: token,
                        Enabled: 'true'
                    }
                }));
                endpointArn = existingDevice.Item.endpointArn;
                console.log('Updated existing endpoint:', endpointArn);
            } catch (error) {
                console.log('Failed to update endpoint, creating new one:', error.message);
                // If update fails, create new endpoint
                const endpoint = await snsClient.send(new CreatePlatformEndpointCommand({
                    PlatformApplicationArn: platformArn,
                    Token: token,
                    CustomUserData: userId
                }));
                endpointArn = endpoint.EndpointArn;
            }
        } else {
            // Create new SNS Platform Endpoint
            const endpoint = await snsClient.send(new CreatePlatformEndpointCommand({
                PlatformApplicationArn: platformArn,
                Token: token,
                CustomUserData: userId
            }));
            endpointArn = endpoint.EndpointArn;
            console.log('Created new endpoint:', endpointArn);
        }

        // Store/update in DynamoDB
        const timestamp = Date.now();
        await dynamodb.send(new PutCommand({
            TableName: process.env.DEVICE_TOKENS_TABLE || 'device-tokens',
            Item: {
                userId,
                deviceId,
                platform,
                token,
                endpointArn,
                createdAt: existingDevice.Item?.createdAt || timestamp,
                updatedAt: timestamp,
                active: true
            }
        }));

        console.log('Device registered successfully');

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                success: true,
                endpointArn,
                message: 'Device registered successfully'
            })
        };

    } catch (error) {
        console.error('Error registering device:', error);

        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                error: 'Internal server error',
                message: error.message
            })
        };
    }
};
