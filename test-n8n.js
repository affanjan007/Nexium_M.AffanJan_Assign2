// Test script to debug n8n webhook
const testUrl = 'https://fashionjackson.com/';
const webhookUrl = 'http://localhost:5678/webhook/blog-extractor';

async function testWebhook() {
  console.log('🧪 Testing n8n webhook...');
  console.log('📄 Test URL:', testUrl);
  console.log('🔗 Webhook URL:', webhookUrl);
  
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      body: JSON.stringify({ url: testUrl }),
    });

    console.log('📡 Response Status:', response.status);
    console.log('📡 Response Headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error Response:', errorText);
      return;
    }

    const data = await response.json();
    console.log('✅ Success Response:', JSON.stringify(data, null, 2));
    
  } catch (error) {
    console.error('❌ Network Error:', error.message);
    console.error('📊 Error Stack:', error.stack);
  }
}

// Run the test
testWebhook();