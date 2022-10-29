let allowedOrigins;
if (process.env.NODE_ENV === "development") {
  allowedOrigins = ["http://localhost:3000/", "http://localhost:5000/"];
} else {
  // to modify in production
  allowedOrigins = [];
}

const corsOptions = {
  origin: (origin, callback) => {
    const allowed =
      process.env.NODE_ENV === "production"
        ? allowedOrigins.indexOf(origin) !== -1
        : allowedOrigins.indexOf(origin) !== -1 || !origin;
    // remove !origin in production
    if (allowed) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

module.exports = corsOptions;
