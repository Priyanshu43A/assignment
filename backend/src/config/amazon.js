const config = {
  // Amazon OAuth Configuration
  amazon: {
    clientId: process.env.AMAZON_CLIENT_ID,
    clientSecret: process.env.AMAZON_CLIENT_SECRET,
    redirectUri: process.env.AMAZON_REDIRECT_URI,
    // Seller Central URLs for different regions
    sellerCentralUrls: {
      na: "https://sellercentral.amazon.com",
      eu: "https://sellercentral-europe.amazon.com",
      fe: "https://sellercentral.amazon.com.au",
      in: "https://sellercentral.amazon.in",
    },
    // OAuth endpoints
    oauthEndpoints: {
      token: "https://api.amazon.in/auth/o2/token",
      authorize: "/apps/authorize/consent",
    },
  },
};

export default config;
