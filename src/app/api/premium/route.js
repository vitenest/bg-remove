import { NextResponse } from 'next/server';

export async function GET(request) {
  // This endpoint simulates a premium service that requires payment via x402 or MPP.
  // We return a 402 Payment Required response with the required headers.
  
  return NextResponse.json({ 
    error: "Payment Required",
    message: "This endpoint requires an agent-native payment to proceed."
  }, {
    status: 402,
    headers: {
      'x-x402-facilitator': 'https://pay.example.com/x402',
      'x-x402-wallet': '0xABC123DEF456',
      'x-payment-intent': 'charge',
      'x-payment-amount': '50',
      'x-payment-currency': 'USD'
    }
  });
}
