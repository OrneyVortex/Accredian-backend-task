"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateRandomCode_1 = require("../utils/generateRandomCode");
const md5_1 = __importDefault(require("md5"));
const router = (0, express_1.Router)();
const prismaClient = new client_1.PrismaClient();
router.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const existingUser = yield prismaClient.user.findFirst({
            where: {
                email: email,
            },
        });
        if (existingUser) {
            if (existingUser.password !== (0, md5_1.default)(password)) {
                return res.status(401).json({ message: "Invalid credentials" });
            }
            const token = jsonwebtoken_1.default.sign({
                userId: existingUser.id,
            }, process.env.JWT_SECRET || "");
            res.json({ token });
        }
        else {
            res.status(404).json({ message: "User not found" });
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
}));
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, name, password } = req.body;
        //check if already created
        const existingUser = yield prismaClient.user.findFirst({
            where: {
                email: email,
            },
        });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        // Step 1: Create the new user (User B)
        const newUser = yield prismaClient.user.create({
            data: {
                email,
                name,
                referrerCode: (0, generateRandomCode_1.generateRandomCode)(), // Implement this function to generate unique codes,
                password: (0, md5_1.default)(password),
            },
        });
        // Step 2: Check if there's a pending referral for this email
        const referral = yield prismaClient.referral.findFirst({
            where: { referredEmail: email },
        });
        if (referral) {
            // Step 3: Update the referral status to 'completed'
            yield prismaClient.referral.update({
                where: { id: referral.id },
                data: { referralStatus: "completed" },
            });
            // Step 4: Create a reward for the referrer (User A)
            yield prismaClient.reward.create({
                data: {
                    userId: referral.referrerId,
                    rewardAmount: 10.0, // Set your reward amount
                },
            });
        }
        console.log("User signed up and referral processed:", newUser);
        res.json(newUser);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
exports.default = router;
