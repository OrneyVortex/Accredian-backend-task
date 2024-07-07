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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// import { verifyUser } from "../middlewares/authorization";
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const prismaClient = new client_1.PrismaClient();
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const user = req.user;
        const { referredEmail } = req.body;
        // create a new referral
        const referral = yield prismaClient.referral.create({
            data: {
                referrerId: "cly94sisa00006fmg24kdfxbp",
                referredEmail,
            },
        });
        res.json(referral);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Error" });
    }
}));
exports.default = router;
