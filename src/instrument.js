import { useEffect } from "react";
import * as Sentry from "@sentry/react";
import {
    createRoutesFromChildren,
    matchRoutes,
    useLocation,
    useNavigationType,
} from "react-router-dom";

const sentryDsn = process.env.REACT_APP_SENTRY_DSN;
const sentryEnv = process.env.REACT_APP_SENTRY_ENV;
const webhookUrl = process.env.REACT_APP_WEBHOOK;
const ENV = process.env.REACT_APP_ENVIRONMENT;
const app = process.env.REACT_APP_NAME;
const appName = process.env.REACT_APP_NAME;

Sentry.init({
    dsn: sentryDsn,
    integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration(),
        Sentry.reactRouterV6BrowserTracingIntegration({
            useEffect,
            useLocation,
            useNavigationType,
            createRoutesFromChildren,
            matchRoutes,
        }),
    ],
    // Performance Monitoring
    tracesSampleRate: 1.0,
    // Session Replay
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    environment: sentryEnv
});

// Function to send error to Discord webhook
function sendToWebhook(error) {
    if (webhookUrl) {
        const time = new Date().toISOString();
        const sentryUrl = `https://sentry.io/organizations/${appName}/issues/?query=${error.eventId}`; // Replace YOUR_ORG and YOUR_PROJECT with your Sentry org and project

        const payload = {
            content: `There was an uncaught exception in your ${app} Frontend at ${time}`,
            embeds: [
                {
                    title: error.message || "Error",
                    description: error.stack || "No stack trace available",
                    color: 16515072,
                    url: sentryUrl,
                },
            ],
        };

        fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to send error to webhook: ${response.statusText}`);
                }
            })
            .catch(err => console.error('Error sending error to webhook:', err));
    } else {
        console.error('REACT_APP_WEBHOOK environment variable not defined.');
    }
}

// Add a global error handler to catch unhandled errors
Sentry.addEventProcessor((event) => {
    if (event.exception && ENV === 'production') {
        const error = event.exception.values?.[0];
        if (error) {
            sendToWebhook({
                message: error.value,
                eventId: event.event_id,
            });
        }
    }
    return event;
});

export default Sentry;