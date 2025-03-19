import { deleteEnquiry } from "@/app/controllers/(enquiry)/deleteEnquiry";

export async function POST(req) {
  return deleteEnquiry(req);
}