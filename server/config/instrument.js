// Import with `import * as Sentry from "@sentry/node"` if you are using ESM
import * as Sentry from "@sentry/node"

Sentry.init({
  dsn: "https://e2a2392199d4a27a46baf3ffa39b563f@o4509310519148544.ingest.us.sentry.io/4509310523473920",
  integrations: [
    Sentry.mongooseIntegration()
  ],
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
});