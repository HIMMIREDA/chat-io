let allowedOrigins;
if (process.env.NODE_ENV === "development") {
  allowedOrigins = ["http://localhost:3000/", "http://localhost:5000/"];
} else {
  // to modify in production
  allowedOrigins = [];
}

const corsOptions = {
  origin: (origin, callback) => {
    
    // remove !origin in production
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};


module.exports = corsOptions;