import { registerSeller } from "../../../controllers/userController.js";

export async function POST(req) {
  return registerSeller(req);
}
