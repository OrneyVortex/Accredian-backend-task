import { Request, Response, Router } from "express";
// import { verifyUser } from "../middlewares/authorization";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prismaClient = new PrismaClient();

router.post("/", async (req: Request, res: Response) => {
  try {
    // const user = req.user;
    const { referredEmail } = req.body;
    // create a new referral
    const referral = await prismaClient.referral.create({
      data: {
        referrerId: "cly94sisa00006fmg24kdfxbp",
        referredEmail,
      },
    });

    res.json(referral);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Error" });
  }
});

export default router;
