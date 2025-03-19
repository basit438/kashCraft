import { updateEnquiry } from "@/app/controllers/(enquiry)/updateEnquiry";

export async function POST(req) {
    return updateEnquiry(req);
}