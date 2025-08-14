import { createServerSupabaseClient } from "@/lib/supabase-server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();

    // Test auth
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    console.log("Auth test:", { user: user?.id, authError });

    // Test database connection
    const { data: tables, error: tablesError } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_schema", "public");

    console.log("Tables test:", { tables, tablesError });

    // Test users table
    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("*")
      .limit(5);

    console.log("Users test:", { users, usersError });

    return NextResponse.json({
      auth: { user: user?.id, error: authError?.message },
      tables: { data: tables, error: tablesError?.message },
      users: { data: users, error: usersError?.message },
    });
  } catch (error) {
    console.error("Debug API error:", error);
    return NextResponse.json(
      { error: "Debug failed", details: error },
      { status: 500 }
    );
  }
}
