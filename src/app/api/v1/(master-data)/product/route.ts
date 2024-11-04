import { db } from "@/drizzle/drizzle";
import {
  attributes,
  categories,
  NewProduct,
  products,
  units,
} from "@/drizzle/schema/MasterData/masterData.schema";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import { asc, eq, or, sql } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import path from "path";
import { alias } from "drizzle-orm/pg-core";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const perPage = parseInt(searchParams.get("perPage") || "10");
    const searchTerm = searchParams.get("search") || "";
    const offset = (page - 1) * perPage;

    //aliasing
    const unitBase = alias(units, "unitBase");
    const unitSub = alias(units, "unitSub");
    const attribute1 = alias(attributes, "attribute1");
    const attribute2 = alias(attributes, "attribute2");
    const attribute3 = alias(attributes, "attribute3");

    const allProducts = await db
      .select({
        product_id: products.product_id,
        name: products.name,
        image: products.image,
        category: categories,
        attribute1: attribute1,
        attribute2: attribute2,
        attribute3: attribute3,
        qty_min: products.qty_min,
        qty_max: products.qty_max,
        unit_base: unitBase,
        unit_sub: unitSub,
        convertion_factor: products.convertion_factor,
        product_code: products.product_code,
      })
      .from(products)
      .where(
        or(
          sql`${products.name} ILIKE ${`%${searchTerm}%`}`,
          sql`${products.product_code} ILIKE ${`%${searchTerm}%`}`,
          sql`${categories.name} ILIKE ${`%${searchTerm}%`}`
        )
      )
      .leftJoin(categories, eq(products.category_id, categories.category_id))
      .leftJoin(attribute1, eq(products.attribute1_id, attribute1.attribute_id))
      .leftJoin(attribute2, eq(products.attribute2_id, attribute2.attribute_id))
      .leftJoin(attribute3, eq(products.attribute3_id, attribute3.attribute_id))
      .leftJoin(unitBase, eq(products.unit_base_id, unitBase.unit_id))
      .leftJoin(unitSub, eq(products.unit_sub_id, unitSub.unit_id))
      .orderBy(asc(products.name))
      .offset(offset)
      .limit(perPage);

    const totalCountResult = await db
      .select({ count: sql<number>`count(*)`.as("count") })
      .from(products)
      .leftJoin(categories, eq(products.category_id, categories.category_id))
      .where(
        or(
          sql`${products.name} ILIKE ${`%${searchTerm}%`}`,
          sql`${products.product_code} ILIKE ${`%${searchTerm}%`}`,
          sql`${categories.name} ILIKE ${`%${searchTerm}%`}`
        )
      );

    const totalCount = Number(totalCountResult[0].count);

    return NextResponse.json({
      status: 200,
      status_message: "Products data retrieved",
      data: allProducts,
      pagination: {
        currentPage: page,
        perPage: perPage,
        totalItems: totalCount,
        totalPages: Math.ceil(totalCount / perPage),
      },
    });
  } catch (error) {
    console.error("Error retrieving products:", error);
    return NextResponse.json(
      {
        status: 500,
        status_message: "Failed to retrieve products",
        data: {},
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const name = formData.get("name")?.toString() || "";
    const category_id = parseInt(
      formData.get("category_id")?.toString() || "0"
    );
    const attribute1_id = parseInt(
      formData.get("attribute_1_id")?.toString() || "0"
    );
    const attribute2_id =
      parseInt(formData.get("attribute_2_id")?.toString() || "0") || null;
    const attribute3_id =
      parseInt(formData.get("attribute_3_id")?.toString() || "0") || null;
    const qty_min = parseInt(formData.get("qty_min")?.toString() || "0");
    const qty_max = parseInt(formData.get("qty_max")?.toString() || "0");
    const unit_base_id = parseInt(
      formData.get("unit_base_id")?.toString() || "0"
    );
    const unit_sub_id = parseInt(
      formData.get("unit_sub_id")?.toString() ||
        formData.get("unit_base_id")?.toString() ||
        "0"
    );
    const convertion_factor = parseInt(
      formData.get("convertion_factor")?.toString() || "1"
    );
    const product_code = formData.get("product_code")?.toString() || "";

    const file = formData.get("file") as File;

    if (
      !name ||
      !category_id ||
      !qty_min ||
      !qty_max ||
      !unit_base_id ||
      !file ||
      !product_code
    ) {
      return NextResponse.json(
        {
          status: "fail",
          data: "Missing required fields",
        },
        { status: 400 }
      );
    }

    const fileExtension = file.name.split(".").pop();
    const uniqueFilename = `${randomUUID()}_${Date.now()}.${fileExtension}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    const productDir = path.join(process.cwd(), "public", "product");

    // Ensure the directory exists
    if (!fs.existsSync(productDir)) {
      fs.mkdirSync(productDir, { recursive: true });
    }
    fs.writeFileSync(path.join(productDir, uniqueFilename), buffer);

    const image = `/product/${uniqueFilename}`;

    // Tambah product code
    const newProductData: NewProduct = {
      name,
      image,
      category_id,
      attribute1_id: attribute1_id || null,
      attribute2_id: attribute2_id || null,
      attribute3_id: attribute3_id || null,
      qty_min,
      qty_max,
      unit_base_id,
      unit_sub_id,
      convertion_factor,
      product_code,
    };

    const newProduct = await db
      .insert(products)
      .values(newProductData)
      .returning();

    return NextResponse.json(
      {
        status: "201",
        message: "Product created successfully",
        data: newProduct[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      {
        status: "fail",
        data: "Failed to create product",
      },
      { status: 500 }
    );
  }
}
