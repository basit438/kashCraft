import { registerUser } from "@/app/controllers/userController.js";

export async function POST(req) {
  return registerUser(req);
}
