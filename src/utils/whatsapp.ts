const url = `https://graph.facebook.com/v21.0/${process.env.WA_URL_TOKEN}/messages`;

const headers = {
  Authorization: `Bearer ${process.env.WA_BEARER_TOKEN}`,
  'Content-Type': 'application/json',
};

export default async function sendWAMessage(
  message: string,
  to: string = '919161355522'
) {
  const body = JSON.stringify({
    messaging_product: 'whatsapp',
    to: to,
    type: 'text',
    text: {
      body: message,
    },
  });

  return (
    fetch(url, {
      method: 'POST',
      headers: headers,
      body: body,
    })
      .then((response) => response.json())
      // .then((data) => console.log('Success:', data))
      .catch((error) => console.error('Error:', error))
  );
}
