window.CLIENT_CONFIG = {
  name: "Madarasatun Nisa’i",
  motto: "ILIMI HASKEN RAYUWA",
  email: "ibrahimsadau6644@gmail.com",
  phones: ["07066144944", "08035458742"],
  theme: { logo: "assets/logo.png" },
  apiBaseUrl: "/api",

  support: {
    enabled: true,
    pageTitle: "Support the School",
    description: "Keep MADARASATUN NISA free for students! Your donations help with hosting, development, and resources.",
    suggestedAmounts: [500, 1000, 2000],
    recurring: true,
    paymentProviders: {
      stripe: { publicKey: "pk_test_xxxxxxx", productId: "prod_xxxxxx" },
      flutterwave: { publicKey: "FLWPUBK-xxxx" },
      paypal: { clientId: "Abcxxxx" }
    },
    bankTransfer: {
      enabled: true,
      accountName: "Madarasatun Nisa’i",
      accountNumber: "0123456789",
      bank: "Zenith Bank",
      qrCode: "assets/qrcode.png"
    },
    rewardTiers: [
      { minAmount: 500, title: "Shukran Supporter", description: "Support weekly, get special badge." },
      { minAmount: 2000, title: "Sponsor 1 Student", description: "Sponsor 1 student account for free." },
      { minAmount: 10000, title: "Premium Supporter", description: "Your name/logo on supporters page." }
    ]
  }
};
