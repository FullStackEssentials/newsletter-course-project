import crypto from "crypto";

export const createRandomToken = () => crypto.randomBytes(64).toString("hex");
