export async function POST(request: Request) {
  return Response.json({
    message: 'Login API working',
    timestamp: new Date().toISOString()
  });
}