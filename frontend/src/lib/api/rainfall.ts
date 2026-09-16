export async function getRainfall() {
  const response = await fetch("https://pravah-ergp.onrender.com/api/rainfall");

  if (!response.ok) {
    throw new Error(
      `Rainfall request failed with status ${response.status}`
    );
  }

  return response.json();
}