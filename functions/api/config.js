export function onRequestGet(context) {
  return new Response(
    JSON.stringify({
      applicationId: context.env.SQUARE_APPLICATION_ID,
      locationId: context.env.SQUARE_LOCATION_ID,
      environment: context.env.SQUARE_ENVIRONMENT || 'sandbox',
    }),
    { headers: { 'Content-Type': 'application/json' } }
  );
}
