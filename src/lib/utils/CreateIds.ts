import { db } from '@/drizzle/drizzle';
import { sql } from 'drizzle-orm';

// Helper function to create a unique ID for a record
export async function createID(title: string, tableName: string, idColumnName: string) {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dateString = `${year}${month}${day}`;

  // Construct the query dynamically
  const query = sql`
    SELECT ${sql.raw(idColumnName)} as id
    FROM ${sql.raw(tableName)}
    WHERE SUBSTRING(${sql.raw(idColumnName)}, ${title.length + 1}, 8) = ${dateString}
    ORDER BY ${sql.raw(idColumnName)} DESC
    LIMIT 1
  `;

  // Execute the query
  const result = await db.execute(query);
  const latestEntry = result.rows;

  let sequenceNumber = 1;
  if (latestEntry.length > 0) {
    const latestId: any = latestEntry[0].id;
    const latestSequence = parseInt(latestId.slice(-5));
    sequenceNumber = latestSequence + 1;
  }

  const paddedSequence = String(sequenceNumber).padStart(5, '0');

  return `${title}${dateString}${paddedSequence}`;
}
