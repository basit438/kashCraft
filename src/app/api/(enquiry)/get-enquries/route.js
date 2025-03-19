import { getEnquiries } from "@/app/controllers/(enquiry)/getEnquiries";

export async function GET(req) {
  return getEnquiries(req);
}