import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// Функция для получения инвойсов с amount = 666.00
async function listInvoices() {
  const targetAmount = 666.00;

  // Запрос к базе данных
  const data = await sql`
    SELECT invoices.amount, customers.name
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE invoices.amount = ${targetAmount}
  `;

  console.log('Query result:', data); // Для отладки

  // Проверяем, что данные были найдены
  if (!Array.isArray(data) || data.length === 0) {
    return { message: "No invoices found with amount 666" };
  }

  return data;
}

// Обработчик для GET-запроса
export async function GET() {
  try {
    const data = await listInvoices();
    console.log(data); // Для отладки
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error); // Логирование ошибки для диагностики
    return new Response(JSON.stringify({ error }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
