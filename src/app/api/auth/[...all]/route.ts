//src/app/api/auth/[...all]/route.ts
import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth";
import arcjet, { protectSignup } from "@arcjet/next";
import { NextRequest, NextResponse } from "next/server";

export const { GET } = toNextJsHandler(auth);
export const POST = async (req: NextRequest) => {
  const res = await auth.handler(req);
  return res;
};
// const aj = arcjet({
//   key: process.env.ARCJET_KEY!, // Get your site key from https://app.arcjet.com
//   rules: [
//     protectSignup({
//       email: {
//         mode: "LIVE", // will block requests. Use "DRY_RUN" to log only
//         // Block emails that are disposable, invalid, or have no MX records
//         block: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
//       },
//       bots: {
//         mode: "LIVE",
//         // configured with a list of bots to allow from
//         // https://arcjet.com/bot-list
//         allow: [], // "allow none" will block all detected bots
//       },
//       // It would be unusual for a form to be submitted more than 5 times in 10
//       // minutes from the same IP address
//       rateLimit: {
//         // uses a sliding window rate limit
//         mode: "LIVE",
//         interval: "10m", // counts requests over a 10 minute sliding window
//         max: 5, // allows 5 submissions within the window
//       },
//     }),
//   ],
// });

// const betterAuthHandler = toNextJsHandler(auth.handler);
// const ajProtectedPOST = async (req: NextRequest) => {
//   const { email } = await req.clone().json();

//   const decision = await aj.protect(req, { email });
//   if (decision.isDenied()) {
//     if (decision.reason.isEmail()) {
//       let message = "";
//       if (decision.reason.emailTypes.includes("INVALID")) {
//         message = "Invalid email address format";
//       } else if (decision.reason.emailTypes.includes("DISPOSABLE")) {
//         message = "We do not allow disposable email addresses";
//       } else if (decision.reason.emailTypes.includes("NO_MX_RECORDS")) {
//         message = "Email address has no MX records";
//       } else {
//         message = "Email address is invalid";
//       }
//       return NextResponse.json(
//         { message, reason: decision.reason },
//         { status: 400 }
//       );
//     } else {
//       return NextResponse.json({ message: "Forbidden" }, { status: 403 });
//     }
//   } else {
//     return betterAuthHandler.POST(req);
//   }
// };
// export { ajProtectedPOST as POST };
// export const { GET } = betterAuthHandler;
