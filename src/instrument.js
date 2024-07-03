import { useEffect } from "react";
import * as Sentry from "@sentry/react";
import {
    createRoutesFromChildren,
    matchRoutes,
    useLocation,
    useNavigationType,
} from "react-router-dom";

console.log('Initializing Sentry with DSN:', process.env.REACT_APP_SENTRY_DSN);
console.log('Sentry Environment:', process.env.REACT_APP_SENTRY_ENV);

Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
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
    environment: process.env.REACT_APP_SENTRY_ENV
});

// Function to send error to Discord webhook
function sendToWebhook(error) {
    const webhookUrl = process.env.REACT_APP_WEBHOOK;
    if (webhookUrl) {
        fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content: `Error occurred: ${error.message}`,
            }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to send error to webhook');
                }
            })
            .catch(err => console.error('Error sending error to webhook:', err));
    } else {
        console.error('REACT_APP_WEBHOOK environment variable not defined.');
    }
}

// Add a global error handler to catch unhandled errors
Sentry.getCurrentHub().addGlobalEventProcessor(event => {
    if (event.exception) {
        sendToWebhook(event.exception.values[0].value); // Send the first error
    }
    return event;
});

export default Sentry;
