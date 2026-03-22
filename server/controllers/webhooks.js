import User from "../models/User.js";
import { Webhook } from "svix";

// Sync Clerk users to MongoDB on signup
export const clerkWebhooks = async (req, res) => {
  try {

    const secret = process.env.CLERK_WEBHOOK_SECRET;

    if (!secret) {
      return res.status(500).json({
        success: false,
        message: "Missing Clerk webhook secret"
      });
    }

    const svixId = req.headers["svix-id"];
    const svixTimestamp = req.headers["svix-timestamp"];
    const svixSignature = req.headers["svix-signature"];

    const wh = new Webhook(secret);

    const payload = req.body;

    const event = wh.verify(payload, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    });

    // Only handle relevant events
    if (event.type === "user.created" || event.type === "user.updated") {

      const userData = event.data;

      let email = null;

      if (
        Array.isArray(userData.email_addresses) &&
        userData.email_addresses.length > 0
      ) {
        email = userData.email_addresses[0].email_address;
      }

      // ✅ Atomic UPSERT (VERY IMPORTANT)
      await User.findByIdAndUpdate(
        userData.id,
        {
          name: `${userData.first_name || ""} ${userData.last_name || ""}`.trim(),
          email,
          image: userData.image_url,
        },
        {
          upsert: true, // create if not exists
          new: true,
        }
      );
    }

    return res.status(200).json({ success: true });

  } catch (error) {

    console.error("Webhook Error:", error.message);

    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
