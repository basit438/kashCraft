import { adminRegister } from "@/app/controllers/adminController";

export async function POST(req){

    return adminRegister(req);
}








// enable the following line if we want to verify that the user is an admin
    //  const adminVerification = verifyAdmin(req);
    //   if (adminVerification instanceof Response) {
    //     return adminVerification;
    //   }