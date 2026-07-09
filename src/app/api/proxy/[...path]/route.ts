// src/app/api/proxy/[...path]/route.ts
import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL; // server-only, NOT NEXT_PUBLIC_*

async function proxyRequest(
  request: NextRequest,
  { params }: { params: { path: string[] } },
) {
  const accessToken = request.cookies.get("memo_access")?.value;

  // Rebuild the target URL: /api/proxy/institutions -> {BACKEND_URL}/api/v1/institutions
  const path = params.path.join("/");
  const search = request.nextUrl.search; // preserves ?query=params
  const targetUrl = `${BACKEND_URL}/api/v1/${path}${search}`;

  // Forward the body for methods that have one
  const hasBody = !["GET", "HEAD"].includes(request.method);
  const body = hasBody ? await request.text() : undefined;

  const response = await fetch(targetUrl, {
    method: request.method,
    headers: {
      "Content-Type": request.headers.get("Content-Type") ?? "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body,
  });

  const data = await response.text();

  return new NextResponse(data, {
    status: response.status,
    headers: {
      "Content-Type":
        response.headers.get("Content-Type") ?? "application/json",
    },
  });
}

// Export one handler per HTTP verb you need
export {
  proxyRequest as GET,
  proxyRequest as POST,
  proxyRequest as PUT,
  proxyRequest as PATCH,
  proxyRequest as DELETE,
};
