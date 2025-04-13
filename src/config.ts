const port: string = process.env.PORT || "4000";

const HOST: string = process.env.HOST || "0.0.0.0";
const USER: string = "root";
const PASSWORD: string = process.env.DB_PASSWORD || "autosensechallengesecure";
const DB: string = "autosense";
const JWT_KEY: string = process.env.JWT_KEY || "secret";

export {
    port,
    HOST,
    USER,
    PASSWORD,
    DB,
    JWT_KEY,
};