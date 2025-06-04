import axios from "axios";
import config from "../config/amazon.js";
import SellerToken from "../models/sellerToken.js";

const amazonAuthController = {
  // Generate authorization URL
  getAuthUrl: (req, res) => {
    const { region = "na" } = req.query;
    const sellerCentralUrl = config.amazon.sellerCentralUrls[region];

    if (!sellerCentralUrl) {
      return res.status(400).json({ error: "Invalid region" });
    }

    const authUrl = `${sellerCentralUrl}${config.amazon.oauthEndpoints.authorize}?application_id=${config.amazon.clientId}&version=beta`;
    res.json({ authUrl });
  },

  // Handle OAuth callback
  handleCallback: async (req, res) => {
    try {
      const { code, selling_partner_id, marketplace_id } = req.query;

      if (!code || !selling_partner_id || !marketplace_id) {
        return res.status(400).json({ error: "Missing required parameters" });
      }

      // Exchange authorization code for tokens
      const tokenResponse = await axios.post(
        config.amazon.oauthEndpoints.token,
        {
          grant_type: "authorization_code",
          code,
          client_id: config.amazon.clientId,
          client_secret: config.amazon.clientSecret,
          redirect_uri: config.amazon.redirectUri,
        }
      );

      const { access_token, refresh_token, expires_in } = tokenResponse.data;

      // Calculate token expiration
      const tokenExpiresAt = new Date(Date.now() + expires_in * 1000);

      // Save or update seller tokens
      await SellerToken.findOneAndUpdate(
        { sellerId: selling_partner_id },
        {
          sellerId: selling_partner_id,
          marketplaceId: marketplace_id,
          refreshToken: refresh_token,
          accessToken: access_token,
          tokenExpiresAt,
        },
        { upsert: true, new: true }
      );

      // Redirect to frontend success page
      res.redirect(`${process.env.FRONTEND_URL}/auth/success`);
    } catch (error) {
      console.error("OAuth callback error:", error);
      res.redirect(`${process.env.FRONTEND_URL}/auth/error`);
    }
  },

  // Refresh access token
  refreshToken: async (req, res) => {
    try {
      const { sellerId } = req.params;

      const sellerToken = await SellerToken.findOne({ sellerId });
      if (!sellerToken) {
        return res.status(404).json({ error: "Seller not found" });
      }

      const tokenResponse = await axios.post(
        config.amazon.oauthEndpoints.token,
        {
          grant_type: "refresh_token",
          refresh_token: sellerToken.refreshToken,
          client_id: config.amazon.clientId,
          client_secret: config.amazon.clientSecret,
        }
      );

      const { access_token, expires_in } = tokenResponse.data;
      const tokenExpiresAt = new Date(Date.now() + expires_in * 1000);

      sellerToken.accessToken = access_token;
      sellerToken.tokenExpiresAt = tokenExpiresAt;
      await sellerToken.save();

      res.json({ success: true });
    } catch (error) {
      console.error("Token refresh error:", error);
      res.status(500).json({ error: "Failed to refresh token" });
    }
  },
};

export default amazonAuthController;
