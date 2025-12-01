import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * Seller Inquiries API
 * Phase 6 Step 5 - Seller inquiry and consignment management
 */

export async function GET(_request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Mock data for now (implement database storage later)
    const inquiries = [
      {
        id: "1",
        sellerName: "John Smith",
        email: "john.smith@email.com",
        phone: "(555) 123-4567",
        inquiryType: "consignment",
        status: "pending",
        itemDescription: "Antique Victorian writing desk, mahogany, circa 1880",
        category: "Furniture",
        estimatedValue: 2500,
        images: [],
        submittedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        notes: "Found in grandmother's estate",
        adminNotes: [],
      },
      {
        id: "2",
        sellerName: "Sarah Johnson",
        email: "sarah.j@email.com",
        phone: "(555) 234-5678",
        inquiryType: "appraisal",
        status: "reviewing",
        itemDescription: "Collection of rare stamps from 1920s-1940s",
        category: "Collectibles",
        estimatedValue: 1200,
        images: [],
        submittedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
        notes: "Inherited from father who was an avid collector",
        adminNotes: [
          "Contacted stamp expert for valuation",
          "Initial assessment looks promising",
        ],
      },
      {
        id: "3",
        sellerName: "Michael Brown",
        email: "mbrown@email.com",
        phone: "(555) 345-6789",
        inquiryType: "direct-sale",
        status: "approved",
        itemDescription: "Mid-century modern lounge chair, original upholstery",
        category: "Furniture",
        estimatedValue: 800,
        images: [],
        submittedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
        notes: "Moving sale, excellent condition",
        adminNotes: [
          "Approved for listing",
          "Photos requested",
          "Contract sent",
        ],
      },
      {
        id: "4",
        sellerName: "Emily Davis",
        email: "emily.davis@email.com",
        phone: "(555) 456-7890",
        inquiryType: "consignment",
        status: "completed",
        itemDescription: "Set of vintage Royal Doulton figurines",
        category: "Ceramics",
        estimatedValue: 450,
        images: [],
        submittedAt: new Date(Date.now() - 86400000 * 14).toISOString(),
        notes: "Complete set of 6 pieces",
        adminNotes: ["Listing created", "All pieces sold", "Payment processed"],
      },
      {
        id: "5",
        sellerName: "Robert Wilson",
        email: "rwilson@email.com",
        phone: "(555) 567-8901",
        inquiryType: "general",
        status: "rejected",
        itemDescription: "Reproduction Art Deco lamp",
        category: "Lighting",
        estimatedValue: 150,
        images: [],
        submittedAt: new Date(Date.now() - 86400000 * 10).toISOString(),
        notes: "Interested in selling",
        adminNotes: [
          "Item is a reproduction, not authentic antique",
          "Explained our authenticity policy",
        ],
      },
    ];

    return NextResponse.json({ inquiries });
  } catch (error) {
    console.error("Error fetching seller inquiries:", error);
    return NextResponse.json(
      { error: "Failed to fetch inquiries" },
      { status: 500 },
    );
  }
}

