import { NextResponse } from "next/server";
import { sellerLogin } from "@/app/controllers/userController";

export async function POST(req) {
  return await sellerLogin(req);
}
