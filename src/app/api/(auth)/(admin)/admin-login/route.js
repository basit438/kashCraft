import { adminLogin } from "../../../../controllers/adminController";
export async function POST(req) {

  return await adminLogin(req);
}
