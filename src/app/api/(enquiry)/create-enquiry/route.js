import { createEnquiry } from "@/app/controllers/(enquiry)/createEnquiry";

export async function POST(req) {
    return createEnquiry(req);
}