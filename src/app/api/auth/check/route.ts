export async function GET() {
  return Response.json({
    message: 'Auth check working',
    timestamp: new Date().toISOString()
  });
}